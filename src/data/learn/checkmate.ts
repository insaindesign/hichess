import { arrow, learnToLevel } from "../util";
import {
  completedScenario,
  followScenario,
  not,
  mateIn,
  noMateIn,
} from "../assert";

import type { Stage } from "../util";

const Learn: Stage = {
  key: "checkmate",

  levels: [
    {
      // rook
      fen: "3qk3/3ppp2/8/8/2B5/5Q2/8/8 w - -",
      shapes: [arrow("f3f7")],
      nbMoves: 1,
    },
    {
      // smothered
      fen: "6rk/6pp/8/6N1/8/8/6PP/6K1 w - -",
      nbMoves: 1,
    },
    {
      // smothered in 2
      fen: "6rk/6pp/6q1/6N1/8/7Q/6PP/6K1 w - -",
      nbMoves: 2,
      scenario: ['h3h7', 'g6h7', 'g5f7']
    },
    {
      // smothered in 2
      fen: "3r3k/1p1b1Qbp/1n2B1p1/p5N1/Pq6/8/1P4PP/R6K w - -",
      nbMoves: 2,
      scenario: ['f7g8', 'd8g8', 'g5f7']
    },
    {
      // rook
      fen: "R7/8/7k/2r5/5n2/8/6Q1/8 w - -",
      nbMoves: 1,
    },
    {
      // Q+N
      fen: "2rb4/2k5/5N2/1Q6/8/8/8/8 w - -",
      nbMoves: 1,
    },
    {
      // discovered
      fen: "1r2kb2/ppB1p3/2P2p2/2p1N3/B7/8/8/3R4 w - -",
      nbMoves: 1,
    },
    {
      // back-rank
      fen: "6k1/4Rppp/8/8/8/8/5PPP/6K1 w - -",
      nbMoves: 1,
    },
    {
      // back-rank 2 moves
      fen: "2r1r1k1/5ppp/8/8/8/8/4RPPP/4Q1K1 w - -",
      nbMoves: 2,
      scenario: ["e2e8", "c8e8", "e1e8"],
    },
    {
      // back-rank 1 moves
      fen: "8/1p6/kp6/1p6/8/8/5PPP/5RK1 w - -",
      nbMoves: 1,
    },
    {
      // back-rank 3 moves
      fen: "6k1/3qb1pp/4p3/ppp1P3/8/2PP1Q2/PP4PP/5RK1 w - -",
      nbMoves: 3,
      scenario: ["f3f7", "g8h8", "f7f8", "e7f8", "f1f8"],
    },
    {
      // anastasia
      fen: "5r2/1b2Nppk/8/2R5/8/8/5PPP/6K1 w - -",
      nbMoves: 1,
      scenario: ["c5h5"],
    },
    {
      // anastasia
      fen: "5r1k/1b2Nppp/8/2R5/4Q3/8/5PPP/6K1 w - -",
      nbMoves: 2,
      scenario: ["e4h7", 'h8h7', "c5h5"],
    },
    {
      // anastasia
      fen: "5rk1/1b3ppp/8/2RN4/8/8/2Q2PPP/6K1 w - -",
      nbMoves: 3,
      scenario: ["d5e7", 'g8h8', "c2h7", 'h8h7', "c5h5"],
    },
    {
      // anastasia
      fen: "1r5k/6pp/2pr4/P1Q3bq/1P2Bn2/2P5/5PPP/R3NRK1 b - -",
      nbMoves: 3,
      scenario: ["f4e2", "g1h1", "h5h2", "h1h2", "d6h6"],
    },
    {
      // blind swine
      fen: "5rk1/1R2R1pp/8/8/8/8/8/1K6 w - -",
      nbMoves: 3,
      scenario: ['e7g7', 'g8h8', 'g7h7', 'h8g8', 'b7g7'],
    },
    {
      // tricky
      fen: "8/pk1N4/n7/b7/6B1/1r3b2/8/1RR5 w - -",
      nbMoves: 1,
      scenario: [
        {
          move: "g4f3",
          shapes: [arrow("b1b7", "yellow"), arrow("f3b7", "yellow")],
        },
      ],
    },
    {
      // tricky
      fen: "r1b5/ppp5/2N2kpN/5q2/8/Q7/8/4B3 w - -",
      nbMoves: 1,
    },
  ].map((l) =>
    learnToLevel({
      goal: "attackYourOpponentsKing",
      failure: l.scenario ? not(followScenario) : noMateIn(l.nbMoves),
      success: l.scenario ? completedScenario : mateIn(l.nbMoves),
      ...l,
    })
  ),
};

export default Learn;
