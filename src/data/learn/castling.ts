import { and, lastMoveSan, not, or, pieceNotOn } from "../assert";
import { arrow, circle } from "../util";

import type { RawStage } from "../util";

const castledKingSide = lastMoveSan("O-O");
const castledQueenSide = lastMoveSan("O-O-O");
const cantCastleKingSide = and(
  not(castledKingSide),
  or(pieceNotOn("K", "e1"), pieceNotOn("R", "h1"))
);
const cantCastleQueenSide = and(
  not(castledQueenSide),
  or(pieceNotOn("K", "e1"), pieceNotOn("R", "a1"))
);

const Learn: RawStage = {
  stage: "castling",
  category: "intermediate",
  levels: [
    {
      goal: "castleKingSide",
      id: "qvvYKUILHZ",
      fen: "rnbqkbnr/pppppppp/8/8/2B5/4PN2/PPPP1PPP/RNBQK2R w KQkq -",
      nbMoves: 1,
      shapes: [arrow("e1g1")],
      success: castledKingSide,
      failure: cantCastleKingSide,
    },
    {
      goal: "castleQueenSide",
      id: "wETYOUs1mc",
      fen: "rnbqkbnr/pppppppp/8/8/4P3/1PN5/PBPPQPPP/R3KBNR w KQkq -",
      nbMoves: 1,
      shapes: [arrow("e1c1")],
      success: castledQueenSide,
      failure: cantCastleQueenSide,
    },
    {
      goal: "theKnightIsInTheWay",
      id: "PeHARyqkgy",
      fen: "rnbqkbnr/pppppppp/8/8/8/4P3/PPPPBPPP/RNBQK1NR w KQkq -",
      nbMoves: 2,
      shapes: [arrow("e1g1"), arrow("g1f3")],
      success: castledKingSide,
      failure: cantCastleKingSide,
    },
    {
      goal: "castleKingSideMovePiecesFirst",
      id: "sbREedwmmw",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -",
      nbMoves: 4,
      shapes: [arrow("e1g1")],
      success: castledKingSide,
      failure: cantCastleKingSide,
    },
    {
      goal: "castleQueenSideMovePiecesFirst",
      id: "o4d3pxJvzz",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -",
      nbMoves: 6,
      shapes: [arrow("e1c1")],
      success: castledQueenSide,
      failure: cantCastleQueenSide,
    },
    {
      goal: "youCannotCastleIfMoved",
      id: "e7CzG9GgZ9",
      fen: "rnbqkbnr/pppppppp/8/8/3P4/1PN1PN2/PBPQBPPP/R3K1R1 w Qkq -",
      nbMoves: 1,
      shapes: [arrow("e1g1", "red"), arrow("e1c1")],
      success: castledQueenSide,
      failure: cantCastleQueenSide,
    },
    {
      goal: "youCannotCastleIfAttacked",
      id: "sqtMq5L-Q3",
      fen: "rn1qkbnr/ppp1pppp/3p4/8/2b5/4PN2/PPPP1PPP/RNBQK2R w KQkq -",
      nbMoves: 2,
      shapes: [arrow("c4f1", "red"), circle("e1"), circle("f1"), circle("g1")],
      success: castledKingSide,
      failure: cantCastleKingSide,
    },
    {
      goal: "findAWayToCastleKingSide",
      id: "cx3I_pwZsP",
      fen: "rnb2rk1/pppppppp/8/8/8/4Nb1n/PPPP1P1P/RNB1KB1R w KQkq -",
      nbMoves: 2,
      shapes: [arrow("e1g1")],
      success: castledKingSide,
      failure: cantCastleKingSide,
    },
    {
      goal: "findAWayToCastleQueenSide",
      id: "I7bxzv5qyu",
      fen: "1r1k2nr/p2ppppp/7b/7b/4P3/2nP4/P1P2P2/RN2K3 w Q -",
      nbMoves: 4,
      shapes: [arrow("e1c1")],
      success: castledQueenSide,
      failure: cantCastleQueenSide,
    },
  ],
};

export default Learn;
