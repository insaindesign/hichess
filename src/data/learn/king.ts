import { arrow, learnToLevel } from "../util";

import type { Stage } from "../util";

const Learn: Stage = {
  key: "king",
  levels: [
    {
      goal: "theKingIsSlow",
      fen: "8/8/8/8/8/3K4/8/8 w - -",
      apples: "e6",
      nbMoves: 3,
      shapes: [arrow("d3d4"), arrow("d4e5"), arrow("e5e6")],
    },
    {
      goal: "grabAllTheStars",
      fen: "8/8/8/8/4K3/8/8/8 w - -",
      apples: "c2 b2 e2 e3",
      nbMoves: 5,
    },
    {
      goal: "lastOne",
      fen: "8/8/4K3/8/8/8/8/8 w - -",
      apples: "b5 c5 d6 e3 f3 g3",
      nbMoves: 8,
    },
  ].map(learnToLevel),
};

export default Learn;
