import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import styles from "./NavPopup.module.css";
import { findArtistAndSongs, searchItem } from "../../../api/api.js";
import TabSelector from "./TabSelector.jsx";
import SongOption from "./songOption/SongOption.jsx";

function Popup() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [tab, setTab] = useState("Artist");
    const [header, setHeader] = useState(`Get songs form albums for an ${tab}`);
    const [options, setOptions] = useState([]);
    const togglePopup = () => {
        setIsOpen(!isOpen);
    };


    const closePopup = () => {
        setOptions([]);
        setIsOpen(false);
    };
    3;
    const handleSubmit = async () => {
        // console.log(options)
        setOptions([]);
        if (searchQuery === '') {
            return;
        }

        if (tab === "Artist") {
            setOptions(await searchItem("artist", searchQuery));

            // findArtistAndSongs(searchQuery, "album");
        }
        if (tab === "Song") {
            setOptions(await searchItem("track", searchQuery));
        }
        if (tab === "Everything") {
            setOptions(await searchItem("artist", searchQuery));
            // findArtistAndSongs(searchQuery, "album,single");
        }
        if (tab === "Album") {
            setOptions(await searchItem("album", searchQuery));
        }

    };

    const handleChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const handleTab = (data) => {
        setOptions([]);
        setTab(data);
        setHeader(createHeader(data));
    };
    const createHeader = (data) => {
        if (data === "Artist") {
            return `Get songs from albums for an artist`;
        }
        if (data === "Album") {
            return "Get songs from an album";
        }
        if (data === "Song") {
            return `Get a song`;
        }
        return "Get all songs, and singles for an artist";
    };
    return (
        <div>
            <button onClick={togglePopup}>
                <FaPlus />
            </button>

            {isOpen && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popupContent}>
                        <TabSelector sendTabToParent={handleTab} />
                        <h2>{header}</h2>
                        <input
                            type="text"
                            name="artist-name"
                            placeholder={tab === "Everything" ? "Artist" : tab}
                            value={searchQuery}
                            onChange={handleChange}
                        />
                        <p onClick={(event) => handleSubmit(event)} className={styles.submitButton}>Submit</p>
                        <SongOption type={tab} options={options} />
                        <button onClick={closePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Popup;
