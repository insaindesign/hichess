import { checkIn, noCheckIn } from "../assert";
import { arrow, toLevel } from "../util";

import type { Stage } from "../util";

const Learn: Stage = {
  key: "check2",
  levels: [
    {
      goal: "checkInTwoGoal",
      fen: "2k5/2pb4/8/2R5/8/8/8/8 w - -",
      shapes: [arrow("c5a5"), arrow("a5a8")],
    },
    {
      goal: "checkInTwoGoal",
      fen: "8/8/5k2/8/8/1N6/5b2/8 w - -",
    },
    {
      goal: "checkInTwoGoal",
      fen: "6k1/2r3pp/8/1N6/8/8/4B3/8 w - -",
    },
    {
      goal: "checkInTwoGoal",
      fen: "r3k3/7b/8/4B3/8/8/4N3/4R3 w - -",
    },
    {
      goal: "checkInTwoGoal",
      fen: "r1bqkb1r/pppp1p1p/2n2np1/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R w KQkq -",
    },
    {
      goal: "checkInTwoGoal",
      fen: "8/8/8/2k5/q7/4N3/3B4/8 w - -",
    },
    {
      goal: "checkInTwoGoal",
      fen: "r6r/1Q2nk2/1B3p2/8/8/8/8/8 w - -",
    },
  ].map((l, i) =>
    toLevel(
      {
        nbMoves: 2,
        failure: noCheckIn(2),
        success: checkIn(2),
        ...l,
      },
      i
    )
  ),
};

export default Learn;
