import { checkIn, noCheckIn } from "../assert";
import { arrow, RawStage } from "../util";

const Learn: RawStage = {
  category: "fundamentals",
  stage: "outOfCheck",
  levels: [
    {
      goal: "escapeWithTheKing",
      id: "bHgCH2jo8z",
      fen: "8/8/8/4q3/8/8/8/4K3 w - -",
      shapes: [arrow("e5e1", "red"), arrow("e1f1")],
    },
    {
      goal: "escapeWithTheKing",
      id: "9TmIEIoFhB",
      fen: "8/2n5/5b2/8/2K5/8/2q5/8 w - -",
    },
    {
      goal: "theKingCannotEscapeButBlock",
      id: "Epe65OKNqD",
      fen: "8/7r/6r1/8/R7/7K/8/8 w - -",
    },
    {
      goal: "youCanGetOutOfCheckByTaking",
      id: "uHYStGBGSr",
      fen: "8/8/8/3b4/8/4N3/KBn5/1R6 w - -",
    },
    {
      goal: "thisKnightIsCheckingThroughYourDefenses",
      id: "RVqZd02SKJ",
      fen: "4q3/8/8/8/8/5nb1/3PPP2/3QKBNr w - -",
    },
    {
      goal: "escapeOrBlock",
      id: "9XXm5IPoRr",
      fen: "8/8/7p/2q5/5n2/1N1KP2r/3R4/8 w - -",
    },
    {
      goal: "escapeOrBlock",
      id: "UU3lcCAQTm",
      fen: "8/6b1/8/8/q4P2/2KN4/3P4/8 w - -",
    },
  ].map((l) =>
    ({
      success: noCheckIn(1),
      failure: checkIn(1),
      nbMoves: 1,
      ...l,
    })
  ),
};

export default Learn;
