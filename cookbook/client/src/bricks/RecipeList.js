import React from "react";
import RecipeCard from "./RecipeCard";

import styles from "../css/recipeList.module.css";

function RecipeList(props) {
    return (<div className={styles.wrapper}>
        {getRecipeList(props.recipeList)}
    </div>);
}

function getRecipeList(recipeList) {
    return recipeList.map((recipe) => {
        return <RecipeCard key={recipe.id} recipe={recipe} />;
    });
}

export default RecipeList;
