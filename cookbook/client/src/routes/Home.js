import React from "react";

import styles from "../css/home.module.css";

const logoPath = "./images/cover.jpg";

function Home(props) {
    return (
        <header className={styles.appHeader}>
            <img src={logoPath} className={styles.appLogo} alt="logo" />
            <p>
                Prepare to be amazed be simple recipes
            </p>
            <p>
                More cooming soon™
            </p>
        </header>
    );
}

export default Home;
