import { completedScenario, followScenario, not, pieceOn } from "../assert";
import { arrow, RawStage } from "../util";

const Learn: RawStage = {
  category: "advanced",
  stage: "value",
  levels: [
    {
      // rook
      goal: "queenOverBishop",
      id: "dNg7TdgldN",
      fen: "8/8/2qrbnp1/3P4/8/8/8/8 w - -",
      scenario: ["d5c6"],
      shapes: [arrow("d5c6")],
      success: pieceOn("P", "c6"),
    },
    {
      goal: "pieceValueExchange",
      id: "mYOU0HE8l2",
      fen: "8/8/4b3/1p6/6r1/8/4Q3/8 w - -",
      scenario: ["e2e6"],
      success: pieceOn("Q", "e6"),
    },
    {
      goal: "pieceValueLegal",
      id: "kZmpG4215C",
      fen: "5b2/8/6N1/2q5/3Kn3/2rp4/3B4/8 w - -",
      scenario: ["d4e4"],
      offerIllegalMove: true,
    },
    {
      goal: "takeThePieceWithTheHighestValue",
      id: "LgFYgvEKwn",
      fen: "1k4q1/pp6/8/3B4/2P5/1P1p2P1/P3Kr1P/3n4 w - -",
      scenario: ["e2d1"],
      offerIllegalMove: true,
    },
    {
      goal: "takeThePieceWithTheHighestValue",
      id: "1wsRlOsMse",
      fen: "7k/3bqp1p/7r/5N2/6K1/6n1/PPP5/R1B5 w - -",
      scenario: ["c1h6"],
      offerIllegalMove: true,
    },
  ].map((l) =>
    ({
      nbMoves: 1,
      success: completedScenario,
      failure: not(followScenario),
      ...l,
    })
  ),
};

export default Learn;
