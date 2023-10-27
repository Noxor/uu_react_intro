import './App.css';
import { useEffect, useState, useMemo } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./bricks/Header";
import RecipeList from "./bricks/RecipeList";

function App() {
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

  const combineState = combineStates([recipesLoadCall, ingredientsLoadCall]);

  return (
    <div className="App">
      <Header loadState={combineState}></Header>
      {combineState.state === "success" && <RecipeList recipeList={mergedRecipeList} />}
    </div>
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

const loadJsonData = async (url, updateState) => {
  try {
    let response = await fetch(url);
    let responseContent = "";
    try {
      responseContent = await response.text();
      responseContent = JSON.parse(responseContent);
    } catch (error) {
      updateState({ state: "error", error: { reason: "Unexpected server response", text: responseContent } });
      return;
    }

    if (response.status >= 400) {
      updateState({ state: "error", error: responseContent });
    } else {
      updateState({ state: "success", data: responseContent });
    }
  } catch (error) {
    debugger;
    updateState({ state: "error", error: { reason: "Unexpected error", data: error } });
  }
}

export default App;
