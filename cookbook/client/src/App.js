import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./bricks/Header";
import RecipeList from "./bricks/RecipeList";

let recipeList = require('./data/recipes.json');

function App() {
  return (
    <div className="App">
      <Header></Header>
      <RecipeList recipeList={recipeList} />
    </div>
  );
}

export default App;
