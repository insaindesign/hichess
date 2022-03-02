import Chip from "@mui/material/Chip";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

import theme from "../styles/theme";

import css from "./EloChangeReaction.module.css";

type Props = {
  elo: number;
  change: number | null;
};

function EloChangeReaction({ elo, change }: Props) {
  const [show, setShow] = useState(false);
  const type = change ? (change > 0 ? "success" : "error") : null;

  useEffect(() => {
    if (!type) {
      return;
    }
    const t = setTimeout(() => setShow(false), 2000);
    setShow(true);
    confetti({
      particleCount: 150,
      colors: [theme.palette[type].main],
      disableForReducedMotion: true,
      origin: { x: 0.5, y: 0 },
      spread: 180,
      startVelocity: 15,
      zIndex: 1
    });
    return () => clearTimeout(t);
  }, [change, type, elo]);

  if (!change || !type || !show) {
    return null;
  }

  return (
    <Chip
      className={css.chip}
      sx={{ fontWeight: 700 }}
      color={type}
      label={change > 0 ? `+${change}` : change}
    />
  );
}

export default EloChangeReaction;
