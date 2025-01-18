import React, { useState } from "react";
import { FaPlus } from 'react-icons/fa';
import styles from "./NavPopup.module.css";
import { findArtistAndSongs, searchItem } from "../../api/api.js";
import TabSelector from "./TabSelector.jsx";
function Popup() {
    const [isOpen, setIsOpen] = useState(false);
    const [artistName, setArtistName] = useState("");
    const [tab, setTab] = useState("Artist");
    const [header, setHeader] = useState(`Get songs form albums for an ${tab}`);
    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const closePopup = () => {
        setIsOpen(false);
    }; 3
    const handleSubmit = () => {
        if (tab === 'Artist') { findArtistAndSongs(artistName, 'album') };
        if (tab === "Song") { searchItem('track', artistName) };
        if (tab === 'Everything') { findArtistAndSongs(artistName, 'album,single') };
        if (tab === 'Album') { searchItem('album', artistName) };
    };
    const handleChange = (event) => {
        setArtistName(event.target.value);
    };
    const handleTab = (data) => {
        setTab(data)
        setHeader(createHeader(data));
    }
    const createHeader = (data) => {
        if (data === "Artist") {
            return (`Get songs from albums for an artist`);
        }
        if (data === 'Album') {
            return ('Get songs from an album')
        }
        if (data === "Song") {
            return (`Get a song`);
        }
        return ("Get all songs, and singles for an artist")
    }
    return (
        <div >
            <button onClick={togglePopup}><FaPlus /></button>

            {
                isOpen && (
                    <div className={styles.popupOverlay} >
                        <div className={styles.popupContent} >
                            <TabSelector sendTabToParent={handleTab} />
                            <h2>{header}</h2>
                            <input type="text" name="artist-name" placeholder={tab === "Everything" ? "Artist" : tab} value={artistName} onChange={handleChange} />
                            <p onClick={handleSubmit}>Submit</p>
                            <button onClick={closePopup}>Close</button>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default Popup;
