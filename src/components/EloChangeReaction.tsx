import Chip from "@mui/material/Chip";
import { useEffect, useState } from "react";

import css from "./EloChangeReaction.module.css";

type Props = {
  change: number | null;
};

function EloChangeReaction({ change }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const t = setTimeout(setShow, 4000, false);
    return () => clearTimeout(t);
  }, [change]);

  if (!change || !show) {
    return null;
  }

  return (
    <Chip
      className={css.chip}
      sx={{ fontWeight: 700 }}
      color={change > 0 ? "success" : "error"}
      label={change > 0 ? `+${change}` : change}
    />
  );
}

export default EloChangeReaction;
