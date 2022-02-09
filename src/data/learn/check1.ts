import { checkIn, noCheckIn } from "../assert";
import { arrow, toLevel } from "../util";

import type { Stage } from "../util";

const Learn: Stage = {
  key: "check1",
  levels: [
    {
      goal: "checkInOneGoal",
      fen: "4k3/8/2b5/8/8/8/8/R7 w - -",
      shapes: [arrow("a1e1")],
    },
    {
      goal: "checkInOneGoal",
      fen: "8/8/4k3/3n4/8/1Q6/8/8 w - -",
    },
    {
      goal: "checkInOneGoal",
      fen: "3qk3/1pp5/3p4/4p3/8/3B4/6r1/8 w - -",
    },
    {
      goal: "checkInOneGoal",
      fen: "2r2q2/2n5/8/4k3/8/2N1P3/3P2B1/8 w - -",
    },
    {
      goal: "checkInOneGoal",
      fen: "8/2b1q2n/1ppk4/2N5/8/8/8/8 w - -",
    },
    {
      goal: "checkInOneGoal",
      fen: "6R1/1k3r2/8/4Q3/8/2n5/8/8 w - -",
    },
    {
      goal: "checkInOneGoal",
      fen: "7r/4k3/8/3n4/4N3/8/2R5/4Q3 w - -",
    },
  ].map((l, i) =>
    toLevel(
      {
        nbMoves: 1,
        failure: noCheckIn(1),
        success: checkIn(1),
        ...l,
      },
      i
    )
  ),
};

export default Learn;
