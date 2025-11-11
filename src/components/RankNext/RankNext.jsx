import React from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useUnrankedSongsContext } from "../../context/UnrankedSongs";
import { useRankedSongs } from "../../context/RankedSongContext";
import { useAuth } from "../../context/AuthContext";
import RankedSongInput from "./RankedSongInput";
import Song from "../song/song";
import styles from "./RankNext.module.css";

function RankNext() {
    const { unrankedSongList, removeUnrankedSong } = useUnrankedSongsContext();
    const { rankedSongList, setRankedSongList } = useRankedSongs();
    const { player, accessToken, deviceId } = useAuth();

    const rankSong = (rank) => {
        const removedSong = removeUnrankedSong(unrankedSongList[0].id);
        const newArray = [
            ...rankedSongList.slice(0, rank),
            removedSong,
            ...rankedSongList.slice(rank)
        ];
        setRankedSongList(() => newArray);
    };

    // Format song data for Song component
    const formatSong = (song) => {
        if (!song) return null;

        return {
            name: song.name || 'Unknown song',
            artist: song.artists?.[0]?.name || song.artist || 'Unknown artist',
            length: song.duration_ms ? `${Math.floor(song.duration_ms / 60000)}:${String(Math.floor((song.duration_ms % 60000) / 1000)).padStart(2, '0')}` : song.length || '0:00',
            id: song.id,
            ...song // Keep all original properties
        };
    };

    // Play function for unranked song
    const tooglePlay = async (songId) => {
        if (!player || !accessToken) return;

        // Move to device first
        if (deviceId) {
            try {
                const res = await fetch("https://api.spotify.com/v1/me/player", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (res.status === 204) {
                    // No active device, transfer to our device
                    await fetch("https://api.spotify.com/v1/me/player", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify({ device_ids: [deviceId] }),
                    });
                } else {
                    const data = await res.json();
                    if (data.device && data.device.id !== deviceId) {
                        await fetch("https://api.spotify.com/v1/me/player", {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${accessToken}`,
                            },
                            body: JSON.stringify({ device_ids: [deviceId] }),
                        });
                    }
                }
            } catch (error) {
                console.error("Error moving to device:", error);
            }
        }

        try {
            await fetch(`https://api.spotify.com/v1/me/player/play`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    uris: [`spotify:track:${songId}`],
                }),
            });
        } catch (error) {
            console.error("Error playing track:", error);
        }
    };

    if (!unrankedSongList[0]) {
        return (<p className={styles.emptyDisplay}>Click the + to add songs</p>);
    }

    const currentSong = formatSong(unrankedSongList[0]);
    const songIdString = JSON.stringify(currentSong);

    return (
        <div className={styles.unrankedDisplay}>
            <Droppable droppableId="unranked-song">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        <Draggable
                            draggableId={songIdString}
                            index={0}
                        >
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        ...provided.draggableProps.style,
                                    }}
                                >
                                    <Song
                                        index={0}
                                        rank={0}
                                        name={currentSong.name}
                                        artist={currentSong.artist}
                                        length={currentSong.length}
                                        deleteSong={() => { }}
                                        songid={currentSong.id}
                                        onPlay={tooglePlay}
                                        isActive={false}
                                        isPlaying={false}
                                    />
                                </div>
                            )}
                        </Draggable>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <RankedSongInput rankedSongList={rankedSongList} addSongAtRank={rankSong} />
        </div>
    );
}

export default RankNext;
