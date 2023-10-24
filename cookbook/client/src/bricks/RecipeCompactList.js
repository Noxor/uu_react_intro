import React from "react";
import RecipeCard from "./RecipeCard";

import styles from "../css/recipeCardList.module.css";

function RecipeCompactList(props) {
    return (<div className={styles.container}>
        {getRecipeList(props.recipeList)}
    </div>);
}

const getRecipeList = (recipeList) => recipeList.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} size="compact" showIngedients={true} />);

export default RecipeCompactList;
