import { useEffect, useRef } from "react";
import type { BestMove } from "../lib/engine/uci";

import css from "./EvaluationBar.module.css";

type Props = {
  bestMove: BestMove | null;
};

const max = 2000;
const min = -max;
const range = max - min;

function EvaluationBar({ bestMove }: Props) {
  const evaluation = useRef<number>(0);

  useEffect(() => {
    if (!bestMove?.bestRating) {
      return;
    }
    const { normalised } = bestMove.bestRating;
    const color = bestMove.color === "black" ? -1 : 1;
    evaluation.current = Math.max(Math.min(normalised || 0, max), min) * color;
  }, [evaluation, bestMove]);

  const percent = Math.round(
    (Math.abs(evaluation.current + min) / range) * 100
  );

  return (
    <div className={css.root}>
      <div
        className={css.bar}
        style={{ width: isNaN(percent) ? 50 : percent + "%" }}
      />
    </div>
  );
}

export default EvaluationBar;
