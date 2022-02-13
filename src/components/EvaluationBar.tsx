import type { Evaluations } from "../lib/uci";

import css from "./EvaluationBar.module.css";

type Props = {
  max: number;
  min: number;
  evaluation: Evaluations | null;
};

function EvaluationBar({ evaluation, min, max }: Props) {
  const range = max - min;
  const value = Math.max(
    Math.min(evaluation ? evaluation.Final.score : 0, max),
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
