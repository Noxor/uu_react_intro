import React from "react";
import Icon from "@mdi/react";
import { mdiChevronDown, mdiLoading } from "@mdi/js";

import Card from "react-bootstrap/Card";

import styles from "../css/header.module.css";

const logoPath = "./images/cover.jpg";

function Header(props) {
    return (
        <header className={styles.appHeader}>
            <img src={logoPath} className={styles.appLogo} alt="logo" />
            <p>
                Prepare to be amazed be simple recipes
            </p>
            <p>
                More cooming soon™
            </p>
            {props.loadState.state === "success" && <Icon className={styles.scrollChevron} path={mdiChevronDown} size={3} />}
            {props.loadState.state === "pending" && <Icon path={mdiLoading} spin={true} size={3} />}
            {props.loadState.state === "error" &&
                <Card className={styles.errorCard}><Card.Body>
                    <Card.Title>Došlo k chybě při načítání dat.</Card.Title>
                    <Card.Text>
                        <pre>{JSON.stringify(props.loadState.error, null, 2)}</pre>
                    </Card.Text></Card.Body>
                </Card>}
        </header>
    );
}

export default Header;
