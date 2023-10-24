import React from "react";
import Card from "react-bootstrap/Card";
import ListGroup from 'react-bootstrap/ListGroup';

import styles from "../css/recipeCard.module.css";

function RecipeCard(props) {
    return (
        <Card className={`${styles.customCard} ${styles[props.size]}`}>
            <Card.Img variant="top" src={props.recipe.imgUri} />
            <Card.Body className={styles.body}>
                <Card.Title>{props.recipe.name}</Card.Title>
                <Card.Text className={styles.cardText}>{props.recipe.description}</Card.Text>
            </Card.Body>
            {props.showIngedients &&
                <ListGroup variant="flush">
                    {props.recipe.ingredients.map(i => <ListGroup.Item>{i.name}</ListGroup.Item>)}
                </ListGroup>
            }
        </Card>
    );
}

export default RecipeCard;
