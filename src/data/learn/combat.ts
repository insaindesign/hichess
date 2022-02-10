import { arrow, toLevel } from "../util";

import type { Stage } from "../util";

const Learn: Stage = {
  key: "combat",
  levels: [
    {
      // rook
      goal: "takeTheBlackPiecesAndDontLoseYours",
      fen: "8/8/8/8/P2r4/6B1/8/8 w - -",
      nbMoves: 3,
      captures: 1,
      shapes: [
        arrow("a4a5"),
        arrow("g3f2"),
        arrow("f2d4"),
        arrow("d4a4", "yellow"),
      ],
    },
    {
      goal: "takeTheBlackPiecesAndDontLoseYours",
      fen: "2r5/8/3b4/2P5/8/1P6/2B5/8 w - -",
      nbMoves: 4,
      captures: 2,
    },
    {
      goal: "takeTheBlackPiecesAndDontLoseYours",
      fen: "1r6/8/5n2/3P4/4P1P1/1Q6/8/8 w - -",
      nbMoves: 4,
      captures: 2,
    },
    {
      goal: "takeTheBlackPiecesAndDontLoseYours",
      fen: "2r5/8/3N4/5b2/8/8/PPP5/8 w - -",
      nbMoves: 4,
      captures: 2,
    },
    {
      goal: "takeTheBlackPiecesAndDontLoseYours",
      fen: "8/6q1/8/4P1P1/8/4B3/r2P2N1/8 w - -",
      nbMoves: 8,
      captures: 2,
    },
  ].map(toLevel),
};

export default Learn;
