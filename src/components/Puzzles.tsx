import { useCallback, useEffect, useState } from "react";

import Puzzle from "./Puzzle";
import getPuzzles from "../data/puzzles";
import type { Puzzle as PuzzleType } from "../data/puzzles";

type Props = {};

function Puzzles(props: Props) {
  const [puzzles, setPuzzles] = useState<PuzzleType[]>([]);
  const [ii, setIndex] = useState(0);

  const nextPuzzle = useCallback(
    () => setIndex((ii + 1) % puzzles.length),
    [ii, puzzles]
  );

  useEffect(() => {
    getPuzzles().then((p) => {
      setPuzzles(p);
      setIndex(Math.floor(Math.random() * p.length));
    });
  }, []);

  const puzzle = puzzles[ii];
  if (!puzzle) {
    return <div>Loading</div>;
  }

  return (
    <Puzzle
      fen={puzzle.fen}
      solution={puzzle.solution}
      nextPuzzle={nextPuzzle}
    />
  );
}

export default Puzzles;
