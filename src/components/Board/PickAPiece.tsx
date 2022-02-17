import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { PieceType } from "chess.js";
import { Color } from "chessground/types";

import Piece from "./Piece";

type Props<T> = {
  color: Color;
  pieces: T[];
  onSelect: (piece: T) => void;
  open: boolean;
};

function PickAPiece<T extends PieceType>({
  color,
  open,
  onSelect,
  pieces,
}: Props<T>) {
  return (
    <Dialog open={open}>
      {pieces.map((p) => (
        <Button key={p} onClick={() => onSelect(p)}>
          <Piece color={color} piece={p} style={{ fontSize: 92 }} />
        </Button>
      ))}
    </Dialog>
  );
}

export default PickAPiece;
