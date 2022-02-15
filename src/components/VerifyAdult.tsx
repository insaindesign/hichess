import { useCallback, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

import css from "./VerifyAdult.module.css";

type Props = {
  onChange: (verified: boolean) => void;
};

type Question = {
  type: "math" | "yob";
  title: string;
  verify: (input: string) => boolean;
  validate: (input: string) => boolean;
};

const mathQuestion = (): Question => {
  const operator = Math.round(Math.random()) ? 1 : -1;
  const op = operator > 0 ? "+" : "-";
  const b = Math.round(Math.random() * 10);
  const a = Math.round(Math.random() * 10) + 10;
  return {
    type: "math",
    title: `${a} ${op} ${b} = ?`,
    verify: (input) => parseInt(input, 10) === a + b * operator,
    validate: (input) => input.length > 0,
  };
};

const yobQuestion: Question = {
  type: "yob",
  title: "yearofbirth",
  verify: (input) => parseInt(input, 10) < new Date().getFullYear() - 18,
  validate: (input) => input.length === 4,
};

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

function VerifyAdult({ onChange }: Props) {
  const { t } = useTranslation();
  const [yob, setYob] = useState<string|null>(null);
  const [question, setQuestion] = useState(yobQuestion);
  const [input, setInput] = useState("");
  const [correct, setCorrect] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const handleClose = useCallback(() => onChange(false), [onChange]);

  const handleNext = useCallback(() => {
    if (question.type === 'yob') {
      if (yob && yob !== input) {
        return setCorrect(0);
      } else if (correct && yob && yob === input) {
        return onChange(true);
      } else if (question.verify(input)) {
        setYob(input);
      }
    }
    if (question.verify(input) && (question.type === "yob" || timeRemaining)) {
      setCorrect(correct + 1);
      setQuestion(correct < 2 ? mathQuestion() : yobQuestion);
    } else if (correct > 0) {
      setCorrect(0);
      setQuestion(yobQuestion);
    } else {
      onChange(false);
    }
  }, [input, yob, correct, question, timeRemaining, onChange]);

  const add = useCallback(
    (number: string | number) => () => setInput(`${input}${number}`),
    [input]
  );

  useEffect(() => {
    setInput("");
    if (question.type === "math") {
      setTimeRemaining(5000);
    }
  }, [question]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      return;
    }
    const timeout = setTimeout(setTimeRemaining, 1000, timeRemaining - 1000);
    return () => clearTimeout(timeout);
  }, [timeRemaining]);

  return (
    <Dialog open={true} onClose={handleClose}>
      <DialogTitle className={css.title}>{t(question.title)}</DialogTitle>
      <DialogContent className={css.content}>
        <h1>{input}&nbsp;</h1>
        <div className={css.buttons}>
          {numbers.map((n) => (
            <Button size="large" variant="outlined" key={n} onClick={add(n)}>
              {n}
            </Button>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <div className={css.clearButton}>
          <Button onClick={() => setInput("")}>{t('clear')}</Button>
        </div>
        <Button onClick={handleClose}>{t('cancel')}</Button>
        <Button disabled={!question.validate(input)} onClick={handleNext}>
          {t('next')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default VerifyAdult;
