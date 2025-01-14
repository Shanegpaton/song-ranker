import React, { useEffect } from "react";
import "./song.css";
import { songLists } from "../../api/songList";

function Song(props) {

    useEffect(() => { handleDelete }, [songLists]);

    function handleDelete(index) {
        props.deleteSong(index);
    }

    return (
        <section className="song-container">
            <h2>{props.rank}</h2>
            <p>{props.name}</p>
            <p>{props.artist}</p>
            <p>{props.length}</p>
            <p className="delete-song-button" onClick={() => handleDelete(props.index)}>X</p>
        </section >
    )
}
export default Song