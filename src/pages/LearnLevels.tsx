import { useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import categories from "../data/learn";
import Learn from "../components/Learn";
import Problem from "../components/Problem";

import type { Account } from "../state/accounts";
import { withRequireAccount } from "../components/RequireAccount";

type Props = {
  account: Account;
};

interface Params {
  category: string;
  stage: string;
  index?: string;
}

function LearnLevels({ account }: Props) {
  const params = useParams() as unknown as Params;
  const navigate = useNavigate();

  const cat = categories.find((c) => c.key === params.category);
  const stage = cat?.stages.find((s) => s.key === params.stage);
  const id = params.index ? params.index : '';

  const index = Math.max(
    stage && id ? stage.levels.findIndex(l => l.id === id) : 0,
    0
  );
  const level = stage ? stage.levels[index] : null;

  const nextLevel = useCallback(() => {
    const next = index + 1;
    const levels = stage?.levels || [];
    next < levels.length ? navigate(levels[next].path) : navigate(`/learn`);
  }, [stage, index, navigate]);

  useEffect(() => {
    if (!level) {
      navigate("/learn");
    }
  }, [navigate, level]);

  if (!level || !cat || !stage) {
    return null;
  }

  return (
    <>
      <Problem
        accountId={account.id}
        level={level}
        nextLevel={nextLevel}
        done={index + 1 === stage.levels.length}
      />
      <Learn category={cat.key} stage={stage.key} />
    </>
  );
}

export default withRequireAccount(LearnLevels);
