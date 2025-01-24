import React, { useEffect } from "react";
import styles from "./song.module.css";

function Song(props) {



    function handleDelete(index) {
        props.deleteSong(index);
    }

    return (
        <section className={styles.songContainer}>
            <h2 className={styles.ranking}>{props.rank}.</h2>
            <p className={styles.songName}>{props.name}</p>
            <p className={styles.songName}>{props.artist}</p>
            <p className={styles.songName}>{props.length}</p>
            <p className={styles.deleteSongButton} onClick={() => handleDelete(props.index)}> &times;</p>
        </section >
    )
}
export default Song