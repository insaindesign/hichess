import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import css from "./MainMenu.module.css";

function MainMenu() {
  return (
    <Paper className={css.root}>
      <Grid container spacing={2} className={css.grid}>
        <Grid item xs={6}>
          <Link to="/play" className={css.link}>
            Play a game
          </Link>
        </Grid>
        <Grid item xs={6}>
          <Link to="/puzzles" className={css.link}>
            Puzzles
          </Link>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default MainMenu;
