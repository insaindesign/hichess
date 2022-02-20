import { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

import getPuzzles from "../data/puzzles";
import Problem from "../components/Problem";
import { accountIdState } from "../state/accounts";

import type { Level } from "../data/util";
import { appLoadedState } from "../state/app";

type Props = {};

function Puzzles(props: Props) {
  const navigate = useNavigate();
  const [puzzles, setPuzzles] = useState<Level[]>([]);
  const appLoaded = useRecoilValue(appLoadedState);
  const accountId = useRecoilValue(accountIdState);
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

  useEffect(() => {
    if (!accountId && appLoaded) {
      navigate('/');
    }
  }, [appLoaded, accountId, navigate])

  const puzzle = puzzles[ii];
  if (!puzzle || !appLoaded) {
    return <div>Loading</div>;
  }

  if (!accountId) {
    return null;
  }

  return (
    <Problem level={puzzle} nextLevel={nextPuzzle} accountId={accountId} />
  );
}

export default Puzzles;
