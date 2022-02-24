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
  id?: string;
}

function LearnLevels({ account }: Props) {
  const params = useParams() as unknown as Params;
  const navigate = useNavigate();

  const cat = categories.find((c) => c.key === params.category);
  const stage = cat?.stages.find((s) => s.key === params.stage);
  const id = params.id ? params.id : "";
  const level = stage && id ? stage.levels.find((l) => l.id === id) : null;

  const nextLevel = useCallback(() => {
    const levels = stage?.levels || [];
    const next = levels.findIndex((l) => l.id === id) + 1;
    levels[next] ? navigate(levels[next].path) : navigate(`/learn`);
  }, [stage, id, navigate]);

  useEffect(() => {
    if (!id && stage) {
      navigate(stage.levels[0].path);
    } else if (!level) {
      navigate("/learn");
    }
  }, [navigate, level, id, stage]);

  if (!level || !cat || !stage) {
    return null;
  }

  return (
    <>
      <Problem
        accountId={account.id}
        level={level}
        nextLevel={nextLevel}
      />
      <Learn category={cat.key} stage={stage.key} />
    </>
  );
}

export default withRequireAccount(LearnLevels);
