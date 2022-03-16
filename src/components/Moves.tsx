import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Fragment } from "react";

type Props = {
  pgn: string;
};

type PgnMove = {
  move: string;
  comment: string | null;
  rating?: string;
  bestMove?: string;
  bestRating?: string;
};

type PgnRow = {
  number: string;
  black: PgnMove;
  white: PgnMove;
};

const commentRegex = / (\{[^}]*\})/g;
const encodeComment = (comment: string) => comment.replace(/ /g, "__");
const decodeComment = (comment: string) => comment.replace(/__/g, " ");

const toMove = (part?: string): PgnMove => {
  const parts = part ? part.replace("}", "").split(" {") : [""];
  return {
    move: parts[0],
    comment: parts[1] || null,
  };
};

const parsePgn = (pgn: string): PgnRow[] => {
  const parts = pgn
    .replace(commentRegex, encodeComment)
    .split(" ")
    .map(decodeComment);
  const out: PgnRow[] = [];
  for (let ii = 0; ii < Math.round(parts.length / 3); ii++) {
    const index = ii * 3;
    out.push({
      number: parts[index],
      black: toMove(parts[index + 2]),
      white: toMove(parts[index + 1]),
    });
  }
  return out;
};

function Moves({ pgn }: Props) {
  const m = parsePgn(pgn);
  return (
    <Grid columns={11} container spacing={2} sx={{ overflowY: "auto", flex: '1 1 auto', marginTop: 1, minHeight: 200 }}>
      {m.map((row) => (
        <Fragment key={row.number}>
          <Grid item xs={1}>
            {row.number}
          </Grid>
          <Grid item xs={5}>
            <Typography>
              {row.white.move}
              <Typography variant="caption"> {row.white.comment}</Typography>
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography>
              {row.black.move}
              <Typography variant="caption"> {row.black.comment}</Typography>
            </Typography>
          </Grid>
        </Fragment>
      ))}
    </Grid>
  );
}

export default Moves;
