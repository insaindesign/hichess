import { useCallback, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import HintIcon from "@mui/icons-material/TipsAndUpdates";
import RestartIcon from "@mui/icons-material/RestartAlt";
import NextIcon from "@mui/icons-material/SkipNext";
import DoneIcon from "@mui/icons-material/Done";
import { useTranslation } from "react-i18next";
import { useRecoilCallback, useRecoilState } from "recoil";

import LevelManager from "../data/manager";
import ButtonGroup from "./ButtonGroup";
import Toolbar from "./Toolbar";
import Board from "./Board";
import ShowDefenders from "./ShowDefenders";
import ShowAttackers from "./ShowAttackers";
import MoveBar from "./MoveBar";

import type { Level } from "../data/util";
import type { ShapeOptionType } from "./Board/brushes";

import css from "./Game.module.css";
import { problemStateForAccountId } from "../state/problems";
import { eloStateForAccountId } from "../state/elo";

type Props = {
  done?: boolean;
  level: Level;
  nextLevel: () => void;
  accountId: string;
};

function Problem({ level, nextLevel, done, accountId }: Props) {
  const { t } = useTranslation();
  const { currentProblemState } = problemStateForAccountId(accountId);
  const { eloCalculateState } = eloStateForAccountId(accountId);
  const [manageLevel, setManageLevel] = useState(() => new LevelManager(level));
  const [history, setHistory] = useState(manageLevel.moves);
  const [showThreats, setShowThreats] = useState<ShapeOptionType>("none");
  const [showDefenders, setShowDefenders] = useState<ShapeOptionType>("none");
  const [currentProblem, setCurrentProblem] =
    useRecoilState(currentProblemState);

  const isComplete = manageLevel.isComplete;

  const setElo = useRecoilCallback(
    ({ set }) =>
      (key: string, rating: number, result) => {
        // @ts-ignore
        set(eloCalculateState(key), [rating, result]);
      },
    []
  );

  const toggleShowThreats = useCallback(
    (e, value) => (value ? setShowThreats(value) : setShowThreats("none")),
    []
  );
  const toggleShowDefenders = useCallback(
    (e, value) => (value ? setShowDefenders(value) : setShowDefenders("none")),
    []
  );

  const resetLevel = useCallback(() => {
    manageLevel.reset();
  }, [manageLevel]);

  const hint = useCallback(() => {
    let timeout: any;
    const nextMove = manageLevel.nextMove();
    if (nextMove && manageLevel.isUsersTurn) {
      manageLevel.chess.move(nextMove);
      timeout = setTimeout(() => manageLevel.chess.undo(), 1000);
    }
    return () => clearTimeout(timeout);
  }, [manageLevel]);

  useEffect(() => manageLevel.chess.on("change", setHistory), [manageLevel]);

  useEffect(() => {
    if (manageLevel.level !== level) {
      setManageLevel(new LevelManager(level));
    }
  }, [level, manageLevel]);

  useEffect(() => {
    const moves = manageLevel.userMoves.map((m) => m.san);
    if (!moves.length) {
      return;
    }
    if (
      moves.length === 1 &&
      (!currentProblem || currentProblem.id !== manageLevel.level.id)
    ) {
      setCurrentProblem({
        id: manageLevel.level.id,
        date: Date.now(),
        rating: manageLevel.rating,
        type: manageLevel.type,
        path: manageLevel.level.path,
        moves,
        result: !manageLevel.isComplete
          ? "incomplete"
          : manageLevel.isSuccessful
          ? "success"
          : "failure",
      });
    } else if (
      currentProblem &&
      moves.join(" ") !== currentProblem.moves.join(" ")
    ) {
      setCurrentProblem({
        ...currentProblem,
        rating: manageLevel.rating,
        moves,
        result: !manageLevel.isComplete
          ? "incomplete"
          : manageLevel.isSuccessful
          ? "success"
          : "failure",
      });
    }
  }, [currentProblem, manageLevel, history, setCurrentProblem]);

  useEffect(() => {
    if (manageLevel.isComplete) {
      manageLevel.themes.forEach((theme) => {
        setElo(theme, manageLevel.rating, manageLevel.isSuccessful ? 1 : 0);
      });
    }
  }, [manageLevel, isComplete, setElo]);

  return (
    <>
      <Toolbar>
        {isComplete ? (
          <Alert
            severity={manageLevel.isSuccessful ? "success" : "error"}
            variant="filled"
          >
            {manageLevel.isSuccessful
              ? t("problem.success")
              : t("problem.fail")}
          </Alert>
        ) : (
          <MoveBar color={manageLevel.chess.color} />
        )}
      </Toolbar>
      <div className={css.root}>
        <div
          className={`${css.board}${level.apples ? " apples" : ""}${
            level.walls ? " walls" : ""
          }`}
        >
          <Board
            config={manageLevel.config}
            complete={false}
            chess={manageLevel.chess}
            onMove={manageLevel.onMove}
            orientation={manageLevel.color}
            shapes={manageLevel.shapes}
            showDefenders={showDefenders}
            showThreats={showThreats}
          />
        </div>
        <div className={css.panel}>
          <ButtonGroup
            variant="outlined"
            fullWidth
            className={css.panelButtons}
          >
            {manageLevel.hasHints ? (
              <Button disabled={!manageLevel.isUsersTurn} onClick={hint}>
                <HintIcon titleAccess={t("hint")} />
              </Button>
            ) : null}
            <Button
              onClick={resetLevel}
              disabled={!manageLevel.isComplete}
              variant={manageLevel.isFailure ? "contained" : "outlined"}
            >
              <RestartIcon titleAccess={t("tryAgain")} />
            </Button>
            <Button
              onClick={nextLevel}
              variant={manageLevel.isSuccessful ? "contained" : "outlined"}
            >
              {done ? (
                <DoneIcon titleAccess={t("done")} />
              ) : (
                <NextIcon titleAccess={t("next")} />
              )}
            </Button>
          </ButtonGroup>
          <ShowDefenders
            className={css.panelButtons}
            value={showDefenders}
            onChange={toggleShowDefenders}
          />
          <ShowAttackers
            className={css.panelButtons}
            value={showThreats}
            onChange={toggleShowThreats}
          />
        </div>
      </div>
    </>
  );
}

export default Problem;
