import { arrow, RawStage } from "../util";

const Learn: RawStage = {
  category: "pieces",
  stage: "knight",
  levels: [
    {
      goal: "knightsHaveAFancyWay",
      id: "rWgjmi815t",
      fen: "8/8/8/8/4N3/8/8/8 w - -",
      apples: "c5 d7",
      nbMoves: 2,
      shapes: [arrow("e4c5"), arrow("c5d7")],
    },
    {
      goal: "grabAllTheStars",
      id: "zXQVqLs5PD",
      fen: "8/8/8/8/8/8/8/1N6 w - -",
      apples: "c3 d4 e2 f3 f7 g5 h8",
      nbMoves: 8,
    },
    {
      goal: "grabAllTheStars",
      id: "HxsidOlLXG",
      fen: "8/2N5/8/8/8/8/8/8 w - -",
      apples: "b6 d5 d7 e6 f4",
      nbMoves: 5,
    },
    {
      goal: "knightsCanJumpOverObstacles",
      id: "VK-BllrGeM",
      fen: "8/8/8/8/5N2/8/8/8 w - -",
      apples: "e3 e4 e5 f3 f5 g3 g4 g5",
      nbMoves: 9,
    },
    {
      goal: "grabAllTheStars",
      id: "rzjdq2CgfI",
      fen: "8/8/8/8/8/3N4/8/8 w - -",
      apples: "c3 e2 e4 f2 f4 g6",
      nbMoves: 6,
    },
    {
      goal: "grabAllTheStars",
      id: "YWyBybHIFf",
      fen: "8/2N5/8/8/8/8/8/8 w - -",
      apples: "b4 b5 c6 c8 d4 d5 e3 e7 f5",
      nbMoves: 9,
    },
  ],
};

export default Learn;
