import { arrow, toLevel } from "../util";

import type { LevelPartial, Stage } from "../util";

const Learn: Stage = {
  key: "king",
  levels: [
    {
      goal: "theKingIsSlow",
      fen: "8/8/8/8/8/3K4/8/8 w - -",
      apples: "e6",
      nbMoves: 3,
      shapes: [arrow("d3d4"), arrow("d4d5"), arrow("d5e6")],
    },
    {
      goal: "grabAllTheStars",
      fen: "8/8/8/8/8/8/8/4K3 w - -",
      apples: "c2 d3 e2 e3",
      nbMoves: 4,
    },
    {
      goal: "lastOne",
      fen: "8/8/8/4K3/8/8/8/8 w - -",
      apples: "b5 c5 d6 e3 f3 g4",
      nbMoves: 8,
    },
  ].map((l: LevelPartial, i) =>
    toLevel(
      {
        emptyApples: true,
        ...l,
      },
      i
    )
  ),
};

export default Learn;
