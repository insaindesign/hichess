import { arrow, toLevel } from "../util";
import { canBeCaptured } from "../assert";

import type { Stage } from "../util";

const Learn: Stage = {
  key: "capture",
  levels: [
    {
      // rook
      goal: "takeTheBlackPieces",
      fen: "8/2p2p2/8/8/8/2R5/8/8 w - -",
      nbMoves: 2,
      shapes: [arrow("c3c7"), arrow("c7f7")],
    },
    {
      // queen
      goal: "takeTheBlackPiecesAndDontLoseYours",
      fen: "8/2r2p2/8/8/5Q2/8/8/8 w - -",
      nbMoves: 2,
      shapes: [arrow("f4c7"), arrow("f4f7", "red"), arrow("c7f7", "yellow")],
    },
    {
      // bishop
      goal: "takeTheBlackPiecesAndDontLoseYours",
      fen: "8/5r2/8/1r3p2/8/3B4/8/8 w - -",
      nbMoves: 5,
    },
    {
      // queen
      goal: "takeTheBlackPiecesAndDontLoseYours",
      fen: "8/5b2/5p2/3n2p1/8/6Q1/8/8 w - -",
      nbMoves: 7,
    },
    {
      // knight
      goal: "takeTheBlackPiecesAndDontLoseYours",
      fen: "8/3b4/2p2q2/8/3p1N2/8/8/8 w - -",
      nbMoves: 6,
    },
  ].map((l, i) =>
    toLevel(
      {
        failure: canBeCaptured,
        ...l,
      },
      i
    )
  ),
};

export default Learn;
