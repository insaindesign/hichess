import { useCallback, useState } from "react";

import Puzzle from "./Puzzle";

type Props = {};

// get these from cache (then firestore if empty)
const p = [
  {
    fen: "r1bk2r1/ppq2pQp/3bpn2/1BpnN3/5P2/1P6/PBPP2PP/RN2K2R w KQ - 3 13",
    solution: "e5f7 d8e7 g7g8 f6g8",
  },
  {
    fen: "8/7R/5p2/p7/7P/2p5/3k2r1/1K2N3 w - - 3 48",
    solution: "e1g2 c3c2 b1a2 c2c1q h7d7 d2e2",
  },
  {
    fen: "2kr2r1/1bp4n/1pq1p2p/p1P5/1P3B2/P6P/5RP1/RB2Q1K1 w - - 3 26",
    solution: "e1f1 d8d1 f1d1 g8g2 g1f1 g2g1 f1e2 g1d1",
  },
  {
    fen: "r4rk1/3q1pbp/p1n1p1p1/2p3NP/1p3B2/3P3Q/PPP3P1/R3R1K1 b - - 2 19",
    solution: "d7d4 f4e3 d4f6 e1f1 f6e5 h5g6 e5e3 h3e3",
  },
  {
    fen: "r2r2k1/2q1bpp1/3p1n1p/1ppN4/1P1BP3/P5Q1/4RPPP/R5K1 b - - 1 20",
    solution: "f6d5 g3g7,1025",
  },
  {
    fen: "3q2k1/2r5/pp3p1Q/2b1n3/P3N3/2P5/1P4PP/R6K b - - 0 24",
    solution: "c7d7 e4f6 d8f6 h6f6",
  },
  {
    fen: "8/2k3n1/3p2p1/1KpP2Pp/2P4P/7B/8/8 w - - 0 57",
    solution: "b5a6 c7d8 a6b5 g7f5",
  },
  {
    fen: "6k1/p3b2p/1p1pP3/2p3P1/1Pnp3B/P6P/3Q3K/8 w - - 0 38",
    solution: "b4c5 c4d2 c5c6 d6d5 g5g6 e7d6",
  },
  {
    fen: "2q3k1/4br1p/6RQ/1p1n2p1/7P/1P4P1/1B2PP2/6K1 b - - 0 27",
    solution: "h7g6 h6h8",
  },
  {
    fen: "5rk1/1p2p1rp/p2p4/2pPb2R/2P1P3/1P1BKP1R/8/8 b - - 4 30",
    solution: "g7g3 h3g3 e5g3 h5g5 g8f7 g5g3",
  },
  {
    fen: "3r1rk1/1pR3pp/p2bp3/1q2Np2/3P4/1P5Q/5PPP/4R1K1 w - - 2 27",
    solution: "c7g7 g8g7 h3g3 g7h8",
  },
  {
    fen: "r6k/2q3pp/8/2p1n3/R1Qp4/7P/2PB1PP1/6K1 b - - 0 32",
    solution: "e5c4 a4a8 c7b8 a8b8",
  },
  {
    fen: "2rr4/2N2pk1/p1Q1b1pp/1p4q1/3pP3/1B1P4/PPP3PP/6RK w - - 7 25",
    solution: "c7e6 f7e6 c6b7 g7h8",
  },
  {
    fen: "r5k1/2p1pp2/pp4p1/1q1r4/5P2/2QP2R1/PP6/1K4R1 b - - 0 32",
    solution: "d5h5 g3g6 f7g6 g1g6 g8f7 c3g7 f7e8 g7g8 e8d7 g8e6 d7d8 g6g8",
  },
  {
    fen: "r1b1qrk1/pp1n1pbp/2pp1np1/4p3/2PP1B2/2NBPN1P/PP3PP1/R2Q1RK1 w - - 0 10",
    solution: "d4e5 d6e5 f4h2 e5e4",
  },
  {
    fen: "8/8/1p1k1p1p/3npp2/2B5/PP1K1PP1/7P/8 b - - 0 36",
    solution: "f5f4 c4d5 f4g3 h2g3 d6d5 g3g4",
  },
  {
    fen: "8/8/5pp1/3K3p/3N2kP/8/8/8 w - - 2 62",
    solution: "d5e6 g6g5 h4g5 f6g5 e6d5 h5h4 d5e4 h4h3 d4f3 g4g3",
  },
  {
    fen: "r1r3k1/ppq3bQ/4p2p/4n3/3p4/2P5/PBB2PPP/4R1K1 b - - 2 24",
    solution: "g8f8 b2a3 f8f7 c2d1 c8h8 d1h5 f7f6 h7e4",
  },
  {
    fen: "6k1/pp3pp1/2p1q1Pp/3b4/8/6Q1/PB3Pp1/3RrNK1 b - - 2 27",
    solution: "e1d1 g3b8 e6e8 b8e8",
  },
  {
    fen: "r2q1r1k/2p3p1/pb2Q2p/1p1p1n2/8/1BP5/PP1B1PPP/3RR1K1 w - - 3 20",
    solution: "b3d5 b6f2 g1f2 f5d4 f2g1 d4e6",
  },
  {
    fen: "r1q3k1/4bppp/pp2pn2/4B3/8/2N2Q2/PPPR1PPP/6K1 b - - 0 18",
    solution: "f6d7 d2d7 c8d7 f3a8",
  },
  {
    fen: "5rk1/R4pp1/1p5p/3Q4/1PPp2q1/3P2P1/5P2/4nK2 w - - 0 34",
    solution: "f1e1 f8e8 e1f1 g4h3 d5g2 e8e1 f1e1 h3g2",
  },
  {
    fen: "1r6/5k2/2p1pNp1/p5Pp/1pQ1P2P/2P4R/KP3P2/3q4 w - - 4 31",
    solution: "c4c6 b4b3 a2a3 d1a1",
  },
  {
    fen: "1r6/k2qn1b1/p1b1p1p1/2PpPpN1/2nN1P1P/p4B2/1PP2Q2/1K1R3R w - - 0 32",
    solution: "d4c6 e7c6 b2b3 a3a2 b1a1 c4e5 f4e5 g7e5 a1a2 b8b5",
  },
  {
    fen: "1k1r3r/2q5/pp1n2p1/8/1Q6/3R2P1/PPP2P1P/3R2K1 b - - 4 29",
    solution: "c7c5 b4c5 b6c5 d3d6 d8d6 d1d6",
  },
  {
    fen: "r5kr/pp1qb1p1/2p4p/3pPb1Q/3P4/2P1B3/PP4PP/R4RK1 b - - 1 17",
    solution: "f5e4 h5f7 g8h7 f1f6 e7f6 f7d7",
  },
];

function Puzzles(props: Props) {
  const [ii, setIndex] = useState(Math.round(Math.random() * (p.length - 1)));
  const nextPuzzle = useCallback(
    () => setIndex((ii + 1) % p.length),
    [ii]
  );

  return (
    <Puzzle fen={p[ii].fen} solution={p[ii].solution} nextPuzzle={nextPuzzle} />
  );
}

export default Puzzles;
