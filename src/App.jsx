import DragDropList from "./components/DragDropList";
import NavBar from "./components/NavBar/NavBar";
import RankNext from "./components/RankNext/RankNext";
import { UnrankedSongsProvider } from "./context/UnrankedSongs";
import { RankedSongListProvider } from "./context/RankedSongContext";
import { AuthProvider } from "./context/AuthContext";
import "./app.css"
import Login from "./Login";

function App() {
  return (
    <AuthProvider>
      <UnrankedSongsProvider>
        <RankedSongListProvider>
          <NavBar />
          <Login />
          <div>
            <DragDropList />
          </div>
          <div className="rank-next">
            <RankNext />
          </div>
        </RankedSongListProvider>
      </UnrankedSongsProvider>
    </AuthProvider>
  );
}

export default App
