import { and, canBeCaptured, checkIn, not, noCheckIn } from "../assert";
import { arrow } from "../util";

import type { RawStage } from "../util";

const Learn: RawStage = {
  stage: "check",
  category: "fundamentals",
  levels: [
    {
      goal: "checkInOneGoal",
      fen: "4k3/8/2b5/8/8/8/8/R7 w - -",
      nbMoves: 1,
      shapes: [arrow("a1e1")],
    },
    {
      goal: "checkInOneGoal",
      fen: "8/8/4k3/3n4/8/1Q6/8/8 w - -",
      nbMoves: 1,
    },
    {
      goal: "checkInOneGoal",
      fen: "3qk3/1pp5/3p4/4p3/8/3B4/6r1/8 w - -",
      nbMoves: 1,
    },
    {
      goal: "checkInOneGoal",
      fen: "2r2q2/2n5/8/4k3/8/2N1P3/3P2B1/8 w - -",
      nbMoves: 1,
    },
    {
      goal: "checkInOneGoal",
      fen: "8/2b1q2n/1ppk4/2N5/8/8/8/8 w - -",
      nbMoves: 1,
    },
    {
      goal: "checkInOneGoal",
      fen: "6R1/1k3r2/8/4Q3/8/2n5/8/8 w - -",
      nbMoves: 1,
    },
    {
      goal: "checkInOneGoal",
      fen: "7r/4k3/8/3n4/4N3/8/2R5/4Q3 w - -",
      nbMoves: 1,
    },
    {
      goal: "checkInTwoGoal",
      fen: "2k5/2pb4/8/2R5/8/8/8/8 w - -",
      shapes: [arrow("c5a5"), arrow("a5a8")],
      nbMoves: 2,
    },
    {
      goal: "checkInTwoGoal",
      fen: "8/8/5k2/8/8/1N6/5b2/8 w - -",
      nbMoves: 2,
    },
    {
      goal: "checkInTwoGoal",
      fen: "6k1/2r3pp/8/1N6/8/8/4B3/8 w - -",
      nbMoves: 2,
    },
    {
      goal: "checkInTwoGoal",
      fen: "r3k3/7b/8/4B3/8/8/4N3/4R3 w - -",
      nbMoves: 2,
    },
    {
      goal: "checkInTwoGoal",
      fen: "r1bqkb1r/pppp1p1p/2n2np1/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R w KQkq -",
      nbMoves: 2,
    },
    {
      goal: "checkInTwoGoal",
      fen: "8/8/8/2k5/q7/4N3/3B4/8 w - -",
      nbMoves: 2,
    },
    {
      goal: "checkInTwoGoal",
      fen: "r6r/1Q2nk2/1B3p2/8/8/8/8/8 w - -",
      nbMoves: 2,
    },
  ].map((l) => ({
    failure: noCheckIn(l.nbMoves),
    success: and(checkIn(l.nbMoves), not(canBeCaptured)),
    ...l,
  })),
};

export default Learn;
