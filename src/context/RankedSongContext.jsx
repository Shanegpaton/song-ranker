import React, { createContext, useContext, useState } from "react";

// Create the context
const rankedSongsContext = createContext();

export const RankedSongListProvider = ({ children }) => {
    const [rankedSongList, setRankedSongList] = useState([]);

    const addRankedSong = (newSong) => {
        setRankedSongList((prevSong) => [...prevSong, newSong]);
    };

    // Remove a song from the list by id
    const removeRankedSong = (id) => {
        setRankedSongList((prevSongs) => prevSongs.filter(song => song.id !== id));
    };

    // Update a song in the list by id
    const updateRankedSong = (id, updatedSong) => {
        setRankedSongList((prevSongs) =>
            prevSongs.map((song) =>
                song.id === id ? { ...song, ...updatedSong } : song
            )
        );
    };

    return (
        <rankedSongsContext.Provider value={{ rankedSongList, setRankedSongList, addRankedSong, removeRankedSong, updateRankedSong }}>
            {children}
        </rankedSongsContext.Provider>
    );
};

// Custom hook to access the context
export const useRankedSongs = () => {
    return useContext(rankedSongsContext);
};
