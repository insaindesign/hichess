import { not, followScenario, completedScenario } from "../assert";
import { arrow, RawStage,  } from "../util";

const Learn: RawStage = {
  category: "advanced",
  stage: "skewer",
  levels: [
    {
      goal: "relativeskewer",
      id: "1amPjef3_y",
      fen: "8/1r3k2/2q1ppp1/8/5PB1/4P3/4QK2/5R2 w - -",
      nbMoves: 1,
      shapes: [arrow("g4f3")],
      scenario: [{ move: "g4f3", shapes: [arrow("f3b7", "red")] }],
    },
    {
      goal: "relativeskewer",
      id: "160QUHTXlE",
      fen: "r2r2k1/2p2ppp/5n2/4p3/pB2P3/P2q3P/2R2PP1/2RQ2K1 w - - 0 1",
      nbMoves: 1,
      scenario: ["c2d2", "d3d2", "b4d2"],
    },
    {
      goal: "absoluteskewer",
      id: "wvArmHCz4T",
      fen: "8/3qkb2/8/8/4KB2/5Q2/8/8 b - -",
      nbMoves: 1,
      scenario: ["f7d5"],
    },
  ].map((l) =>
    ({
      failure: not(followScenario),
      success: completedScenario,
      ...l,
    })
  ),
};

export default Learn;
