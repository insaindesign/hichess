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
        <Button key={p} onClick={() => onSelect(p)} style={{ width: 100 }}>
          <Piece color={color} piece={p} />
        </Button>
      ))}
    </Dialog>
  );
}

export default PickAPiece;
