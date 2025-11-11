import React from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import DragDropList from "./components/DragDropList";
import NavBar from "./components/NavBar/NavBar";
import RankNext from "./components/RankNext/RankNext";
import { UnrankedSongsProvider, useUnrankedSongsContext } from "./context/UnrankedSongs";
import { RankedSongListProvider, useRankedSongs } from "./context/RankedSongContext";
import { AuthProvider } from "./context/AuthContext";
import "./app.css"
import Login from "./Login";

function AppContent() {
  const { rankedSongList, setRankedSongList } = useRankedSongs();
  const { removeUnrankedSong } = useUnrankedSongsContext();

  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return; // Dropped outside
    }

    // If dragged from unranked song (source.droppableId === 'unranked-song')
    if (source.droppableId === 'unranked-song') {
      const unrankedSong = JSON.parse(result.draggableId);
      const removedSong = removeUnrankedSong(unrankedSong.id);
      if (removedSong) {
        const newArray = [
          ...rankedSongList.slice(0, destination.index),
          removedSong,
          ...rankedSongList.slice(destination.index)
        ];
        setRankedSongList(newArray);
      }
      return;
    }

    // If dragged within the ranked list
    if (source.droppableId === 'droppable-list' && destination.droppableId === 'droppable-list') {
      if (source.index === destination.index) {
        return; // No reordering needed
      }

      const reorderedItems = Array.from(rankedSongList);
      const [removed] = reorderedItems.splice(source.index, 1);
      reorderedItems.splice(destination.index, 0, removed);
      setRankedSongList(reorderedItems);
    }
  };

  return (
    <>
      <NavBar />
      <Login />
      <DragDropContext onDragEnd={handleDragEnd}>
        <div>
          <DragDropList />
        </div>
        <div className="rank-next">
          <RankNext />
        </div>
      </DragDropContext>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <UnrankedSongsProvider>
        <RankedSongListProvider>
          <AppContent />
        </RankedSongListProvider>
      </UnrankedSongsProvider>
    </AuthProvider>
  );
}

export default App
