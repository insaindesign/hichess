import { useCallback, useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Cancel from "@mui/icons-material/Clear";
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

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function VerifyAdult({ onChange }: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  const [yob, setYob] = useState<string | null>(null);
  const [question, setQuestion] = useState(yobQuestion);
  const [input, setInput] = useState("");
  const [correct, setCorrect] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const handleClose = useCallback(() => onChange(false), [onChange]);

  const handleNext = useCallback(() => {
    if (question.type === "yob") {
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
      setTimeRemaining(10000);
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
    <Dialog fullScreen={fullScreen} open={true} onClose={handleClose}>
      <DialogTitle className={css.title}>{t(question.title)}</DialogTitle>
      <DialogContent>
        <div className={css.content}>
          <Typography variant="h2">{input}&nbsp;</Typography>
          <div className={css.buttons}>
            {numbers.map((n) => (
              <Button
                className={css.button}
                variant="outlined"
                key={n}
                onClick={add(n)}
              >
                {n}
              </Button>
            ))}
            <Button
              className={css.button}
              variant="outlined"
              onClick={() => setInput("")}
            >
              {t("clear")}
            </Button>
            <Button className={css.button} variant="outlined" onClick={add(0)}>
              0
            </Button>
            <Button
              className={css.button}
              disabled={!question.validate(input)}
              variant={question.validate(input) ? "contained" : "outlined"}
              onClick={handleNext}
            >
              {t("next")}
            </Button>
          </div>
          <IconButton onClick={handleClose} sx={{ marginTop: 1 }}>
            <Cancel titleAccess={t("cancel")} sx={{ fontSize: 48 }} />
          </IconButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VerifyAdult;
