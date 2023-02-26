import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DoneIcon from "@mui/icons-material/Done";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";

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
  const [showBest, setShowBest] = useState(false);
  return (
    <div>
      <Box
        onClick={() => setShowBest(true)}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <Typography sx={{ display: "inline", flex: 1 }}>
          {cell.move}
        </Typography>
        {cell.rating ? (
          <>
            <Typography variant="caption">
              {cell.rating.sentence}
            </Typography>
            <MovesRatingIcon best={cell.bestRating} actual={cell.rating} />
          </>
        ) : null}
      </Box>
      {showBest && cell.bestMove ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "4px",
          }}
          onClick={() => setShowBest(false)}
        >
          <Typography variant="caption" sx={{ flex: 1 }}>
            {cell.bestMove}
          </Typography>
          {cell.bestRating && (
            <Typography variant="caption">
              {cell.bestRating.sentence}
            </Typography>
          )}
          <CloseIcon fontSize="small" />
        </Box>
      ) : null}
    </div>
  );
}

export default MovesCell;
