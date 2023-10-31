import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from 'react-bootstrap/ListGroup';

import styles from "../css/recipeCard.module.css";

function RecipeCard(props) {
    let navigate = useNavigate();

    return (
        <Card className={`${styles.customCard} ${styles[props.size]}`}
            onClick={() => navigate("/recipe?id=" + props.recipe.id)}
            role="button">
            <Card.Img variant="top" src={props.recipe.imgUri} className={styles.coverImage}/>
            <Card.Body className={styles.body}>
                <Card.Title>{props.recipe.name}</Card.Title>
                <Card.Text className={styles.cardText}>{props.recipe.description}</Card.Text>
            </Card.Body>
            {props.showIngedients &&
                <ListGroup variant="flush">
                    {props.recipe.ingredients.map(i => <ListGroup.Item key={i.id}>{i.name}</ListGroup.Item>)}
                </ListGroup>
            }
        </Card>
    );
}

export default RecipeCard;
