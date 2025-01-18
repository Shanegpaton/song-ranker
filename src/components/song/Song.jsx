import React, { useEffect } from "react";
import styles from "./song.module.css";
import { songLists } from "../../api/songList";

function Song(props) {

    useEffect(() => { handleDelete }, [songLists]);

    function handleDelete(index) {
        props.deleteSong(index);
    }

    return (
        <section className={styles.songContainer}>
            <h2>{props.rank}</h2>
            <p>{props.name}</p>
            <p>{props.artist}</p>
            <p>{props.length}</p>
            <p className={styles.deleteSongButton} onClick={() => handleDelete(props.index)}>X</p>
        </section >
    )
}
export default Song