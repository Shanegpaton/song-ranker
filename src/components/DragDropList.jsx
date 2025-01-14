import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./song/Song.css"
import Song from "./song/song";
import { songLists } from "../api/songList";

const DragDropList = () => {

    // Initial list of items

    const [songList, setSongList] = useState(songLists);

    // Handle drag end and reorder the items
    const handleOnDragEnd = (result) => {
        const { destination, source } = result;
        // If dropped outside the list or no change in position
        if (!destination || destination.index === source.index) {
            return;
        }

        // Reorder the items based on the drag result
        const reorderedItems = Array.from(songList);
        const [removed] = reorderedItems.splice(source.index, 1); // Remove the dragged item
        reorderedItems.splice(destination.index, 0, removed); // Insert it at the destination

        setSongList(reorderedItems); // Update the state with the new order
    };
    const deleteSong = (index) => {
        const newSongList = songList.filter((_, i) => i !== index);
        setSongList(newSongList);
    }

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="droppable-list">
                {(provided) => (
                    <ol
                        className="song-list"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {songList.map((song, index) => (
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
                                        <Song key={song.id} index={index} rank={index + 1} name={song.name} artist={song.artist} length={song.length} deleteSong={deleteSong} />
                                    </li>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder} {/* This is needed for spacing when dragging */}
                    </ol>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DragDropList;
