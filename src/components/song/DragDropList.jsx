import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./Song.css"
import Song from "./song";

const DragDropList = () => {
    // Initial list of items
    const [songList, setSongList] = useState([
        { id: "1", index: "1", name: "Die with A smile", artist: "Bruno mars", length: "4:12" },
        { id: "2", index: "2", name: "Sweater Weather", artist: "The Neighbourhood", length: "4:00" },
        { id: "3", index: "3", name: "Not like us", artist: "Kendrick Lamar", length: "4:34" },
    ]);

    // Handle drag end and reorder the items
    const handleOnDragEnd = (result) => {
        const { destination, source } = result;
        console.log(result);
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
                                        <Song key={song.id} rank={index + 1} name={song.name} artist={song.artist} length={song.length} />
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
