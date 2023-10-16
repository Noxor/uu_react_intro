import React from "react";
import Icon from "@mdi/react";
import { mdiChevronDown } from "@mdi/js";

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
            <Icon className={styles.scrollChevron} path={mdiChevronDown} size={3} />
        </header>
    );
}

export default Header;
