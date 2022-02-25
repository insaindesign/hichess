import type { BestMove } from "../lib/uci";

import css from "./EvaluationBar.module.css";

type Props = {
  bestMove: BestMove | null;
};

const max = 2000;
const min = -max;
const range = max - min;

function EvaluationBar({ bestMove }: Props) {
  const evaluation = bestMove?.bestRating;
  const color = bestMove?.color === "black" ? -1 : 1;
  const val = (evaluation?.value || 0) * color;
  const value = Math.max(
    Math.min(evaluation?.type === "mate" ? max * val : val, max),
    min
  );
  const percent = Math.round((Math.abs(value + min) / range) * 100);
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
