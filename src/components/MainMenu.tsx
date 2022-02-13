import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import css from "./MainMenu.module.css";

type Props = {
  onClick?: () => void;
};

function MainMenu({ onClick }: Props) {
  return (
    <Paper className={css.root}>
      <Grid container spacing={2} className={css.grid}>
        <Grid item xs={6}>
          <Link to="/learn" className={css.link} onClick={onClick}>
            Learn
          </Link>
        </Grid>
        <Grid item xs={6}>
          <Link to="/puzzles" className={css.link} onClick={onClick}>
            Puzzles
          </Link>
        </Grid>
        <Grid item xs={6}>
          <Link to="/play" className={css.link} onClick={onClick}>
            Play a game
          </Link>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default MainMenu;
