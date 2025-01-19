import React, { useState } from "react";
import styles from "./NavPopup.module.css";

function TabSelector({ sendTabToParent }) {
    const [activeTab, setActiveTab] = useState('Artist')
    const handleClick = (tab) => {
        setActiveTab(tab);
        sendTabToParent(tab);
    }
    return (

        <nav className={styles.tabSelector}>
            <p onClick={() => handleClick('Artist')} className={styles.tabName} style={{
                borderBottom: activeTab === "Artist" ? "2px solid green" : "none",
            }}>Artist</p>
            <p onClick={() => handleClick('Album')} className={styles.tabName} style={{
                borderBottom: activeTab === "Album" ? "2px solid green" : "none",
            }}>Album</p>
            <p onClick={() => handleClick('Song')} className={styles.tabName} style={{
                borderBottom: activeTab === "Song" ? "2px solid green" : "none",
            }}>Song</p>
            <p onClick={() => handleClick('Everything')} className={styles.tabName} style={{
                borderBottom: activeTab === "Everything" ? "2px solid green" : "none",
            }}>Everything</p>
        </nav>


    );
}
export default TabSelector