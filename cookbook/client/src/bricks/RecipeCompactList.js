import React from "react";
import RecipeCard from "./RecipeCard";

function RecipeCompactList(props) {
    return (<div className="row">
        {getRecipeList(props.recipeList)}
    </div>);
}

const getRecipeList = (recipeList) => recipeList.map((recipe) =>
    <div key={recipe.id} className="mb-3 col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2">
        <RecipeCard recipe={recipe} size="compact" showIngedients={true} />
    </div>);

export default RecipeCompactList;
