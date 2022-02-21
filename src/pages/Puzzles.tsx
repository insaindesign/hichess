import { useCallback, useEffect, useState } from "react";

import getPuzzles from "../data/puzzles";
import { withRequireAccount } from "../components/RequireAccount";
import Problem from "../components/Problem";
import Loading from "../components/Loading";

import type { Level } from "../data/util";
import type { Account } from "../state/accounts";

type Props = {
  account: Account
};

function Puzzles({ account }: Props) {
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
    return <Loading />;
  }

  return (
    <Problem level={puzzle} nextLevel={nextPuzzle} accountId={account.id} />
  );
}

export default withRequireAccount(Puzzles);
