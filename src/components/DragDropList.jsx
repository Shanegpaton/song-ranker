import React, { useState, useEffect } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import Song from "./song/song";
import { useRankedSongs } from "../context/RankedSongContext";
import { useAuth } from "../context/AuthContext";

const DragDropList = () => {
    const { rankedSongList, setRankedSongList } = useRankedSongs();
    const { loggedIn, player, accessToken, deviceId } = useAuth();
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


    async function moveToDevice() {
        if (!player || !accessToken || !deviceId) return;

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
                    body: JSON.stringify({
                        device_ids: [deviceId],
                    }),
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
                        body: JSON.stringify({
                            device_ids: [deviceId],
                        }),
                    });
                }
            }
        } catch (error) {
            console.error("Error moving to device:", error);
        }
    }

    async function tooglePlay(songId) {
        if (!player || !accessToken) return;

        // If this is the currently playing song, toggle play/pause
        if (currentPlayingSongId === songId) {
            await player.togglePlay();
            return;
        }

        // Otherwise, play the new song
        await moveToDevice();
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
            setCurrentPlayingSongId(songId);
        } catch (error) {
            console.error("Error playing track:", error);
        }
    }
    // Delete a song by index
    const deleteSong = (index) => {
        const newSongList = rankedSongList.filter((_, i) => i !== index);
        setRankedSongList(newSongList);
    };
    return (
        <Droppable droppableId="droppable-list">
            {(provided) => (
                <ol
                    className="song-list"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                >
                    {rankedSongList && rankedSongList.length > 0 ? (
                        rankedSongList.map((song, index) => (
                            <Draggable key={song.id} draggableId={song.id} index={index}>
                                {(provided) => (
                                    <li
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                            ...provided.draggableProps.style, // Necessary for drag effect
                                        }}
                                    >
                                        <Song
                                            index={index}
                                            rank={index + 1}
                                            name={song.name}
                                            artist={song.artist}
                                            length={song.length}
                                            deleteSong={() => deleteSong(index)}
                                            songid={song.id}
                                            onPlay={tooglePlay}
                                            isActive={currentPlayingSongId === song.id}
                                            isPlaying={isPlaying && currentPlayingSongId === song.id}
                                        />
                                    </li>
                                )}
                            </Draggable>
                        ))
                    ) : (
                        loggedIn && <p
                            style={{
                                color: "white",
                                fontSize: "20px",
                                textAlign: "center",
                                marginTop: "20px",
                            }}
                        >
                            Start ranking songs
                        </p>
                    )}
                    {provided.placeholder} {/* Placeholder for dragging */}
                </ol>
            )}
        </Droppable>
    );
};

export default DragDropList;
