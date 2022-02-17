import Alert from "@mui/material/Alert";
import { useTranslation } from "react-i18next";

import type { Color } from "chessground/types";
import Piece from "./Board/Piece";
import ChessCtrl from "../lib/chess";

type Props = {
  color: Color;
};

function MoveBar({ color }: Props) {
  const { t } = useTranslation();
  const swapped = ChessCtrl.swapColor(color);
  const sx = {
    backgroundColor: color,
    color: swapped,
    fontWeight: 700,
    borderColor: color === "black" ? "white" : "#ccc",
  };
  return (
    <Alert variant="outlined" icon={<Piece color="white" piece="p" />} sx={sx}>
      {t("move." + color)}
    </Alert>
  );
}

export default MoveBar;
