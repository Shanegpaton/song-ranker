import React, { useState } from "react";
const useSongList = () => {
    const [unrankedSongList, setUnrankedSongList] = useState([]);

    const addUnrankedSong = (newSong) => {
        if (Array.isArray(newSong)) {
            setUnrankedSongList((prevList) => [...prevList, ...newSong]);
        } else {
            setUnrankedSongList((prevList) => [...prevList, newSong]);
        }
    };



    const removeUnrankedSong = (id) => {
        const songToRemove = unrankedSongList.find((song) => song.id === id);
        if (songToRemove) {
            setUnrankedSongList(unrankedSongList.filter((song) => song.id !== id));
            return songToRemove;
        }
        return null;
    };

    const updateUnrankedSong = (id, updatedSong) => {
        setUnrankedSongList(
            unrankedSongList.map((song) =>
                song.id === id ? { ...song, ...updatedSong } : song
            )
        );
    };

    return { unrankedSongList, addUnrankedSong, removeUnrankedSong, updateUnrankedSong };
};
export default useSongList