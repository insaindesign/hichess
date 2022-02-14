import { PieceType } from "chess.js";
import { Color } from "chessground/types";

type Props = {
  color: Color;
  piece: PieceType;
};

const pieceToClassName: Record<PieceType, string> = {
  p: "pawn",
  k: "king",
  q: "queen",
  b: "bishop",
  r: "rook",
  n: "knight",
};

function Piece({ color, piece }: Props) {
  return <span className={`piece ${color} ${pieceToClassName[piece]}`}>{piece}</span>;
}

export default Piece;
