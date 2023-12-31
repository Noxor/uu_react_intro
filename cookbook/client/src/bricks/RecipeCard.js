import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from 'react-bootstrap/ListGroup';
import Button from "react-bootstrap/Button";
import Icon from "@mdi/react";

import { mdiNoteEditOutline, mdiDeleteOutline } from "@mdi/js";

import styles from "../css/recipeCard.module.css";
import { ViewType } from "../helpers/constants";

function RecipeCard({ recipe, edit, remove, size, showIngedients }) {
    let navigate = useNavigate();

    return (
        <Card className={`${styles.customCard} ${getCardStyle(size)}`}
            onClick={() => navigate("/recipe?id=" + recipe.id)}
            role="button">
            <div className={styles.toolbar}>
                {typeof edit === 'function' &&
                    <Button variant="outline-warning"
                        className={styles.toolbarButton}
                        onClick={(e) => edit(e, recipe.id)}>
                        <Icon
                            path={mdiNoteEditOutline}
                            size={1}
                        />
                    </Button>}
                {typeof remove === 'function' &&
                    <Button variant="outline-danger"
                        className={styles.toolbarButton}
                        onClick={(e) => remove(e, recipe.id)}>
                        <Icon
                            path={mdiDeleteOutline}
                            size={1}

                        />
                    </Button>}
            </div>
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

const getCardStyle = (viewType)=>{
    switch (viewType) {
        case ViewType.Compact:
            return styles.compact;
        default:
            return null;
    }
}

export default RecipeCard;
