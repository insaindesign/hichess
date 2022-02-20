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

import { Category, learnToLevel, RawStage, Stage } from "../util";

const rawStages: RawStage[] = [
  rook,
  bishop,
  queen,
  king,
  knight,
  pawn,
  capture,
  protection,
  combat,
  check,
  outOfCheck,
  checkmate,
  setup,
  castling,
  enpassant,
  stalemate,
  value,
  pin,
  skewer,
];

const Categs = [
  {
    key: "pieces",
    name: "pieces",
  },
  {
    key: "fundamentals",
    name: "fundamentals",
  },
  {
    key: "intermediate",
    name: "intermediate",
  },
  {
    key: "advanced",
    name: "advanced",
  },
].map((cat) => ({
  ...cat,
  stages: rawStages
    .filter((s) => s.category === cat.key)
    .map((s) => {
      const levels = s.levels.map((level, ii) =>
        learnToLevel(level, [s.category, s.stage, ii].join("/"))
      );
      return {
        key: s.stage,
        levels,
      } as Stage;
    }),
})) as Category[];

export default Categs;
