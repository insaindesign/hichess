import { BrowserRouter, Route, Routes } from "react-router-dom";

import Root from "./Root";
import Home from "./Home";
import Game from "./Game";
import GameFrom from "./GameFrom";
import AboutPage from "./AboutPage";
import PrivacyPage from "./PrivacyPage";
import LearnPage from "./LearnPage";
import LearnLevels from "./LearnLevels";
import Puzzles from "./Puzzles";
import MainMenu from "./MainMenu";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Home />} />
          <Route path="menu" element={<MainMenu />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="learn/:category/:stage/" element={<LearnLevels />} />
          <Route path="learn/:category/:stage/:index" element={<LearnLevels />} />
          <Route path="puzzles" element={<Puzzles />} />
          <Route path="play" element={<Game />} />
          <Route path="play/:fen" element={<GameFrom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
