import React, { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import styles from "./NavPopup.module.css";
import TabSelector from "./TabSelector.jsx";
import SongOption from "./songOption/SongOption.jsx";
import { useUnrankedSongsContext } from "../../../context/UnrankedSongs.jsx";
import axios from "axios";


function Popup() {

    const { addUnrankedSong } = useUnrankedSongsContext();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [tab, setTab] = useState("Artist");
    const [header, setHeader] = useState(`Get songs form albums for an ${tab}`);
    const [options, setOptions] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');


    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const closePopup = () => {
        setOptions([]);
        setIsOpen(false);
    };
    const handleSubmit = async () => {
        setOptions([]);
        setSelectedItem('');
        if (searchQuery === '') {
            return;
        }

        if (tab === "Artist") {
            const response = await axios.get("http://localhost:3000/spotify/search", {
                params: {
                    type: "artist",
                    name: searchQuery
                },
                withCredentials: true,
            });
            setOptions(response.data);

            // findArtistAndSongs(searchQuery, "album");
        }
        if (tab === "Song") {
            const response = await axios.get("http://localhost:3000/spotify/search", {
                params: {
                    type: "track",
                    name: searchQuery
                },
                withCredentials: true,
            });
            setOptions(response.data);
        }
        if (tab === "Everything") {
            const response = await axios.get("http://localhost:3000/spotify/search", {
                params: {
                    type: "artist",
                    name: searchQuery
                },
                withCredentials: true,
            });
            setOptions(response.data);
        }
        if (tab === "Album") {
            const response = await axios.get("http://localhost:3000/spotify/search", {
                params: {
                    type: "album",
                    name: searchQuery
                },
                withCredentials: true,
            });
            setOptions(response.data);
        }



    };

    const handleChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const clearSearch = () => {
        setSearchQuery('');
    }
    const handleTab = (data) => {
        setOptions([]);
        setSelectedItem('');
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

    const handleSelectedItem = (item) => {
        setSelectedItem(item);
    }


    const addItem = async () => {
        const addedSongs = await convertToSongs(selectedItem);
        if (selectedItem !== '') {
            addUnrankedSong(addedSongs);

        }
        closePopup();
        clearSearch();
        setSelectedItem('');
    };


    const convertToSongs = async (item) => {
        let songs = [];
        try {
            if (tab === "Artist") {
                const response = await axios.get(`http://localhost:3000/spotify/artists/${item.id}/tracks`, {
                    params: {
                        include_groups: "album"
                    },
                    withCredentials: true,
                });
                songs = response.data;
            }
            if (tab === "Song") {
                songs.push(item);
            }
            if (tab === "Everything") {
                const response = await axios.get(`http://localhost:3000/spotify/artists/${item.id}/tracks`, {
                    params: {
                        include_groups: "album,single"
                    },
                    withCredentials: true,
                });
                songs = response.data;
            }
            if (tab === "Album") {
                const response = await axios.get(`http://localhost:3000/spotify/albums/${item.id}/tracks`, {
                    withCredentials: true,
                });
                // Add album metadata to tracks
                response.data.forEach(track => {
                    track.album = item;
                });
                songs = response.data;
            }
        } catch (error) {
            console.error("Error fetching songs:", error);
            songs = [];
        }
        return songs;
    }
    return (
        <div>
            <button onClick={togglePopup} className={styles.popupButton}>
                <FaPlus />
            </button>

            {
                isOpen && (
                    <div className={styles.popupOverlay}>
                        <div className={styles.popupContent}>
                            <TabSelector sendTabToParent={handleTab} currentTab={tab} />
                            <h2>{header}</h2>
                            <div className={styles.searchBar}>
                                <button className={styles.searchIcon} title="Search" onClick={handleSubmit}>
                                    <FaSearch />
                                    <span className={styles.tooltip}>Search</span>
                                </button>
                                <input
                                    type="s"
                                    className={styles.searchInput}
                                    name="artist-name"
                                    placeholder={tab === "Everything" ? "Artist" : tab}
                                    value={searchQuery}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleSubmit();
                                        }
                                    }}
                                />
                                {searchQuery && (
                                    <button className={styles.clearButton} onClick={clearSearch}>
                                        &times;
                                    </button>
                                )}
                            </div>
                            <SongOption type={tab} options={options} sendItem={handleSelectedItem} />
                            <div className={styles.finishButtons}>
                                <button onClick={closePopup} className={styles.closeButton}>Cancel</button>
                                {selectedItem && (<button onClick={addItem} className={styles.addButton}>Add</button>)}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default Popup;
