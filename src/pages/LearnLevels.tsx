import { useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import categories from "../data/learn";
import Learn from "../components/Learn";
import Problem from "../components/Problem";
import { appLoadedState } from "../state/app";
import { accountIdState } from "../state/accounts";

type Props = {};

interface Params {
  category: string;
  stage: string;
  index?: string;
}

function LearnLevels(props: Props) {
  const params = useParams() as unknown as Params;
  const navigate = useNavigate();
  const appLoaded = useRecoilValue(appLoadedState);
  const accountId = useRecoilValue(accountIdState);

  const cat = categories.find((c) => c.key === params.category);
  const stage = cat?.stages.find((s) => s.key === params.stage);
  const index = params.index ? parseInt(params.index, 10) : 0;
  const level = stage ? stage.levels[index] : null;

  const nextLevel = useCallback(() => {
    const next = index + 1;
    next < (stage?.levels || []).length
      ? navigate(`/learn/${params.category}/${params.stage}/${next}/`)
      : navigate(`/learn`);
  }, [params, stage, index, navigate]);

  useEffect(() => {
    if (!level) {
      navigate("/learn");
    }
  }, [navigate, level]);

  useEffect(() => {
    if (appLoaded && !accountId) {
      navigate("/");
    }
  }, [navigate, appLoaded, accountId]);

  if (!level || !cat || !stage || !accountId) {
    return null;
  }

  return (
    <>
      <Problem
        accountId={accountId}
        level={level}
        nextLevel={nextLevel}
        done={index + 1 === stage.levels.length}
      />
      <Learn category={cat.key} stage={stage.key} />
    </>
  );
}

export default LearnLevels;
