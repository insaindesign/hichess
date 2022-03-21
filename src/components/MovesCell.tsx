import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DoneIcon from "@mui/icons-material/Done";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ErrorIcon from "@mui/icons-material/Error";

import type { PgnMove } from "../lib/engine/pgn";

type Props = {
  cell: PgnMove;
};

type RatingProps = {
  best: PgnMove["bestRating"];
  actual: PgnMove["rating"];
};

function MovesRatingIcon({ best, actual }: RatingProps) {
  if (!actual || !best) {
    return null;
  }
  const color =
    actual.normalised > 0
      ? "success"
      : actual.normalised < 0
      ? "error"
      : "inherit";
  const delta = best.normalised - actual.normalised;
  if (!delta) {
    return <StarIcon color={color} fontSize="small" />;
  }
  if (delta < 50) {
    return <StarBorderIcon color={color} fontSize="small" />;
  }
  if (delta < 100) {
    return <DoneIcon color={color} fontSize="small" />;
  }
  if (delta < 300) {
    return <ErrorOutlineIcon color={color} fontSize="small" />;
  }
  return <ErrorIcon color={color} fontSize="small" />;
}

function MovesCell({ cell }: Props) {
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ display: "inline" }}>{cell.move} </Typography>
        {cell.rating ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: '4px' }}>
            <Typography variant="caption">{cell.rating.sentence}</Typography>
            <MovesRatingIcon best={cell.bestRating} actual={cell.rating} />
          </Box>
        ) : null}
      </Box>
      {cell.best ? (
        <Typography variant="caption">{cell.best}</Typography>
      ) : null}
    </>
  );
}

export default MovesCell;
