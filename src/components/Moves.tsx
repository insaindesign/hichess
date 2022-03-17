import { Fragment, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

type Props = {
  pgn: string;
};

type PgnMove = {
  move: string;
  rating?: string;
  best?: string;
  bestMove?: string;
  bestRating?: string;
};

type PgnRow = {
  number: string;
  black: PgnMove;
  white: PgnMove;
};

const commentRegex = / (\{[^}]*\})/g;
const moveRatingRegex = /([a-h][1-8][a-h][1-8] )+/;
const encodeComment = (comment: string) => comment.replace(/ /g, "__");
const decodeComment = (comment: string) => comment.replace(/__/g, " ");

const containerSx = {
  marginTop: 0,
  alignContent: "flex-start",
  flexFlow: "wrap-reverse",
};

const toMove = (part?: string): PgnMove => {
  const parts = part ? part.replace("}", "").split(" {") : [""];
  const data: PgnMove = { move: parts[0] };
  if (parts[1]) {
    const commentParts = parts[1].split(", ");
    if (commentParts[0] && !commentParts[0].includes(",")) {
      data.rating = commentParts.shift();
    }
    const best = commentParts.shift();
    if (best) {
      data.bestRating = best.replace(moveRatingRegex, '');
      data.bestMove = best.replace(data.bestRating, '');
    }
    // only show best if it's unique
    if (data.bestRating && data.bestRating !== data.rating) {
      data.best = best;
    }
  }
  return data;
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
  const m = useMemo(() => parsePgn(pgn), [pgn]);
  return (
    <Grid columns={11} container spacing={2} sx={containerSx}>
      {m.map((row) => (
        <Fragment key={row.number}>
          <Grid item xs={1}>
            {row.number}
          </Grid>
          <Grid item xs={5}>
            <Typography>
              {row.white.move}
              {row.white.rating ? <Typography variant="caption"> {row.white.rating}</Typography> : null}
            </Typography>
            {row.white.best ? <Typography variant="caption">{row.white.best}</Typography> : null}
          </Grid>
          <Grid item xs={5}>
            <Typography>
              {row.black.move}
              {row.black.rating ? <Typography variant="caption"> {row.black.rating}</Typography> : null}
            </Typography>
            {row.black.best ? <Typography variant="caption">{row.black.best}</Typography> : null}
          </Grid>
        </Fragment>
      ))}
    </Grid>
  );
}

export default Moves;
