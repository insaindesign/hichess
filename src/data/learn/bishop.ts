import { arrow } from "../util";
import { RawStage } from "../util";

const Learn: RawStage = {
  category: "pieces",
  stage: "bishop",
  levels: [
    {
      goal: "grabAllTheStars",
      id: "sw1fXZARzO",
      fen: "8/8/8/8/8/5B2/8/8 w - -",
      apples: "d5 g8",
      nbMoves: 2,
      shapes: [arrow("f3d5"), arrow("d5g8")],
    },
    {
      goal: "theFewerMoves",
      id: "Itq_tFXX6F",
      fen: "8/8/8/8/8/1B6/8/8 w - -",
      apples: "a2 b1 b5 d1 d3 e2",
      nbMoves: 6,
    },
    {
      goal: "grabAllTheStars",
      id: "DtwUhLokKu",
      fen: "8/8/8/8/3B4/8/8/8 w - -",
      apples: "a1 b6 c1 e3 g7 h6",
      nbMoves: 6,
    },
    {
      goal: "grabAllTheStars",
      id: "NcyGoZlc3B",
      fen: "8/8/8/8/2B5/8/8/8 w - -",
      apples: "a4 b1 b3 c2 d3 e2",
      nbMoves: 6,
    },
    {
      goal: "youNeedBothBishops",
      id: "v6Ii1a5FqY",
      fen: "8/8/8/8/8/8/8/2B2B2 w - -",
      apples: "d3 d4 d5 e3 e4 e5",
      nbMoves: 6,
    },
    {
      goal: "youNeedBothBishops",
      id: "nA7-5P0dgI",
      fen: "8/3B4/8/8/8/2B5/8/8 w - -",
      apples: "a3 c2 e7 f5 f6 g8 h4 h7",
      nbMoves: 11,
    },
    {
      goal: "obstacles",
      id: "e2s82dFJp9",
      fen: "8/8/8/8/8/4B3/8/8 w - -",
      apples: "f8 a7",
      walls:
        "a8 b8 c8 d8 e8 b7 c7 d7 e7 f7 c6 d6 e6 f6 g6 d5 e5 f5 e4 a2 b2 c2 d2 e2 f2 g2 h2 a1 b1 c1 d1 e1 f1 g1 h1",
      nbMoves: 4,
    },
    {
      goal: "obstacles",
      id: "O1RnKqjCGs",
      fen: "8/8/8/8/8/3BB3/8/8 w - -",
      apples: "f8 a7 a6 h5",
      walls:
        "a8 b8 c8 d8 e8 b7 c7 d7 e7 f7 c6 d6 e6 f6 g6 d5 e5 f5 e4 a2 b2 c2 f2 g2 h2 a1 b1 c1 d1 e1 f1 g1 h1",
      nbMoves: 6,
    },
  ],
};

export default Learn;
