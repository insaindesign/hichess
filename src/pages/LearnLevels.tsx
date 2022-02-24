import { useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import categories from "../data/learn";
import Learn from "../components/Learn";
import Problem from "../components/Problem";
import { withRequireAccount } from "../components/RequireAccount";
import { ProblemAttemptsOfIds, problemStateForAccountId } from "../state/problems";

import type { Account } from "../state/accounts";
import type { Level } from "../data/util";

type Props = {
  account: Account;
};

const getNextLevel = (levels: Level[], id: string, attempts: ProblemAttemptsOfIds): Level | null => {
  let index = levels.findIndex(l => l.id === id) + 1;
  for (let ii = 0; ii < levels.length; ii += 1) {
    const level = levels[ii + index % levels.length];
    const at = attempts[level.id];
    if (!at || !at.success) {
      return level;
    }
  }
  if (index + 1 < levels.length) {
    return levels[index];
  }
  return null;
}

function LearnLevels({ account }: Props) {
  const params = useParams<"category" | "stage" | "id">();
  const navigate = useNavigate();

  const { problemAttemptsOfIdsState } = problemStateForAccountId(account.id);

  const cat = categories.find((c) => c.key === params.category);
  const stage = cat?.stages.find((s) => s.key === params.stage);
  const id = params.id ? params.id : "";
  const levels = stage?.levels || [];
  const level = levels.find((l) => l.id === id);

  const levelIds = levels.map(l => l.id);
  const lessonsAttempts = useRecoilValue(problemAttemptsOfIdsState(levelIds));

  const nextLevel = useCallback(() => {
    const levels = stage?.levels || [];
    const next = getNextLevel(levels, id, lessonsAttempts);
    next
      ? navigate(next.path)
      : navigate(cat ? `/learn/` + cat.key : "/learn");
  }, [cat, stage, id, navigate, lessonsAttempts]);

  useEffect(() => {
    if (!id && stage) {
      const next = getNextLevel(stage.levels, id, lessonsAttempts);
      navigate(next ? next.path : stage.levels[0].path);
    } else if (!level) {
      navigate(cat ? `/learn/` + cat.key : "/learn");
    }
  }, [navigate, level, id, cat, stage, lessonsAttempts]);

  if (!level || !cat || !stage) {
    return null;
  }

  return (
    <>
      <Problem accountId={account.id} level={level} nextLevel={nextLevel} />
      <Learn category={cat.key} stage={stage.key} account={account} />
    </>
  );
}

export default withRequireAccount(LearnLevels);
