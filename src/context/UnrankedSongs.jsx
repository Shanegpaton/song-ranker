import React, { createContext, useContext } from 'react';
import useSongList from '../hooks/UseSongList';


const UnrankedSongsContext = createContext();


export const UnrankedSongsProvider = ({ children }) => {
    const songListMethods = useSongList();

    return (
        <UnrankedSongsContext.Provider value={songListMethods}>
            {children}
        </UnrankedSongsContext.Provider>
    );
};


export const useUnrankedSongsContext = () => useContext(UnrankedSongsContext);
