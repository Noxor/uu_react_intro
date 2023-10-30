import { useState } from 'react';

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Icon from "@mdi/react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { mdiDelete, mdiPlus } from "@mdi/js";

import styles from "../css/recipeForm.module.css";

function RecipeForm({ ingredientList, show, setShow }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        ingredients: [],
    });
    const [extraIngredient, setExtraIngredient] = useState({
        id: null,
        amount: 0,
        unit: "",
    });

    const handleClose = () => setShow(false);

    const copyFormDate = (formData) => ({ ...formData, ingredients: formData.ingredients.map(i => ({ ...i })) });

    const setMainField = (name, val) => {
        return setFormData((formData) => {
            const newData = copyFormDate(formData);
            newData[name] = val;
            return newData;
        });
    };

    const setIngredientField = (id, field, value) => {
        return setFormData((formData) => {
            const newData = copyFormDate(formData);
            newData.ingredients.find(i => i.id === id)[field] = value;
            return newData;
        });
    }

    const setExtraIngredientField = (id, field, value) => {
        return setExtraIngredient((extraIngredient) => {
            const newIngredient = { ...extraIngredient };
            newIngredient[field] = value;
            return newIngredient;
        });
    }

    const addIngredient = (ingredient) => {
        if (!ingredient.id) {
            alert("Vyberte ingredienci");
            return;
        }
        if (formData.ingredients.find(i => i.id === ingredient.id)) {
            alert("Ingredience již v receptu je");
            return;
        }

        return setFormData((formData) => {
            const newData = copyFormDate(formData);
            newData.ingredients.push(ingredient);
            return newData;
        });
    }

    const removeIngredient = (ingredient) => {
        return setFormData((formData) => {
            const newData = copyFormDate(formData);
            newData.ingredients = newData.ingredients.filter(i => i.id !== ingredient.id);
            return newData;
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const payload = copyFormDate(formData);

        console.log(payload);
    };

    const getIngredientHeader = () => {
        return (<Row className={styles.ingredientRow}>
            <Form.Group as={Col} className="mb-1 col-6">
                <Form.Label>Ingredience</Form.Label>
            </Form.Group>

            <Form.Group as={Col} className="mb-1 col-2">
                <Form.Label>Počet</Form.Label>
            </Form.Group>
            <Form.Group as={Col} className="mb-1 col-3">
                <Form.Label>Jednotka</Form.Label>
            </Form.Group>
            <Form.Group as={Col} className="col-1">
            </Form.Group>
        </Row>);
    }
    const getIngredientRow = (ingredient, extra) => {
        const updateMethod = extra ? setExtraIngredientField : setIngredientField;
        const buttonMethod = extra ? addIngredient : removeIngredient;

        return (
            <Row className={styles.ingredientRow} key={extra ? "extra" : ingredient.id}>
                <Form.Group as={Col} className="mb-1 col-6">
                    {!extra &&
                        <Form.Control
                            disabled
                            type="text"
                            value={ingredientList.find(i => i.id === ingredient.id)?.name ?? "Naznámá ingredience"}
                        />
                    }
                    {extra &&
                        <Form.Select
                            value={formData.id}
                            onChange={(e) => updateMethod(ingredient.id, "id", e.target.value)}
                        >
                            <option selected="true" disabled="true" >Ingredience</option>
                            {ingredientList.map(i => (<option value={i.id}>{i.name}</option>))}
                        </Form.Select>
                    }
                </Form.Group>

                <Form.Group as={Col} className="mb-1 col-2">
                    <Form.Control
                        type="number"
                        value={ingredient.amount}
                        onChange={(e) => updateMethod(ingredient.id, "amount", parseInt(e.target.value))}
                    />
                </Form.Group>
                <Form.Group as={Col} className="mb-1 col-3">
                    <Form.Control
                        type="text"
                        value={ingredient.unit}
                        onChange={(e) => updateMethod(ingredient.id, "unit", e.target.value)}
                    />
                </Form.Group>
                <Form.Group as={Col} className="col-1">
                    <Icon className={extra ? styles.addButton : styles.deleteButton}
                        role="button"
                        path={extra ? mdiPlus : mdiDelete}
                        size={1.2}
                        onClick={() => buttonMethod(ingredient)}
                    />
                </Form.Group>
            </Row>);
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static">
                <Form onSubmit={(e) => handleSubmit(e)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Vytvořit recept</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Název</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => setMainField("name", e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Postup</Form.Label>
                            <Form.Control
                                as="textarea" rows={5}
                                value={formData.description}
                                onChange={(e) => setMainField("description", e.target.value)}
                            />
                        </Form.Group>
                        {getIngredientHeader()}
                        {formData.ingredients.map(i => getIngredientRow(i, false))}
                        {getIngredientRow(extraIngredient, true)}

                    </Modal.Body>
                    <Modal.Footer>
                        <div className="d-flex flex-row gap-2">
                            <Button variant="secondary" onClick={handleClose}>
                                Zavřít
                            </Button>
                            <Button variant="primary" type="submit">
                                Vytvořit
                            </Button>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

export default RecipeForm;