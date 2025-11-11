import React, { useState, useEffect } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useUnrankedSongsContext } from "../../context/UnrankedSongs";
import { useRankedSongs } from "../../context/RankedSongContext";
import { useAuth } from "../../context/AuthContext";
import Song from "../song/song";
import styles from "./RankNext.module.css";

function RankNext() {
    const { unrankedSongList, removeUnrankedSong } = useUnrankedSongsContext();
    const { rankedSongList, setRankedSongList } = useRankedSongs();
    const { player, accessToken, deviceId } = useAuth();
    const [currentPlayingSongId, setCurrentPlayingSongId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Listen to player state changes to track current track and playing state
    useEffect(() => {
        if (!player) return;

        const updateState = async () => {
            const state = await player.getCurrentState();
            if (state) {
                setCurrentPlayingSongId(state.track_window.current_track.id);
                setIsPlaying(!state.paused);
            }
        };

        const handleStateChange = (state) => {
            if (state) {
                setCurrentPlayingSongId(state.track_window.current_track.id);
                setIsPlaying(!state.paused);
            }
        };

        player.addListener('player_state_changed', handleStateChange);
        updateState();

        return () => {
            player.removeListener('player_state_changed', handleStateChange);
        };
    }, [player]);

    const rankSong = (rank) => {
        const removedSong = removeUnrankedSong(unrankedSongList[0].id);
        const newArray = [
            ...rankedSongList.slice(0, rank),
            removedSong,
            ...rankedSongList.slice(rank)
        ];
        setRankedSongList(() => newArray);
    };

    const deleteUnrankedSong = () => {
        if (unrankedSongList[0]) {
            removeUnrankedSong(unrankedSongList[0].id);
        }
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

        // If this is the currently playing song, toggle play/pause
        if (currentPlayingSongId === songId) {
            await player.togglePlay();
            return;
        }

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

    const songsLeft = unrankedSongList.length;

    if (!unrankedSongList[0]) {
        return (
            <div className={styles.unrankedDisplay}>
                <p className={styles.emptyDisplay}>Click the + to add songs</p>
                <p className={styles.songsLeftCounter}>
                    {songsLeft} {songsLeft === 1 ? 'song' : 'songs'} left to rank
                </p>
            </div>
        );
    }

    const currentSong = formatSong(unrankedSongList[0]);
    const songIdString = JSON.stringify(currentSong);
    const isActive = currentPlayingSongId === currentSong.id;
    const isCurrentlyPlaying = isPlaying && isActive;

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
                                        maxWidth: "1200px",
                                        display: "flex",
                                        justifyContent: "center",
                                        ...provided.draggableProps.style,
                                    }}
                                >
                                    <div className={styles.unrankedSongWrapper}>
                                        <Song
                                            index={0}
                                            rank={0}
                                            name={currentSong.name}
                                            artist={currentSong.artist}
                                            length={currentSong.length}
                                            deleteSong={deleteUnrankedSong}
                                            songid={currentSong.id}
                                            onPlay={tooglePlay}
                                            isActive={isActive}
                                            isPlaying={isCurrentlyPlaying}
                                        />
                                    </div>
                                </div>
                            )}
                        </Draggable>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <p className={styles.songsLeftCounter}>
                {songsLeft} {songsLeft === 1 ? 'song' : 'songs'} left to rank
            </p>
        </div>
    );
}

export default RankNext;
