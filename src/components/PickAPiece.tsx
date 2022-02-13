import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { PieceType } from "chess.js";

type Props<T> = {
  pieces: T[];
  onSelect: (piece: T) => void;
  open: boolean;
};

function PickAPiece<T extends PieceType>({ open, onSelect, pieces }: Props<T>) {
  return (
    <Dialog open={open}>
      {pieces.map((p) => (
        <Button key={p} onClick={() => onSelect(p)}>
          {p}
        </Button>
      ))}
    </Dialog>
  );
}

export default PickAPiece;
