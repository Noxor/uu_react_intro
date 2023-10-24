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
    async function fetchRecipes() {
      let response = await fetch(`http://localhost:3000/recipe/list`);
      response = await response.json();

      if (response.status >= 400) {
        setRecipesLoadCall({ state: "error", error: response });
      } else {
        setRecipesLoadCall({ state: "success", data: response });
      }
    }

    fetchRecipes();
  }, []);

  useEffect(() => {
    async function fetchIngredients() {
      let response = await fetch(`http://localhost:3000/ingredient/list`);
      response = await response.json();

      if (response.status >= 400) {
        setIngredientsLoadCall({ state: "error", error: response });
      } else {
        setIngredientsLoadCall({ state: "success", data: response });
      }
    }

    fetchIngredients();
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

export default App;
