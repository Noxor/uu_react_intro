import React from "react";
import Card from "react-bootstrap/Card";

import styles from "../css/recipeCard.module.css";

function RecipeCard(props) {
    return (
        <Card className={styles.customCard}>
            <Card.Body>
                <Card.Title>{props.recipe.name}</Card.Title>
                <Card.Img variant="top" src={props.recipe.imgUri} />
                <Card.Text>{props.recipe.description}</Card.Text>
            </Card.Body>
        </Card>
    );
}

export default RecipeCard;
