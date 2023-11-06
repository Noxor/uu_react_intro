import React from "react";
import RecipeCard from "./RecipeCard";
import { ViewType } from "../helpers/constants";

function RecipeDetailedList({ recipeList, edit, remove }) {
    const getRecipeList = (recipeList) => recipeList.map((recipe) =>
        <div key={recipe.id} className="mb-3 col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4 col-xxl-3">
            <RecipeCard recipe={recipe} size={ViewType.Detailed} edit={edit} remove={remove} />
        </div>);

    return (<div className="row">
        {getRecipeList(recipeList)}
    </div>);
}

export default RecipeDetailedList;
