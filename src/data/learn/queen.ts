import { arrow, RawStage } from "../util";

const Learn: RawStage = {
  category: "pieces",
  stage: "queen",
  levels: [
    {
      goal: "grabAllTheStars",
      id: "xI9CeICx7n",
      fen: "8/8/8/8/8/8/4Q3/8 w - -",
      apples: "e5 b8",
      nbMoves: 2,
      shapes: [arrow("e2e5"), arrow("e5b8")],
    },
    {
      goal: "grabAllTheStars",
      id: "KD8FiezRZL",
      fen: "8/8/8/8/3Q4/8/8/8 w - -",
      apples: "a3 f2 f8 h3",
      nbMoves: 4,
    },
    {
      goal: "grabAllTheStars",
      id: "NQqQ2z0iGD",
      fen: "8/8/8/8/2Q5/8/8/8 w - -",
      apples: "a3 d6 f1 f8 g3 h6",
      nbMoves: 6,
    },
    {
      goal: "grabAllTheStars",
      id: "Yt3bAiTGTQ",
      fen: "8/6Q1/8/8/8/8/8/8 w - -",
      apples: "a2 b5 d3 g1 g8 h2 h5",
      nbMoves: 7,
    },
    {
      goal: "grabAllTheStars",
      id: "97tH1Zikbm",
      fen: "8/8/8/8/8/8/8/4Q3 w - -",
      apples: "a6 d1 f2 f6 g6 g8 h1 h4",
      nbMoves: 9,
    },
  ],
};

export default Learn;
