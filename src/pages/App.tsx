import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy } from "react";

import Root from "../components/Root";
import Home from "./Home";
import MainMenu from "../components/MainMenu";

const AboutPage = lazy(() => import("./AboutPage" /* webpackChunkName: "AboutPage" */));
const PrivacyPage = lazy(() => import("./PrivacyPage" /* webpackChunkName: "PrivacyPage" */));
const GameFrom = lazy(() => import("./GameFrom" /* webpackChunkName: "GameFrom" */));
const LearnPage = lazy(() => import("./LearnPage" /* webpackChunkName: "LearnPage" */));
const LearnLevels = lazy(() => import("./LearnLevels" /* webpackChunkName: "LearnLevels" */));
const Puzzles = lazy(() => import("./Puzzles" /* webpackChunkName: "Puzzles" */));

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
          <Route
            path="learn/:category/:stage/:index"
            element={<LearnLevels />}
          />
          <Route path="puzzles" element={<Puzzles />} />
          <Route path="play" element={<GameFrom />} />
          <Route path="play/:fen" element={<GameFrom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
