import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import Home from "./Home";
import Game from "./Game";
import Learn from "./Learn";
import LearnLevels from "./LearnLevels";
import Puzzles from "./Puzzles";

function App() {
  return (
    <Router>
      <>
        <CssBaseline />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:category/:stage/" element={<LearnLevels />} />
          <Route path="/learn/:category/:stage/:index" element={<LearnLevels />} />
          <Route path="/puzzles" element={<Puzzles />} />
          <Route path="/play" element={<Game />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
