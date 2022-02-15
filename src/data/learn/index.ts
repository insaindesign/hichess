import rook from "./rook";
import bishop from "./bishop";
import queen from "./queen";
import king from "./king";
import knight from "./knight";
import pawn from "./pawn";
import capture from "./capture";
import protection from "./protection";
import combat from "./combat";
import check from "./check";
import outOfCheck from "./outOfCheck";
import checkmate from "./checkmate";
import setup from "./setup";
import castling from "./castling";
import enpassant from "./enpassant";
import stalemate from "./stalemate";
import pin from "./pin";
import skewer from "./skewer";
import value from "./value";

import type { Category } from "../util";

const Categs: Category[] = [
  {
    key: "chess-pieces",
    name: "chessPieces",
    stages: [rook, bishop, queen, king, knight, pawn],
  },
  {
    key: "fundamentals",
    name: "fundamentals",
    stages: [capture, protection, combat, check, outOfCheck, checkmate],
  },
  {
    key: "intermediate",
    name: "intermediate",
    stages: [setup, castling, enpassant, stalemate],
  },
  {
    key: "advanced",
    name: "advanced",
    stages: [
      value,
      pin,
      skewer,
    ],
  },
];

export default Categs;