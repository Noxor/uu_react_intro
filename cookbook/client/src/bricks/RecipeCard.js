import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from 'react-bootstrap/ListGroup';
import Button from "react-bootstrap/Button";
import Icon from "@mdi/react";

import { mdiNoteEditOutline } from "@mdi/js";

import styles from "../css/recipeCard.module.css";

function RecipeCard({ recipe, edit, size, showIngedients }) {
    let navigate = useNavigate();

    return (
        <Card className={`${styles.customCard} ${styles[size]}`}
            onClick={() => navigate("/recipe?id=" + recipe.id)}
            role="button">
            {typeof edit === 'function' &&
                <Button type="submit" variant="outline-warning" className={styles.editButton}>
                    <Icon
                        path={mdiNoteEditOutline}
                        size={1.2}
                        onClick={(e) => edit(e, recipe.id)}
                    />
                </Button>}
            <Card.Img variant="top" src={recipe.imgUri} className={styles.coverImage} />
            <Card.Body className={styles.body}>
                <Card.Title>{recipe.name}</Card.Title>
                <Card.Text className={styles.cardText}>{recipe.description}</Card.Text>
            </Card.Body>
            {showIngedients &&
                <ListGroup variant="flush">
                    {recipe.ingredients.map(i => <ListGroup.Item key={i.id}>{i.name}</ListGroup.Item>)}
                </ListGroup>
            }
        </Card>
    );
}

export default RecipeCard;
