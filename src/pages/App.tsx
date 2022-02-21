import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy } from "react";

import Root from "./Root";
import Menu from "./Menu";
import Home from "./Home";

const About = lazy(() => import("./About" /* webpackChunkName: "About" */));
const Profile = lazy(() => import("./Profile" /* webpackChunkName: "Profile" */));
const Privacy = lazy(() => import("./Privacy" /* webpackChunkName: "Privacy" */));
const GameFrom = lazy(() => import("./GameFrom" /* webpackChunkName: "GameFrom" */));
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
