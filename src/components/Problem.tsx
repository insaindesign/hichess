import { useCallback, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import HintIcon from "@mui/icons-material/TipsAndUpdates";
import RestartIcon from "@mui/icons-material/RestartAlt";
import NextIcon from "@mui/icons-material/SkipNext";
import DoneIcon from "@mui/icons-material/Done";
import { useTranslation } from "react-i18next";

import ButtonGroup from "./ButtonGroup";
import Toolbar from "./Toolbar";
import Board from "./Board";
import ShowDefenders from "./ShowDefenders";
import ShowAttackers from "./ShowAttackers";
import LevelManager from "../data/manager";

import type { Level } from "../data/util";
import type { ShapeOptionType } from "./Board/brushes";

import css from "./Game.module.css";

type Props = {
  done?: boolean;
  level: Level;
  nextLevel: () => void;
};

function Problem({ level, nextLevel, done }: Props) {
  const { t } = useTranslation();
  const [manageLevel, setManageLevel] = useState(() => new LevelManager(level));
  const [, setHistory] = useState(manageLevel.moves);
  const [showThreats, setShowThreats] = useState<ShapeOptionType>("none");
  const [showDefenders, setShowDefenders] = useState<ShapeOptionType>("none");

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

  return (
    <>
      <Toolbar>
        <Alert
          severity={
            manageLevel.isSuccessful
              ? "success"
              : manageLevel.isFailure
              ? "error"
              : "info"
          }
          variant={!manageLevel.isComplete ? "standard" : "filled"}
        >
          {manageLevel.isSuccessful
            ? t("problem.success")
            : manageLevel.isFailure
            ? t("problem.fail")
            : t("move." + manageLevel.chess.color)}
        </Alert>
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
              disabled={!manageLevel.userMoves.length}
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
