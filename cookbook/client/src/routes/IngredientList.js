import { useEffect, useState } from "react";

import IngredientTableList from "../bricks/IngredientTableList";
import RouteLoaderPlaceholder from "../bricks/RouteLoaderPlaceholder";

import { loadJsonData } from "../helpers/restLoader";

import styles from "../css/ingredientList.module.css";

function IngredientList() {
    const [ingredientsLoadCall, setIngredientsLoadCall] = useState({
        state: "pending",
    });

    useEffect(() => {
        loadJsonData(`http://localhost:8000/ingredient/list`, setIngredientsLoadCall);
    }, []);



    return (<div className={styles.contentWrapper}>
        <RouteLoaderPlaceholder loadState={ingredientsLoadCall} />
        {ingredientsLoadCall.state === "success" && <IngredientTableList ingredientList={ingredientsLoadCall.data} />}
    </div>);

}

export default IngredientList;