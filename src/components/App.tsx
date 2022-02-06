import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import Home from "./Home";
import Game from "./Game";
import Puzzles from "./Puzzles";

function App() {
  return (
    <Router>
      <>
        <CssBaseline />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/puzzles" element={<Puzzles />} />
          <Route path="/play" element={<Game />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
