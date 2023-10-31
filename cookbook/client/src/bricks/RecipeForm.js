import { useState } from 'react';

import { toast } from 'react-toastify';

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Icon from "@mdi/react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { mdiDelete, mdiPlus, mdiOpenInNew, mdiLoading } from "@mdi/js";

import styles from "../css/recipeForm.module.css";

function RecipeForm({ ingredientList, show, setShow, onComplete }) {
    const defaultForm = {
        name: "",
        imgUri: "",
        description: "",
        ingredients: [],
    };
    const defaultIngredient = {
        id: "",
        amount: 0,
        unit: "",
    };

    const [recipeValidated, setRecipeValidated] = useState(false);
    const [ingredientValidated, setIngredientValidated] = useState(false);
    const [formData, setFormData] = useState(defaultForm);
    const [extraIngredient, setExtraIngredient] = useState(defaultIngredient);

    const [createRecipeCall, setCreateRecipeCall] = useState({
        state: 'inactive'
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

    const removeIngredient = (ingredient) => {
        return setFormData((formData) => {
            const newData = copyFormDate(formData);
            newData.ingredients = newData.ingredients.filter(i => i.id !== ingredient.id);
            return newData;
        });
    }

    const handleIngredientSubmit = (e, ingredient) => {
        console.log(ingredient);
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        if (formData.ingredients.find(i => i.id === ingredient.id)) {
            toast.error("Ingredience již v receptu je");
            return;
        }

        if (!form.checkValidity()) {
            setIngredientValidated(true);
            return;
        }

        setFormData((formData) => {
            const newData = copyFormDate(formData);
            newData.ingredients.push(ingredient);
            return newData;
        });

        setExtraIngredient(defaultIngredient);
        setIngredientValidated(false);
    }

    const handleFormSubmit = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        const payload = copyFormDate(formData);

        setIngredientValidated(false);
        if (!form.checkValidity()) {
            setRecipeValidated(true);
            toast.error("Nevalidní recept");
            return;
        }

        console.log(payload);

        setCreateRecipeCall({ state: 'pending' });
        const res = await fetch(`http://localhost:8000/recipe/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.status !== 200) {
            setCreateRecipeCall({ state: "error", error: data });
        } else {
            setCreateRecipeCall({ state: "success", data });
            if (typeof onComplete === 'function') {
                onComplete(data);
            }
            handleClose();
        }
    };

    const getIngredientHeader = () => {
        return (<Row className={styles.ingredientRow}>
            <Form.Group as={Col} className="mb-1 col-6">
                <Form.Label>Ingredience</Form.Label>
            </Form.Group>

            <Form.Group as={Col} className="mb-1 col-2">
                <Form.Label>Množství</Form.Label>
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
        const buttonMethod = extra ? () => { } : removeIngredient;

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
                        <>
                            <Form.Select
                                defaultValue={""}
                                value={ingredient.id}
                                onChange={(e) => updateMethod(ingredient.id, "id", e.target.value)}
                                required
                            >
                                <option value="" selected="true" disabled="true" >Ingredience</option>
                                {ingredientList.map(i => (<option value={i.id}>{i.name}</option>))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Vyberte ingredienci
                            </Form.Control.Feedback>
                        </>
                    }
                </Form.Group>

                <Form.Group as={Col} className="mb-1 col-2">
                    <Form.Control
                        className={styles.smallEditor}
                        type="number"
                        value={ingredient.amount}
                        onChange={(e) => updateMethod(ingredient.id, "amount", parseFloat(e.target.value))}
                        step="0.01"
                        min={0.1}
                        max={10}
                    />
                    <Form.Control.Feedback type="invalid">
                        Zadejte množství mezi 0.1 a 10, max 2 desetinny
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} className="mb-1 col-3">
                    <Form.Control
                        type="text"
                        value={ingredient.unit}
                        onChange={(e) => updateMethod(ingredient.id, "unit", e.target.value)}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Zadejte jednotku množství
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} className="col-1">
                    <Button type="submit" variant={extra ? "outline-success" : "outline-danger"}>
                        <Icon
                            path={extra ? mdiPlus : mdiDelete}
                            size={1.2}
                            onClick={() => buttonMethod(ingredient)}
                        />
                    </Button>
                </Form.Group>
            </Row>);
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static">

                <Modal.Header closeButton>
                    <Modal.Title>Vytvořit recept</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="recipeform" noValidate validated={recipeValidated} onSubmit={(e) => handleFormSubmit(e)}>
                        <Form.Group className="mb-1">
                            <Form.Label>Název</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => setMainField("name", e.target.value)}
                                maxLength={50}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Vyplňte jméno s max 20 znaky
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Row className={styles.ingredientRow}>
                            <Form.Group as={Col} className="mb-1 col-11">
                                <Form.Label>Url obrázku</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.imgUri}
                                    onChange={(e) => setMainField("imgUri", e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Vyplňte URL obrázku
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} className="col-1">
                                <Form.Label></Form.Label>
                                <a href={formData.imgUri}
                                    target="_blank"
                                    rel="noreferrer">
                                    <Icon className={styles.openImage}
                                        path={mdiOpenInNew}
                                        size={1.2}
                                    />
                                </a>
                            </Form.Group>
                        </Row>
                        <Form.Group className="mb-1">
                            <Form.Label>Postup</Form.Label>
                            <Form.Control
                                as="textarea" rows={5}
                                value={formData.description}
                                onChange={(e) => setMainField("description", e.target.value)}
                                maxLength={500}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Vyplňte postup s max 500 znaky
                            </Form.Control.Feedback>
                        </Form.Group>
                        {getIngredientHeader()}
                        {formData.ingredients.map(i => getIngredientRow(i, false))}
                        <Form.Group>
                            <Form.Control
                                value={formData.ingredients.length}
                                type="number"
                                hidden
                                min={1}
                            />
                            <Form.Control.Feedback type="invalid">
                                Přidejte alespoň 1 ingredienci
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                    <Form noValidate validated={ingredientValidated} onSubmit={(e) => handleIngredientSubmit(e, extraIngredient)}>
                        {getIngredientRow(extraIngredient, true)}
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex flex-row justify-content-between align-items-center w-100">
                        <div>
                            {createRecipeCall.state === 'error' &&
                                <div className="text-danger">Error: {createRecipeCall.error?.errorMessage}</div>
                            }
                        </div>
                        <div className="d-flex flex-row gap-2">
                            <Button variant="secondary" onClick={handleClose}>
                                Zavřít
                            </Button>
                            <Button variant="primary" type="submit" form="recipeform" disabled={createRecipeCall.state === 'pending'}>
                                {createRecipeCall.state === 'pending' ? (
                                    <Icon size={0.8} path={mdiLoading} spin={true} />
                                ) : (
                                    "Vytvořit"
                                )}
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>

            </Modal >
        </>
    );
}

export default RecipeForm;