import { arrow,  } from "../util";
import { canBeCaptured } from "../assert";

import type { RawStage } from "../util";

const Learn: RawStage = {
  stage: "combat",
  category: "fundamentals",
  levels: [
    {
      // rook
      goal: "takeTheBlackPiecesAndDontLoseYours",
      id: "30Z9olKx_S",
      fen: "8/8/8/8/P2r4/6B1/8/8 w - -",
      nbMoves: 3,
      shapes: [
        arrow("a4a5"),
        arrow("g3f2"),
        arrow("f2d4"),
        arrow("d4a4", "yellow"),
      ],
    },
    {
      goal: "takeTheBlackPiecesAndDontLoseYours",
      id: "1Jkam_npIV",
      fen: "2r5/8/3b4/2P5/8/1P6/2B5/8 w - -",
      nbMoves: 4,
    },
    {
      goal: "takeTheBlackPiecesAndDontLoseYours",
      id: "egc9YTYXAk",
      fen: "1r6/8/5n2/3P4/4P1P1/1Q6/8/8 w - -",
      nbMoves: 4,
    },
    {
      goal: "takeTheBlackPiecesAndDontLoseYours",
      id: "1DXe7k4n5S",
      fen: "2r5/8/3N4/5b2/8/8/PPP5/8 w - -",
      nbMoves: 4,
    },
    {
      goal: "takeTheBlackPiecesAndDontLoseYours",
      id: "07tekvynHQ",
      fen: "8/6q1/8/4P1P1/8/4B3/r2P2N1/8 w - -",
      nbMoves: 8,
    },
  ].map((l) =>
    ({
      failure: canBeCaptured,
      ...l,
    })
  ),
};

export default Learn;
