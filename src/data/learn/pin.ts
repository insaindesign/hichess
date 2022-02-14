import { not, followScenario, completedScenario } from "../assert";
import { arrow, Stage, learnToLevel } from "../util";

const Learn: Stage = {
  key: "pin",
  levels: [
    {
      goal: "absolutepin",
      fen: "7k/8/8/4n3/4P3/8/8/6BK w - -",
      nbMoves: 1,
      shapes: [arrow("g1d4"), arrow("d4h8", "red")],
      scenario: ["g1d4"],
    },
    {
      goal: "absolutepin",
      fen: "5k2/p1p2pp1/7p/2r5/8/1P3P2/PBP3PP/1K6 w - - 0 1",
      nbMoves: 1,
      scenario: ["b2a3", "a7a5"],
    },
    {
      goal: "relativepin",
      fen: "1k6/ppp3q1/8/4r3/8/8/3B1PPP/R4QK1 w - -",
      nbMoves: 1,
      scenario: ["d2c3"],
    },
    {
      goal: "exploitpin",
      fen: "4k3/6p1/5p1p/4n3/8/7P/5PP1/4R1K1 w - -",
      nbMoves: 1,
      scenario: ["f2f4"],
    },
    {
      goal: "exploitpin",
      fen: "r4rk1/pp1p1ppp/1qp2n2/8/4P3/1P1P2Q1/PBP2PPP/R4RK1 w - -",
      nbMoves: 1,
      scenario: ["b2f6"],
    },
    {
      goal: "exploitpin",
      fen: "1r1n1rk1/ppq2p2/2b2bp1/2pB3p/2P4P/4P3/PBQ2PP1/1R3RK1 w - -",
      nbMoves: 2,
      scenario: ["c2g6", "g8h8", "b2f6"],
    },
  ].map((l) =>
    learnToLevel({
      failure: not(followScenario),
      success: completedScenario,
      ...l,
    })
  ),
};

export default Learn;
