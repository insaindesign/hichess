import { useCallback, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";

import ButtonGroup from "./ButtonGroup";
import ToggleButtonGroup from "./ToggleButtonGroup";
import Toolbar from "./Toolbar";
import Board from "./Board";
import LevelManager from "../data/manager";

import type { Level } from "../data/util";
import type { ShapeOptionType } from "./Board/brushes";

import css from "./Game.module.css";

type Props = {
  level: Level;
  nextLevel: () => void;
};

function Problem({ level, nextLevel }: Props) {
  const [manageLevel, setManageLevel] = useState(() => new LevelManager(level));
  const [history, setHistory] = useState(manageLevel.moves);
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
          {manageLevel.isSuccessful ? (
            "Well done!!"
          ) : manageLevel.isFailure ? (
            "Bad luck, try again!"
          ) : (
            <span>
              <strong>{manageLevel.chess.color}</strong> to move
            </span>
          )}
        </Alert>
      </Toolbar>
      <div className={css.root}>
        <div className={`${css.board}${level.apples ? " apples" : ""}`}>
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
                Hint
              </Button>
            ) : null}
            <Button
              onClick={resetLevel}
              disabled={!history.length}
              variant={manageLevel.isFailure ? "contained" : "outlined"}
            >
              Try again
            </Button>
            <Button
              onClick={nextLevel}
              variant={manageLevel.isSuccessful ? "contained" : "outlined"}
            >
              Next
            </Button>
          </ButtonGroup>
          <ToggleButtonGroup
            className={css.panelButtons}
            color="primary"
            exclusive
            fullWidth
            onChange={toggleShowThreats}
            value={showThreats}
          >
            <ToggleButton value="none">Hide threats</ToggleButton>
            <ToggleButton value="counts">counts only</ToggleButton>
            <ToggleButton value="both">show</ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            className={css.panelButtons}
            color="primary"
            exclusive
            fullWidth
            onChange={toggleShowDefenders}
            value={showDefenders}
          >
            <ToggleButton value="none">hide defenders</ToggleButton>
            <ToggleButton value="counts">counts only</ToggleButton>
            <ToggleButton value="both">show</ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
    </>
  );
}

export default Problem;
