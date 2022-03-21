import { Fragment, useMemo } from "react";
import Grid from "@mui/material/Grid";

import { parsePgn } from "../lib/engine/pgn";
import MovesCell from "./MovesCell";

type Props = {
  pgn: string;
};

const containerSx = {
  marginTop: 0,
  alignContent: "flex-start",
  flexFlow: "wrap-reverse",
};

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
