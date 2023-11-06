//import './App.css';
import { useEffect, useState, useMemo, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import { toast } from 'react-toastify';

import Icon from "@mdi/react";
import { mdiMagnify, mdiTable, mdiViewGrid, mdiViewGridCompact, mdiPlus, mdiReload } from "@mdi/js";

import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";

import RecipeCompactList from "../bricks/RecipeCompactList";
import RecipeDetailedList from "../bricks/RecipeDetailedList";
import RecipeTableList from "../bricks/RecipeTableList";
import RouteLoaderPlaceholder from "../bricks/RouteLoaderPlaceholder";
import RecipeForm from "../bricks/RecipeForm";
import Dialog from "../bricks/Dialog";
import UserContext from "../UserProvider";

import { loadJsonData, performMethod } from "../helpers/restLoader";
import { ViewType } from "../helpers/constants";

import styles from "../css/recipeList.module.css";

function RecipeList() {
    const { isAuthorized } = useContext(UserContext);
    const [viewType, setViewType] = useState(ViewType.Detailed);
    const [searchBy, setSearchBy] = useState("");
    const [recipeFormShow, setRecipeFormShow] = useState({ show: false });
    const [confirmDeleteFormShow, setConfirmDeleteFormShow] = useState({ show: false });
    const [recipesLoadCall, setRecipesLoadCall] = useState({
        state: "pending",
    });

    const [ingredientsLoadCall, setIngredientsLoadCall] = useState({
        state: "pending",
    });

    const reloadRecipes = () => { loadJsonData(`http://localhost:8000/recipe/list`, setRecipesLoadCall) };

    useEffect(reloadRecipes, []);

    useEffect(() => {
        loadJsonData(`http://localhost:8000/ingredient/list`, (callData) => {
            if (callData.data) {
                callData.data.sort((a, b) => a.name.localeCompare(b.name));
            }
            setIngredientsLoadCall(callData)
        });
    }, []);

    const mergedRecipeList = useMemo(() => {
        console.log("Merging recipes");
        if (combineStates([recipesLoadCall, ingredientsLoadCall]).state !== "success") {
            return [];
        }

        return recipesLoadCall.data.map(recipe => {
            return {
                ...recipe, ingredients: recipe.ingredients.map(ingredient => {
                    return {
                        ...ingredient, name: ingredientsLoadCall.data.find(i => i.id === ingredient.id)?.name ?? "Zkuste Štestí"
                    }
                })
            }
        });


    }, [recipesLoadCall, ingredientsLoadCall]);

    const combinedStates = combineStates([recipesLoadCall, ingredientsLoadCall]);

    const filteredRecipeList = useMemo(() => {
        return mergedRecipeList.filter((item) => {
            return (
                item.name
                    .toLocaleLowerCase()
                    .includes(searchBy.toLocaleLowerCase()) ||
                item.description.toLocaleLowerCase().includes(searchBy.toLocaleLowerCase())
            );
        });
    }, [searchBy, mergedRecipeList]);

    function handleSearch(event) {
        event.preventDefault();
        setSearchBy(event.target["searchInput"].value);
    }

    function handleSearchDelete(event) {
        if (!event.target.value) setSearchBy("");
    }

    function getRecipeListComponent() {
        switch (viewType) {
            case ViewType.Compact:
                return compactList();
            case ViewType.Detailed:
                return detailedList();
            case ViewType.Table:
                return (<>
                    <div className="d-none d-sm-block">
                        {tableList()}
                    </div>
                    <div className="d-block d-sm-none">
                        {detailedList()}
                    </div>
                </>);
            default:
                return detailedList();
        }
    }

    const compactList = () => (<RecipeCompactList recipeList={filteredRecipeList} edit={getEditRecipeFunction()} remove={getRemoveRecipeFunction()} />);
    const detailedList = () => (<RecipeDetailedList recipeList={filteredRecipeList} edit={getEditRecipeFunction()} remove={getRemoveRecipeFunction()} />);
    const tableList = () => (<RecipeTableList recipeList={filteredRecipeList} edit={getEditRecipeFunction()} remove={getRemoveRecipeFunction()} />);

    const handleRecipeUpdate = (recipe) => {
        if (recipesLoadCall.state !== "success") {
            return;
        }

        setRecipesLoadCall((prev) => {
            let arrayCopy = [...prev.data]
            let index = arrayCopy.findIndex(r => r.id === recipe.id);
            if (index < 0) {
                index = arrayCopy.length;
            } else {
                arrayCopy.splice(index, 1)
            }
            arrayCopy.splice(index, 0, recipe);

            return {
                state: "success",
                data: arrayCopy
            }
        });
    }

    const handleRecipeRemove = (id) => {
        if (recipesLoadCall.state !== "success") {
            return;
        }

        setRecipesLoadCall((prev) => ({
            state: "success",
            data: prev.data.filter(r => r.id !== id)
        }));
    }

    const editRecipe = (e, id) => {
        e.preventDefault();
        e.stopPropagation();

        setRecipeFormShow({ show: true, recipe: recipesLoadCall.data.find(r => r.id === id) });
    }

    const removeRecipe = (e, id) => {
        e.preventDefault();
        e.stopPropagation();

        setConfirmDeleteFormShow({ show: true, id: id });
    }

    const callRemove = async (id) => {
        await performMethod(`http://localhost:8000/recipe/delete`,
            { id },
            () => handleRecipeRemove(id),
            (error) => toast.error(error));
    }

    const getEditRecipeFunction = () => isAuthorized ? editRecipe : null;

    const getRemoveRecipeFunction = () => isAuthorized ? removeRecipe : null;

    return (
        <>
            <Navbar sticky="top" className={`${styles.navbar} ${styles.controlWrapper}`} expand={"sm"}>
                <Form className="d-flex me-3" onSubmit={handleSearch}>
                    <Form.Control
                        id={"searchInput"}
                        type="search"
                        placeholder="Hledat"
                        className="me-2"
                        aria-label="Search"
                        onChange={handleSearchDelete}
                    />
                    <Button variant="outline-success" type="submit">
                        <Icon size={1} path={mdiMagnify} />
                    </Button>
                </Form>


                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm1`} />
                <Navbar.Offcanvas id={`offcanvasNavbar-expand-sm1`}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm1`}>
                            Seznam receptů
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="justify-content-end flex-grow-1">
                            <ToggleButtonGroup type="radio"
                                className="m-1"
                                name="view-options"
                                value={viewType}>
                                <ToggleButton variant="outline-success" value={ViewType.Detailed} onClick={() => setViewType(ViewType.Detailed)}>
                                    <Icon size={1} path={mdiViewGrid} />
                                </ToggleButton>
                                <ToggleButton className="d-none d-sm-block" variant="outline-success" value={ViewType.Table} onClick={() => setViewType(ViewType.Table)}>
                                    <Icon size={1} path={mdiTable} />
                                </ToggleButton>
                                <ToggleButton variant="outline-success" value={ViewType.Compact} onClick={() => setViewType(ViewType.Compact)}>
                                    <Icon size={1} path={mdiViewGridCompact} />
                                </ToggleButton>
                            </ToggleButtonGroup>
                            {isAuthorized &&
                                <Button variant="outline-primary"
                                    className="text-nowrap m-1"
                                    onClick={() => setRecipeFormShow({ show: true })}>
                                    <Icon size={1} path={mdiPlus} />
                                    Vytvořit
                                </Button>}
                            <Button variant="outline-success"
                                className="text-nowrap m-1"
                                onClick={reloadRecipes}>
                                <Icon size={1} path={mdiReload}></Icon>
                            </Button>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Navbar>
            <div className={styles.contentWrapper}>
                <RouteLoaderPlaceholder loadState={combinedStates} />
                {getRecipeListComponent()}
            </div>
            <RecipeForm
                ingredientList={ingredientsLoadCall.data ?? []}
                recipe={recipeFormShow.recipe}
                show={recipeFormShow.show}
                setShow={setRecipeFormShow}
                onComplete={handleRecipeUpdate}
            />
            <Dialog show={confirmDeleteFormShow.show}
                title={"Smazat recept"}
                text={"Opravdu chcete smazat tento recept?"}
                onCancel={() => setConfirmDeleteFormShow({ show: false })}
                onConfirm={() => { callRemove(confirmDeleteFormShow.id); setConfirmDeleteFormShow({ show: false }); }} />
        </>
    );
}

const combineStates = (sourceStates) => {
    const errorStates = sourceStates.filter(s => s.state === "error");
    if (errorStates.length > 0) {
        return { state: "error", error: errorStates.map(e => e.error) };
    }

    if (sourceStates.filter(s => s.state === "pending").length > 0) {
        return { state: "pending" }
    }

    return { state: "success" }
};

export default RecipeList;