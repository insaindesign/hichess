import rook from "./rook";
import bishop from "./bishop";
import queen from "./queen";
import king from "./king";
import knight from "./knight";
import pawn from "./pawn";
import capture from "./capture";
import protection from "./protection";
import combat from "./combat";
import check1 from "./check1";
import outOfCheck from "./outOfCheck";
import checkmate1 from "./checkmate1";
import setup from "./setup";
import castling from "./castling";
import enpassant from "./enpassant";
import stalemate from "./stalemate";
import value from "./value";
import check2 from "./check2";

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
    stages: [capture, protection, combat, check1, outOfCheck, checkmate1],
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
      check2,
    ],
  },
];

export default Categs;