import { useCallback, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

import Toolbar from "./Toolbar";
import Board, { turnToWords } from "./Board";
import LevelManager from "../data/manager";

import type { Config } from "chessground/config";
import type { Level } from "../data/util";
import type { Move } from "../data/manager";

import css from "./Game.module.css";

type Props = {
  level: Level;
  nextLevel: () => void;
};

function LearnLevel({ level, nextLevel }: Props) {
  const [manageLevel, setManageLevel] = useState(new LevelManager(level));
  const [config, setConfig] = useState<Config>({});
  const [history, setHistory] = useState<Move[]>([]);

  const resetLevel = useCallback(() => {
    manageLevel.reset();
  }, [manageLevel]);

  useEffect(() => {
    setConfig({ movable: { color: manageLevel.color } });
    setHistory([]);
    return manageLevel.chess.js.on("history", () =>
      // gotta fix this, caused by history firing a lot, but not enough
      setTimeout(setHistory, 1, [...manageLevel.moves])
    );
  }, [manageLevel]);

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
              <strong>{turnToWords(manageLevel.chess.js.turn())}</strong> to
              move
            </span>
          )}
        </Alert>
      </Toolbar>
      <div className={css.root}>
        <div className={css.board}>
          <Board
            config={config}
            complete={manageLevel.isComplete}
            chess={manageLevel.chess}
            onMove={manageLevel.onMove}
            orientation={manageLevel.color}
          />
        </div>
        <div className={css.panel}>
          <ButtonGroup
            variant="outlined"
            fullWidth
            className={css.panelButtons}
          >
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
        </div>
      </div>
    </>
  );
}

export default LearnLevel;
