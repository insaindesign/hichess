import { useCallback, useEffect, useState } from "react";

import getPuzzles from "../data/puzzles";
import { withRequireAccount } from "../components/RequireAccount";
import Problem from "../components/Problem";
import Loading from "../components/Loading";

import type { Level } from "../data/util";
import type { Account } from "../state/accounts";
import { useRecoilValue } from "recoil";
import { eloStateForAccountId } from "../state/elo";
import { useNavigate, useParams } from "react-router-dom";

type Props = {
  account: Account;
};

type Params = {
  theme?: string;
  id?: string;
};

function Puzzles({ account }: Props) {
  const params = useParams() as unknown as Params;
  const navigate = useNavigate();
  const [puzzles, setPuzzles] = useState<Level[] | null>(null);

  const id = params.id || null;
  const theme = params.theme || "all";

  const { eloState, eloLoadedState } = eloStateForAccountId(account.id);
  const elo = useRecoilValue(eloState("puzzle"));
  const eloLoaded = useRecoilValue(eloLoadedState);
  const rating = Math.min(Math.max(Math.round(elo / 100) * 100, 600), 900);

  const nextPuzzle = useCallback(() => {
    if (puzzles) {
      const ii = puzzles.findIndex((pz) => pz.id === id);
      navigate("/puzzles/" + theme + "/" + puzzles[ii + 1 % puzzles.length].id);
    }
  }, [id, theme, puzzles, navigate]);

  useEffect(() => {
    if (!eloLoaded) {
      return;
    }
    getPuzzles(rating).then((p) => {
      const puzzles = p.filter(
        (c) =>
          (theme === "all" || c.themes.includes(theme)) &&
          c.rating < rating + 100
      );
      if (!id && puzzles.length) {
        const ii = Math.floor(Math.random() * puzzles.length);
        navigate("/puzzles/" + theme + "/" + puzzles[ii].id);
      } else if (puzzles.length && puzzles.find((p) => p.id === id)) {
        setPuzzles(puzzles);
      } else {
        navigate("/puzzles");
      }
    });
  }, [rating, eloLoaded, theme, id, navigate]);

  const puzzle = puzzles && id ? puzzles.find((pz) => pz.id === id) : null;
  if (!puzzle || !eloLoaded) {
    return <Loading />;
  }

  return (
    <Problem level={puzzle} nextLevel={nextPuzzle} account={account} />
  );
}

export default withRequireAccount(Puzzles);
