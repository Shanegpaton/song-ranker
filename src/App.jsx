import DragDropList from "./components/DragDropList";
import NavBar from "./components/NavBar/NavBar";
import RankNext from "./components/RankNext/RankNext";
import { UnrankedSongsProvider } from "./context/UnrankedSongs";
import { RankedSongListProvider } from "./context/RankedSongContext";
import Login from "./Login";


function App() {
  return (
    <UnrankedSongsProvider>
      <RankedSongListProvider>
        <NavBar />
        {/* <Login /> */}
        <div>
          <DragDropList />
        </div>
        <RankNext />
      </RankedSongListProvider>
    </UnrankedSongsProvider>
  );
}

export default App
