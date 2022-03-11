import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy } from "react";

import Root from "./Root";
import Menu from "./Menu";
import Home from "./Home";

const About = lazy(() => import("./About" /* webpackChunkName: "About" */));
const Profile = lazy(() => import("./Profile" /* webpackChunkName: "Profile" */));
const Privacy = lazy(() => import("./Privacy" /* webpackChunkName: "Privacy" */));
const Game = lazy(() => import("./Game" /* webpackChunkName: "Game" */));
const Play = lazy(() => import("./Play" /* webpackChunkName: "Play" */));
const Learn = lazy(() => import("./Learn" /* webpackChunkName: "Learn" */));
const LearnLevels = lazy(() => import("./LearnLevels" /* webpackChunkName: "LearnLevels" */));
const Puzzles = lazy(() => import("./Puzzles" /* webpackChunkName: "Puzzles" */));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="about" element={<About />} />
          <Route path="profile" element={<Profile />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="learn" element={<Learn />} />
          <Route path="learn/:category" element={<Learn />} />
          <Route path="learn/:category/:stage" element={<LearnLevels />} />
          <Route
            path="learn/:category/:stage/:id"
            element={<LearnLevels />}
          />
          <Route path="puzzle" element={<Puzzles />} />
          <Route path="puzzles" element={<Puzzles />} />
          <Route path="puzzles/:theme" element={<Puzzles />} />
          <Route path="puzzles/:theme/:id" element={<Puzzles />} />
          <Route path="game" element={<Game />} />
          <Route path="game/:fen" element={<Game />} />
          <Route path="game/:fen/:fen2/:fen3/:fen4/:fen5/:fen6/:fen7/:fen8" element={<Game />} />
          <Route path="play/:id" element={<Play />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
