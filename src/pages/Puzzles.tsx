import { useCallback, useEffect, useState } from "react";

import getPuzzles from "../data/puzzles";
import { withRequireAccount } from "../components/RequireAccount";
import Problem from "../components/Problem";
import Loading from "../components/Loading";

import type { Level } from "../data/util";
import type { Account } from "../state/accounts";
import { useRecoilValue } from "recoil";
import { eloStateForAccountId } from "../state/elo";

type Props = {
  account: Account
};

function Puzzles({ account }: Props) {
  const [puzzles, setPuzzles] = useState<Level[]>([]);
  const [ii, setIndex] = useState(0);
  const { eloState } = eloStateForAccountId(account.id);
  const elo = useRecoilValue(eloState('puzzle'));
  const rating = Math.min(Math.max(Math.round(elo / 100) * 100, 600), 900);

  const nextPuzzle = useCallback(
    () => setIndex((ii + 1) % puzzles.length),
    [ii, puzzles]
  );

  useEffect(() => {
    setPuzzles([]);
    getPuzzles(rating).then((p) => {
      setPuzzles(p);
      setIndex(Math.floor(Math.random() * p.length));
    });
  }, [rating]);

  const puzzle = puzzles[ii];
  if (!puzzle) {
    return <Loading />;
  }

  return (
    <Problem level={puzzle} nextLevel={nextPuzzle} accountId={account.id} />
  );
}

export default withRequireAccount(Puzzles);
