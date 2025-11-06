import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Song from "./song/song";
import { useRankedSongs } from "../context/RankedSongContext";
import { useAuth } from "../context/AuthContext";

const DragDropList = () => {
    const { rankedSongList, setRankedSongList } = useRankedSongs();
    const { loggedIn } = useAuth();
    // Handle drag end and reorder the items
    const handleOnDragEnd = (result) => {
        const { destination, source } = result;

        if (!destination || destination.index === source.index) {
            return; // No reordering needed
        }

        const reorderedItems = Array.from(rankedSongList);
        const [removed] = reorderedItems.splice(source.index, 1); // Remove the dragged item
        reorderedItems.splice(destination.index, 0, removed); // Insert it at the destination

        setRankedSongList(reorderedItems); // Update the state with the new order
    };

    // Delete a song by index
    const deleteSong = (index) => {
        const newSongList = rankedSongList.filter((_, i) => i !== index);
        setRankedSongList(newSongList);
    };
    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
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
        </DragDropContext>
    );
};

export default DragDropList;
