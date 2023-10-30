import React from "react";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

import styles from "../css/routeLoaderPlaceholder.module.css";


function RouteLoaderPlaceholder(props) {
    return (
        <>
            {props.loadState.state === "pending" &&
                <Container className={styles.loadContainer}>
                    <Icon path={mdiLoading} spin={true} size={3} />
                </Container>}
            {props.loadState.state === "error" &&
                <Card className={styles.errorCard}>
                    <Card.Body>
                        <Card.Title>Došlo k chybě při načítání dat.</Card.Title>
                        <pre>{JSON.stringify(props.loadState.error, null, 2)}</pre>
                    </Card.Body>
                </Card>}
        </>
    );
}

export default RouteLoaderPlaceholder;
