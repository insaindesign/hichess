import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";

import Home from './Home';
import Game from './Game';
import Puzzles from './Puzzles';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/puzzles" element={<Puzzles />} />
          <Route path="/play" element={<Game />} />
        </Routes>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/puzzles">Puzzles</Link>
          </li>
          <li>
            <Link to="/play">Play</Link>
          </li>
        </ul>
      </div>
    </Router>

  );
}

export default App;
