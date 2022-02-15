import { arrow, learnToLevel, Stage } from "../util";

const Learn: Stage = {
  key: "rook",
  levels: [
    {
      goal: "rookGoal",
      fen: "8/8/8/8/8/8/4R3/8 w - -",
      apples: "e7",
      nbMoves: 1,
      shapes: [arrow("e2e7")],
    },
    {
      goal: "grabAllTheStars",
      fen: "8/2R5/8/8/8/8/8/8 w - -",
      apples: "c5 g5",
      nbMoves: 2,
      shapes: [arrow("c7c5"), arrow("c5g5")],
    },
    {
      goal: "theFewerMoves",
      fen: "8/8/8/8/3R4/8/8/8 w - -",
      apples: "a4 g3 g4",
      nbMoves: 3,
    },
    {
      goal: "theFewerMoves",
      fen: "7R/8/8/8/8/8/8/8 w - -",
      apples: "f8 g1 g7 g8 h7",
      nbMoves: 5,
    },
    {
      goal: "useTwoRooks",
      fen: "8/1R6/8/8/3R4/8/8/8 w - -",
      apples: "a4 g3 g7 h4",
      nbMoves: 4,
    },
    {
      goal: "useTwoRooks",
      fen: "8/8/8/8/8/5R2/8/R7 w - -",
      apples: "b7 d1 d5 f2 f7 g4 g7",
      nbMoves: 7,
    },
    {
      goal: "obstacles",
      fen: "8/8/8/8/8/8/8/R7 w - -",
      apples: "h1 h8",
      walls: "a2 b2 c2 e2 d2 f2 g2",
      nbMoves: 2,
    },
    {
      goal: "obstacles",
      fen: "8/8/8/8/8/8/8/7R w - -",
      apples: "a1 a3 h3 h8",
      walls: "a4 b4 c4 d4 e4 f4 g4 b2 c2 e2 d2 f2 g2 h2",
      nbMoves: 4,
    },
    {
      goal: "obstacles",
      fen: "8/8/8/8/8/8/8/7R w - -",
      apples: "h8",
      walls: "a8 b8 c8 d8 e8 f8 g8 a6 b6 c6 e6 f6 g6 h6 a4 b4 c4 d4 e4 f4 g4 b2 c2 e2 d2 f2 g2 h2",
      nbMoves: 8,
    },
    {
      goal: "obstacles",
      fen: "8/8/8/8/8/8/8/7R w - -",
      apples: "h8 a5",
      walls: "a8 b8 c8 d8 e8 f8 g8 a6 b6 c6 e6 f6 g6 h6 a4 b4 c4 d4 e4 f4 g4 b2 c2 e2 d2 f2 g2 h2",
      nbMoves: 9,
    },
    {
      goal: "obstacles",
      fen: "8/R7/8/8/8/8/8/7R w - -",
      apples: "a3 h8 a5",
      walls: "a8 b8 c8 d8 e8 f8 g8 a6 b6 c6 e6 f6 g6 h6 a4 b4 c4 d4 e4 f4 g4 b2 c2 e2 d2 f2 g2 h2",
      nbMoves: 7,
    },
  ].map(learnToLevel),
};

export default Learn;
