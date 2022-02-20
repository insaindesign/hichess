import { not, followScenario, completedScenario } from "../assert";
import { arrow, RawStage,  } from "../util";

const Learn: RawStage = {
  stage: "enpassant",
  category: "intermediate",
  levels: [
    {
      goal: "blackJustMovedThePawnByTwoSquares",
      fen: "rnbqkbnr/pppppppp/8/2P5/8/8/PP1PPPPP/RNBQKBNR b KQkq -",
      nbMoves: 1,
      scenario: [
        {
          move: "d7d5",
          shapes: [arrow("c5d6")],
        },
        "c5d6",
      ],
    },
    {
      goal: "enPassantOnlyWorksImmediately",
      fen: "rnbqkbnr/ppp1pppp/8/2Pp3P/8/8/PP1PPPP1/RNBQKBNR b KQkq -",
      nbMoves: 1,
      scenario: [
        {
          move: "g7g5",
          shapes: [arrow("h5g6"), arrow("c5d6", "red")],
        },
        "h5g6",
      ],
    },
    {
      goal: "enPassantOnlyWorksOnFifthRank",
      fen: "rnbqkbnr/pppppppp/P7/2P5/8/8/PP1PPPP1/RNBQKBNR b KQkq -",
      nbMoves: 1,
      scenario: [
        {
          move: "b7b5",
          shapes: [arrow("c5b6"), arrow("a6b7", "red")],
        },
        "c5b6",
      ],
    },
    {
      goal: "takeAllThePawnsEnPassant",
      fen: "rnbqkbnr/pppppppp/8/2PPP2P/8/8/PP1P1PP1/RNBQKBNR b KQkq -",
      nbMoves: 4,
      scenario: [
        "b7b5",
        "c5b6",
        "f7f5",
        "e5f6",
        "c7c5",
        "d5c6",
        "g7g5",
        "h5g6",
      ],
    },
  ].map((l) =>
    ({
      color: "white",
      failure: not(followScenario),
      success: completedScenario,
      ...l,
    })
  ),
};

export default Learn;
