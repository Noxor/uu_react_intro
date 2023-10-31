import { useSearchParams } from "react-router-dom";

function RecipeDetail() {
    let [searchParams] = useSearchParams();
    const recipeId = searchParams.get("id");

    return <div>TODO RecipeDetail for [{recipeId}] recipe</div>;

}

export default RecipeDetail;