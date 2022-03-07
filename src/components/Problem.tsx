import { useCallback, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import HintIcon from "@mui/icons-material/TipsAndUpdates";
import RestartIcon from "@mui/icons-material/RestartAlt";
import NextIcon from "@mui/icons-material/SkipNext";
import DoneIcon from "@mui/icons-material/Done";
import { useTranslation } from "react-i18next";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";

import LevelManager from "../data/manager";
import ButtonGroup from "./ButtonGroup";
import Toolbar from "./Toolbar";
import Board from "./Board";
import ShowDefenders from "./ShowDefenders";
import ShowAttackers from "./ShowAttackers";
import MoveBar from "./MoveBar";
import { problemStateForAccountId } from "../state/problems";
import { eloStateForAccountId } from "../state/elo";
import AccountRating from "./AccountRating";

import type { Level } from "../data/util";
import type { ShapeOptionType } from "./Board/brushes";
import type { EloResult, EloValue } from "../lib/elo";
import type { Problem as ProblemStateType } from "../state/problems";
import type { Account } from "../state/accounts";

import css from "./Game.module.css";

type Props = {
  done?: boolean;
  level: Level;
  nextLevel: () => void;
  account: Account;
};

function Problem({ level, nextLevel, done, account }: Props) {
  const { t } = useTranslation();
  const { currentProblemState } = problemStateForAccountId(account.id);
  const { eloState, eloCalculateState } = eloStateForAccountId(account.id);
  const [manageLevel, setManageLevel] = useState(() => new LevelManager(level));
  const [history, setHistory] = useState(manageLevel.moves);
  const [showThreats, setShowThreats] = useState<ShapeOptionType>("none");
  const [showDefenders, setShowDefenders] = useState<ShapeOptionType>("none");
  const [currentProblem, setCurrentProblem] =
    useRecoilState(currentProblemState);
  const elo = useRecoilValue(eloState(manageLevel.type));

  const isComplete = manageLevel.isComplete;

  const setElos = useRecoilCallback(
    ({ set }) =>
      (themes: string[], rating: EloValue, result: EloResult) => {
        themes.forEach((key) =>
          set(eloCalculateState(key), [rating, result] as [EloValue, EloResult])
        );
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

  const resetLevel = useCallback(() => manageLevel.reset(), [manageLevel]);

  const hint = useCallback(() => manageLevel.hint(), [manageLevel]);

  useEffect(() => manageLevel.chess.on("change", setHistory), [manageLevel]);

  useEffect(() => {
    if (manageLevel.level !== level) {
      setManageLevel(new LevelManager(level));
    }
  }, [level, manageLevel]);

  useEffect(() => {
    if (!manageLevel.moves.length) {
      if (currentProblem) {
        setCurrentProblem(null);
      }
      return;
    }
    const update: Pick<ProblemStateType, "ratingChange" | "moves" | "result"> =
      {
        ratingChange: undefined,
        moves: manageLevel.userMoves.map((m) => m.san),
        result: !manageLevel.isComplete
          ? "incomplete"
          : manageLevel.isSuccessful
          ? "success"
          : "failure",
      };
    if (update.result !== "incomplete") {
      update.ratingChange = manageLevel.ratingChange(elo);
    }
    if (update.moves.length === 1 && !currentProblem) {
      setCurrentProblem({
        id: manageLevel.level.id,
        date: Date.now(),
        rating: manageLevel.rating,
        type: manageLevel.type,
        path: manageLevel.level.path,
        ...update,
      });
    } else if (
      currentProblem &&
      update.moves.length &&
      update.moves.join(" ") !== currentProblem.moves.join(" ")
    ) {
      setCurrentProblem({ ...currentProblem, ...update });
    }
  }, [currentProblem, elo, manageLevel, history, setCurrentProblem]);

  useEffect(() => {
    if (isComplete) {
      setElos(
        manageLevel.themes,
        manageLevel.rating,
        manageLevel.isSuccessful ? 1 : 0
      );
    }
  }, [manageLevel, isComplete, setElos]);

  return (
    <>
      <Toolbar
        title={
          isComplete ? (
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
          )
        }
      >
        <AccountRating account={account} type={manageLevel.type} />
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
