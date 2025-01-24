import React, { useState, useEffect } from "react";
import { useUnrankedSongsContext } from "../../context/UnrankedSongs";
import { useRankedSongs } from "../../context/RankedSongContext";
import RankedSongInput from "./RankedSongInput";
import styles from "./RankNext.module.css";


function RankNext() {
    const { unrankedSongList, removeUnrankedSong } = useUnrankedSongsContext();
    const { rankedSongList, setRankedSongList } = useRankedSongs();
    const [unranked, setUnranked] = useState(
        unrankedSongList[0]?.name || 'none'
    );


    const rankSong = (rank) => {
        const removedSong = removeUnrankedSong(unrankedSongList[0].id);
        const newArray = [
            ...rankedSongList.slice(0, rank),
            removedSong,
            ...rankedSongList.slice(rank)
        ];
        setRankedSongList(() => newArray);
       
    };

    useEffect(() => {
        if (unrankedSongList[0]?.name) {
            setUnranked(
                `${unrankedSongList[0]?.name || 'Unknown song'} by ${unrankedSongList[0]?.artists[0]?.name || 'Unknown artist'
                }`
            );
        } else {
            setUnranked('Click the + to add songs');
        }
    }, [unrankedSongList]); // Runs only on mount
    if (!unrankedSongList[0]) {
        return (<p className={styles.emptyDisplay}>Click the + to add songs</p>);
    }
    return (
        <div className={styles.unrankedDisplay}>
            <p>{unranked}</p>
            {/* <button onClick={() => rankSong(1)}>Rank</button> */}
            <RankedSongInput rankedSongList={rankedSongList} addSongAtRank={rankSong} />
        </div>
    );
}

export default RankNext;
