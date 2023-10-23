import React from "react";

import { Table } from "react-bootstrap";

function RecipeTableList(props) {
    return (
        <Table>
          <thead>
            <tr>
              <th>Jméno</th>
              <th>Popis</th>
            </tr>
          </thead>
          <tbody>
            {props.recipeList.map((recipe) => {
              return (
                <tr key={recipe.id}>
                  <td>{recipe.name}</td>
                  <td>{recipe.description}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      );
}

export default RecipeTableList;
