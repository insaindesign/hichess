import { arrow, learnToLevel } from "../util";
import { Stage } from "../util";

const Learn: Stage = {
  key: "bishop",
  levels: [
    {
      goal: "grabAllTheStars",
      fen: "8/8/8/8/8/5B2/8/8 w - -",
      apples: "d5 g8",
      nbMoves: 2,
      shapes: [arrow("f3d5"), arrow("d5g8")],
    },
    {
      goal: "theFewerMoves",
      fen: "8/8/8/8/8/1B6/8/8 w - -",
      apples: "a2 b1 b5 d1 d3 e2",
      nbMoves: 6,
    },
    {
      goal: "grabAllTheStars",
      fen: "8/8/8/8/3B4/8/8/8 w - -",
      apples: "a1 b6 c1 e3 g7 h6",
      nbMoves: 6,
    },
    {
      goal: "grabAllTheStars",
      fen: "8/8/8/8/2B5/8/8/8 w - -",
      apples: "a4 b1 b3 c2 d3 e2",
      nbMoves: 6,
    },
    {
      goal: "youNeedBothBishops",
      fen: "8/8/8/8/8/8/8/2B2B2 w - -",
      apples: "d3 d4 d5 e3 e4 e5",
      nbMoves: 6,
    },
    {
      goal: "youNeedBothBishops",
      fen: "8/3B4/8/8/8/2B5/8/8 w - -",
      apples: "a3 c2 e7 f5 f6 g8 h4 h7",
      nbMoves: 11,
    },
    {
      goal: "obstacles",
      fen: "8/8/8/8/8/4B3/8/8 w - -",
      apples: "f8 a7",
      walls:
        "a8 b8 c8 d8 e8 b7 c7 d7 e7 f7 c6 d6 e6 f6 g6 d5 e5 f5 e4 a2 b2 c2 d2 e2 f2 g2 h2 a1 b1 c1 d1 e1 f1 g1 h1",
      nbMoves: 4,
    },
    {
      goal: "obstacles",
      fen: "8/8/8/8/8/3BB3/8/8 w - -",
      apples: "f8 a7 a6 h5",
      walls:
        "a8 b8 c8 d8 e8 b7 c7 d7 e7 f7 c6 d6 e6 f6 g6 d5 e5 f5 e4 a2 b2 c2 f2 g2 h2 a1 b1 c1 d1 e1 f1 g1 h1",
      nbMoves: 6,
    },
  ].map(learnToLevel),
};

export default Learn;
