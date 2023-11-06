import React from "react";
import RecipeCard from "./RecipeCard";
import { ViewType } from "../helpers/constants";

function RecipeCompactList({ recipeList, edit, remove }) {
    const getRecipeList = (recipeList) => recipeList.map((recipe) =>
        <div key={recipe.id} className="mb-3 col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2">
            <RecipeCard recipe={recipe} size={ViewType.Compact} showIngedients={true} edit={edit} remove={remove} />
        </div>);

    return (<div className="row">
        {getRecipeList(recipeList)}
    </div>);
}

export default RecipeCompactList;
