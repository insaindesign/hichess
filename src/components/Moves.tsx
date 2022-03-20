import { Fragment, useMemo } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { parsePgn } from "../lib/engine/pgn";

import type { PgnMove } from "../lib/engine/pgn";

type Props = {
  pgn: string;
};

const containerSx = {
  marginTop: 0,
  alignContent: "flex-start",
  flexFlow: "wrap-reverse",
};

function MovesCell({ cell }: { cell: PgnMove }) {
  return (
    <>
    <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
      <Typography sx={{ display: "inline" }}>{cell.move} </Typography>
      {cell.rating ? (
        <Chip
          variant={
            cell.bestRating &&
            cell.bestRating.normalised > cell.rating.normalised + 100
              ? "filled"
              : "outlined"
          }
          size="small"
          color={
            !cell.bestRating
              ? "default"
              : cell.rating.normalised < cell.bestRating.normalised
              ? "error"
              : "success"
          }
          label={cell.rating.sentence}
        />
      ) : null}
      </Box>
      {cell.best ? (
        <Typography variant="caption">{cell.best}</Typography>
      ) : null}
    </>
  );
}

function Moves({ pgn }: Props) {
  const m = useMemo(() => parsePgn(pgn), [pgn]);
  return (
    <Grid columns={11} container spacing={2} sx={containerSx}>
      {m.map((row) => (
        <Fragment key={row.number}>
          <Grid item xs={1}>
            {row.number}
          </Grid>
          <Grid item xs={5}>
            <MovesCell cell={row.white} />
          </Grid>
          <Grid item xs={5}>
            <MovesCell cell={row.black} />
          </Grid>
        </Fragment>
      ))}
    </Grid>
  );
}

export default Moves;
