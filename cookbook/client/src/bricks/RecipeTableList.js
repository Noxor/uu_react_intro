import React from "react";

import { Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";

function RecipeTableList({ recipeList, edit }) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Jméno</th>
          <th>Popis</th>
          {typeof edit === 'function' &&
            <th>Upravit</th>}
        </tr>
      </thead>
      <tbody>
        {recipeList.map((recipe) => {
          return (
            <tr key={recipe.id}>
              <td>{recipe.name}</td>
              <td>{recipe.description}</td>
              {typeof edit === 'function' &&
                <th><Button variant="link" onClick={(e) => edit(e, recipe.id)}>Upravit</Button></th>}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default RecipeTableList;
