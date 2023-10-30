import React from "react";

import { Table } from "react-bootstrap";

function IngredientTableList(props) {
    return (
        <Table>
          <thead>
            <tr>
              <th>Jméno</th>
            </tr>
          </thead>
          <tbody>
            {props.ingredientList.map((ingredient) => {
              return (
                <tr key={ingredient.id}>
                  <td>{ingredient.name}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      );
}

export default IngredientTableList;
