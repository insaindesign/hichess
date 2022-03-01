import type { BestMove } from "../lib/engine/uci";

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
  const value = Math.max(Math.min(evaluation?.normalised || 0, max), min) * color;
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
