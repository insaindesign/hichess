import { arrow,  } from "../util";

import type { RawStage } from "../util";

const Learn: RawStage = {
  category: "pieces",
  stage: "king",
  levels: [
    {
      goal: "theKingIsSlow",
      id: "Lu86dNiTiK",
      fen: "8/8/8/8/8/3K4/8/8 w - -",
      apples: "e6",
      nbMoves: 3,
      shapes: [arrow("d3d4"), arrow("d4e5"), arrow("e5e6")],
    },
    {
      goal: "grabAllTheStars",
      id: "zAS5ldqb79",
      fen: "8/8/8/8/4K3/8/8/8 w - -",
      apples: "c2 b2 e2 e3",
      nbMoves: 5,
    },
    {
      goal: "lastOne",
      id: "SxKecH5_Ig",
      fen: "8/8/4K3/8/8/8/8/8 w - -",
      apples: "b5 c5 d6 e3 f3 g3",
      nbMoves: 8,
    },
  ],
};

export default Learn;
