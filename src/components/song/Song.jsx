import React from "react";
import styles from "./song.module.css";
import { FaPlay, FaPause } from "react-icons/fa";

function Song(props) {
    function handleDelete(index) {
        props.deleteSong(index);
    }

    return (
        <section className={styles.songContainer}>
            <div className={styles.leftSection}>
                {props.rank > 0 && <h2 className={styles.ranking}>{props.rank}.</h2>}
                <button onClick={() => props.onPlay(props.songid)} className={styles.playButton}>
                    {props.isPlaying ? <FaPause /> : <FaPlay />}
                </button>
            </div>
            <div className={styles.songInfo}>
                <p className={styles.songName}>{props.name}</p>
                <p className={styles.songName}>{props.artist}</p>
                <p className={styles.songName}>{props.length}</p>
            </div>
            <p className={styles.deleteSongButton} onClick={() => handleDelete(props.index)}> &times;</p>
        </section >
    )
}
export default Song