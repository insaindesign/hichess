import { useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import categories from "../data/learn";
import Learn from "./Learn";
import Problem from "./Problem";

type Props = {};

interface Params {
  category: string;
  stage: string;
  index?: string;
}

function LearnLevels(props: Props) {
  const params = useParams() as unknown as Params;
  const navigate = useNavigate();

  const cat = categories.find((c) => c.key === params.category);
  const stage = cat?.stages.find((s) => s.key === params.stage);
  const index = params.index ? parseInt(params.index, 10) : 0;
  const level = stage ? stage.levels[index] : null;

  const nextLevel = useCallback(() => {
    const levels = stage ? stage.levels : [];
    const next = index + 1;
    next < levels.length
      ? navigate(`/learn/${params.category}/${params.stage}/${next}/`)
      : navigate(`/learn`);
  }, [params, stage, index, navigate]);

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
      <Problem level={level} nextLevel={nextLevel} />
      <Learn category={cat.key} stage={stage.key} />
    </>
  );
}

export default LearnLevels;
