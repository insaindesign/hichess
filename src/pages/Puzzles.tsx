import { useCallback, useEffect, useState } from "react";

import getPuzzles from "../data/puzzles";
import Problem from "../components/Problem";

import type { Level } from "../data/util";

type Props = {};

function Puzzles(props: Props) {
  const [puzzles, setPuzzles] = useState<Level[]>([]);
  const [ii, setIndex] = useState(0);

  const nextPuzzle = useCallback(
    () => setIndex((ii + 1) % puzzles.length),
    [ii, puzzles]
  );

  useEffect(() => {
    getPuzzles(600).then((p) => {
      setPuzzles(p);
      setIndex(Math.floor(Math.random() * p.length));
    });
  }, []);

  const puzzle = puzzles[ii];
  if (!puzzle) {
    return <div>Loading</div>;
  }

  return <Problem level={puzzle} nextLevel={nextPuzzle} />;
}

export default Puzzles;
