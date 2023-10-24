import React, { useState, useMemo } from "react";
import RecipeCompactList from "./RecipeCompactList";
import RecipeDetailedList from "./RecipeDetailedList";
import RecipeTableList from "./RecipeTableList";

import Icon from "@mdi/react";
import { mdiMagnify, mdiTable, mdiViewGrid, mdiViewGridCompact } from "@mdi/js";

import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

import styles from "../css/recipeList.module.css";

function RecipeList(props) {
    const [viewType, setViewType] = useState("compact");
    const [searchBy, setSearchBy] = useState("");

    const filteredRecipeList = useMemo(() => {
        return props.recipeList.filter((item) => {
            return (
                item.name
                    .toLocaleLowerCase()
                    .includes(searchBy.toLocaleLowerCase()) ||
                item.description.toLocaleLowerCase().includes(searchBy.toLocaleLowerCase())
            );
        });
    }, [searchBy, props.recipeList]);

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
                return (<RecipeTableList recipeList={filteredRecipeList} />);
            default:
                return (<RecipeCompactList recipeList={filteredRecipeList} />);
        }
    }

    return (
        <div className={styles.container}>
            <Navbar sticky="top" className={styles.navbar}>
                <Form className="d-flex" onSubmit={handleSearch}>
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

                <ToggleButtonGroup type="radio"
                    name="view-options"
                    value={viewType}>
                    <ToggleButton variant="outline-success" value="compact" onClick={() => setViewType("compact")}>
                        <Icon size={1} path={mdiViewGridCompact} />
                    </ToggleButton>
                    <ToggleButton variant="outline-success" value="detailed" onClick={() => setViewType("detailed")}>
                        <Icon size={1} path={mdiViewGrid} />
                    </ToggleButton>
                    <ToggleButton variant="outline-success" value="table" onClick={() => setViewType("table")}>
                        <Icon size={1} path={mdiTable} />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Navbar>
            <div className={styles.contentWrapper}>
                {getRecipeListComponent()}
            </div>
        </div>
    );
}

export default RecipeList;
