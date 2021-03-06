import { arrow, RawStage } from "../util";
import { and, pieceOn } from "../assert";

const Learn: RawStage = {
  category: "intermediate",
  stage: "setup",
  levels: [
    {
      goal: "firstPlaceTheRooks",
      id: "m-cy33NG55",
      fen: "r6r/8/8/8/8/8/8/2RR4 w - -",
      apples: "a1 h1",
      nbMoves: 2,
      shapes: [arrow("c1a1"), arrow("d1h1")],
      success: and(pieceOn("R", "a1"), pieceOn("R", "h1")),
    },
    {
      goal: "thenPlaceTheKnights",
      id: "Yx6ebbfSqu",
      fen: "rn4nr/8/8/8/8/8/2NN4/R6R w - -",
      apples: "b1 g1",
      nbMoves: 4,
      success: and(pieceOn("N", "b1"), pieceOn("N", "g1")),
    },
    {
      goal: "placeTheBishops",
      id: "2cpUsRA_fh",
      fen: "rnb2bnr/8/8/8/4BB2/8/8/RN4NR w - -",
      apples: "c1 f1",
      nbMoves: 4,
      success: and(pieceOn("B", "c1"), pieceOn("B", "f1")),
    },
    {
      goal: "placeTheQueen",
      id: "QkKf4FSkDX",
      fen: "rnbq1bnr/8/8/8/5Q2/8/8/RNB2BNR w - -",
      apples: "d1",
      nbMoves: 2,
      success: pieceOn("Q", "d1"),
    },
    {
      goal: "placeTheKing",
      id: "ljEzleIUo9",
      fen: "rnbqkbnr/8/8/8/5K2/8/8/RNBQ1BNR w - -",
      apples: "e1",
      nbMoves: 3,
      success: pieceOn("K", "e1"),
    },
  ],
};

export default Learn;
