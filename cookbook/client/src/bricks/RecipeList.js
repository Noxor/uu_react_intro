import React, { useState, useMemo } from "react";
import RecipeCompactList from "./RecipeCompactList";
import RecipeDetailedList from "./RecipeDetailedList";
import RecipeTableList from "./RecipeTableList";

import Icon from "@mdi/react";
import { mdiMagnify, mdiTable, mdiViewGrid, mdiViewGridCompact } from "@mdi/js";

import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

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
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        onChange={handleSearchDelete}
                    />
                    <Button variant="outline-success" type="submit">
                        <Icon size={1} path={mdiMagnify} />
                    </Button>
                    {viewType !== "compact" &&
                        <Button variant="outline-success"
                            onClick={() => setViewType(() => "compact")}>
                            <Icon size={1} path={mdiViewGridCompact} />
                        </Button>}
                    {viewType !== "detailed" &&
                        <Button variant="outline-success"
                            onClick={() => setViewType(() => "detailed")}>
                            <Icon size={1} path={mdiViewGrid} />
                        </Button>}
                    {viewType !== "table" &&
                        <Button variant="outline-success"
                            onClick={() => setViewType(() => "table")}>
                            <Icon size={1} path={mdiTable} />
                        </Button>}
                </Form>
            </Navbar>
            <div className={styles.contentWrapper}>
                {getRecipeListComponent()}
            </div>
        </div>
    );
}

export default RecipeList;
