//import './App.css';
import { useEffect, useState, useMemo } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import Icon from "@mdi/react";
import { mdiMagnify, mdiTable, mdiViewGrid, mdiViewGridCompact, mdiPlus } from "@mdi/js";

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

import { loadJsonData } from "../helpers/restLoader";

import styles from "../css/recipeList.module.css";

function RecipeList() {
    const [viewType, setViewType] = useState("detailed");
    const [searchBy, setSearchBy] = useState("");
    const [recipesLoadCall, setRecipesLoadCall] = useState({
        state: "pending",
    });

    const [ingredientsLoadCall, setIngredientsLoadCall] = useState({
        state: "pending",
    });

    useEffect(() => {
        loadJsonData(`http://localhost:8000/recipe/list`, setRecipesLoadCall);
    }, []);

    useEffect(() => {
        loadJsonData(`http://localhost:8000/ingredient/list`, setIngredientsLoadCall);
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
            case "compact":
                return (<RecipeCompactList recipeList={filteredRecipeList} />);
            case "detailed":
                return (<RecipeDetailedList recipeList={filteredRecipeList} />);
            case "table":
                return (<>
                    <div className="d-none d-sm-block">
                        <RecipeTableList recipeList={filteredRecipeList} />
                    </div>
                    <div className="d-block d-sm-none">
                        <RecipeDetailedList recipeList={filteredRecipeList} />
                    </div>
                </>);
            default:
                return (<RecipeDetailedList recipeList={filteredRecipeList} />);
        }
    }

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
                            Simple School
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="justify-content-end flex-grow-1">
                            <ToggleButtonGroup type="radio"
                                className="m-1"
                                name="view-options"
                                value={viewType}>
                                <ToggleButton variant="outline-success" value="detailed" onClick={() => setViewType("detailed")}>
                                    <Icon size={1} path={mdiViewGrid} />
                                </ToggleButton>
                                <ToggleButton className="d-none d-sm-block" variant="outline-success" value="table" onClick={() => setViewType("table")}>
                                    <Icon size={1} path={mdiTable} />
                                </ToggleButton>
                                <ToggleButton variant="outline-success" value="compact" onClick={() => setViewType("compact")}>
                                    <Icon size={1} path={mdiViewGridCompact} />
                                </ToggleButton>
                            </ToggleButtonGroup>
                            <Button variant="outline-primary" className="text-nowrap m-1">
                                <Icon size={1} path={mdiPlus} />
                                Vytvořit recept
                            </Button>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Navbar>
            <div className={styles.contentWrapper}>
                <RouteLoaderPlaceholder loadState={combinedStates} />
                {getRecipeListComponent()}
            </div>
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