import React, { useState } from "react";
import styles from "./NavPopup.module.css";

function TabSelector({ sendTabToParent, currentTab }) {
    const [activeTab, setActiveTab] = useState(currentTab);
    console.log(activeTab)
    const handleClick = (tab) => {
        setActiveTab(tab);
        sendTabToParent(tab);
    }
    return (

        <nav className={styles.tabSelector}>
            <p onClick={() => handleClick('Artist')} className={styles.tabName} style={{
                borderBottom: activeTab === "Artist" ? "2px solid hsl(141, 73%, 42%)" : "none",
            }}>Artist</p>
            <p onClick={() => handleClick('Album')} className={styles.tabName} style={{
                borderBottom: activeTab === "Album" ? "2px solid hsl(141, 73%, 42%)" : "none",
            }}>Album</p>
            <p onClick={() => handleClick('Song')} className={styles.tabName} style={{
                borderBottom: activeTab === "Song" ? "2px solid hsl(141, 73%, 42%)" : "none",
            }}>Song</p>
            <p onClick={() => handleClick('Everything')} className={styles.tabName} style={{
                borderBottom: activeTab === "Everything" ? "2px solid hsl(141, 73%, 42%)" : "none",
            }}>Everything</p>
        </nav>


    );
}
export default TabSelector