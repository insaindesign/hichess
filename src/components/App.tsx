import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import Home from "./Home";
import Game from "./Game";
import GameFrom from "./GameFrom";
import LearnPage from "./LearnPage";
import LearnLevels from "./LearnLevels";
import Puzzles from "./Puzzles";

function App() {
  return (
    <Router>
      <>
        <CssBaseline />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/learn/:category/:stage/" element={<LearnLevels />} />
          <Route path="/learn/:category/:stage/:index" element={<LearnLevels />} />
          <Route path="/puzzles" element={<Puzzles />} />
          <Route path="/play" element={<Game />} />
          <Route path="/play/:fen" element={<GameFrom />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
