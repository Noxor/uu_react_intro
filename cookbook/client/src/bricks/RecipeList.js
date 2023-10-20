import React from "react";
import RecipeCard from "./RecipeCard";

import styles from "../css/recipeList.module.css";

function RecipeList(props) {
    return (<div className={styles.wrapper}>
        {getRecipeList(props.recipeList)}
    </div>);
}

const getRecipeList = (recipeList) => recipeList.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />);

export default RecipeList;
