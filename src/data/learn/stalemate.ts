import { arrow, circle, RawStage,  } from "../util";
import { and, not, within, stalemate } from "../assert";

const Learn: RawStage = {
  stage: "stalemate",
  category: "intermediate",
  levels: [
    {
      id: "bYu_S8GRnG",
      fen: "k7/8/8/6B1/8/1R6/8/7K w - -",
      shapes: [arrow("g5e3")],
      scenario: [
        {
          move: "g5e3",
          shapes: [
            arrow("e3a7", "blue"),
            arrow("b3b8", "blue"),
            circle("a7", "blue"),
            circle("b7", "blue"),
            circle("b8", "blue"),
          ],
        },
      ],
    },
    {
      id: "kOwF3yZ-Zo",
      fen: "8/7p/4N2k/8/8/3N4/8/1K6 w - -",
      scenario: [
        {
          move: "d3f4",
          shapes: [
            arrow("e6g7", "blue"),
            arrow("e6g5", "blue"),
            arrow("f4g6", "blue"),
            arrow("f4h5", "blue"),
            circle("g7", "blue"),
            circle("g5", "blue"),
            circle("g6", "blue"),
            circle("h5", "blue"),
          ],
        },
      ],
    },
    {
      id: "3yTUA-R1zt",
      fen: "4k3/6p1/5p2/p4P2/PpB2N2/1K6/8/3R4 w - -",
      scenario: [
        {
          move: "f4g6",
          shapes: [
            arrow("c4f7", "blue"),
            arrow("d1d8", "blue"),
            arrow("g6e7", "blue"),
            arrow("g6f8", "blue"),
            circle("d7", "blue"),
            circle("d8", "blue"),
            circle("e7", "blue"),
            circle("f7", "blue"),
            circle("f8", "blue"),
          ],
        },
      ],
    },
    {
      id: "gSZMzj15Qt",
      fen: "8/6pk/6np/7K/8/3B4/8/1R6 w - -",
      scenario: [
        {
          move: "b1b8",
          shapes: [
            circle("g8", "blue"),
            circle("h8", "blue"),
            circle("g6", "red"),
            arrow("b8h8", "blue"),
            arrow("d3h7", "red"),
          ],
        },
      ],
    },
    {
      id: "-LP3kjcEPC",
      fen: "7R/pk6/p1pP4/K7/3BB2p/7p/1r5P/8 w - -",
      scenario: [
        {
          move: "d4b2",
          shapes: [
            arrow("h8a8", "blue"),
            arrow("a5b6", "blue"),
            arrow("d6c7", "blue"),
            arrow("e4b7", "red"),
            circle("c6", "red"),
            circle("a8", "blue"),
            circle("b8", "blue"),
            circle("c8", "blue"),
            circle("c7", "blue"),
            circle("b6", "blue"),
          ],
        },
      ],
    },
  ].map((l) =>
    ({
      goal: "stalemateGoal",
      nbMoves: 1,
      success: and(stalemate, within(1)),
      failure: and(not(stalemate), within(1)),
      ...l,
    })
  ),
};

export default Learn;
