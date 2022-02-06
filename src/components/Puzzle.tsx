import { useCallback, useEffect, useState } from "react";
import Chess from "chess.js";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import Board, {
  ShapeOptionType,
  turnToColor,
  turnToWords,
  turnFlip,
  moveToSan,
} from "./Board";

import type { Move, ShortMove, Square, ChessInstance } from "chess.js";
import type { Config } from "chessground/config";
import type { Color, Key, Piece } from "chessground/types";

import css from "./Game.module.css";
import Toolbar from "./Toolbar";

type Props = {
  fen: string;
  solution: string;
  nextPuzzle: () => void;
};

type PuzzleState = "incomplete" | "incorrect" | "correct";

function Puzzle({ fen, solution, nextPuzzle }: Props) {
  const [userColor, setUserColor] = useState<Color | null>(null);
  const [chess] = useState<ChessInstance>(Chess());
  const [config, setConfig] = useState<Config>({});
  const [moves, setMoves] = useState<Move[]>([]);
  const [state, setState] = useState<PuzzleState>("incomplete");
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

  const onMove = useCallback(
    (from: Square, to: Square, promotion: ShortMove["promotion"]) => {
      if (chess) {
        chess.move({ from, to, promotion });
        setMoves(chess.history({ verbose: true }));
      }
    },
    [chess]
  );

  const onBoardMove = useCallback(
    (from: Key, to: Key, promotion: Piece | undefined) =>
      onMove(
        from as Square,
        to as Square,
        (promotion || "q") as ShortMove["promotion"]
      ),
    [onMove]
  );

  const resetPuzzle = useCallback(() => {
    chess.load(fen);
    const userColor = turnToColor(turnFlip(chess.turn()));
    setState("incomplete");
    setMoves([]);
    setConfig({ movable: { color: userColor } });
    setUserColor(userColor);
  }, [chess, fen]);

  const hint = useCallback(() => {
    const solutionMoves = solution.split(" ");
    const nextMove = solutionMoves[moves.length];
    let timeout: any;
    if (nextMove) {
      chess.move({
        from: (nextMove[0] + nextMove[1]) as Square,
        to: (nextMove[2] + nextMove[3]) as Square,
        promotion: nextMove[4] as ShortMove["promotion"],
      });
      setTimeout(() => {
        chess.undo();
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [chess, solution, moves]);

  useEffect(() => {
    let timeout: any;
    if (userColor && turnToColor(chess.turn()) !== userColor) {
      const solutionMoves = solution.split(" ");
      if (moves.length) {
        const lastMove = moveToSan(moves[moves.length - 1]);
        const correctMove = solutionMoves[moves.length - 1];
        if (lastMove !== correctMove) {
          return setState("incorrect");
        }
      }
      const nextMove = solutionMoves[moves.length];
      if (!nextMove) {
        return setState("correct");
      }
      timeout = setTimeout(() => {
        onMove(
          (nextMove[0] + nextMove[1]) as Square,
          (nextMove[2] + nextMove[3]) as Square,
          nextMove[4] as ShortMove["promotion"]
        );
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [chess, moves, solution, onMove, userColor]);

  useEffect(() => {
    resetPuzzle();
  }, [resetPuzzle]);

  return (
    <>
      <Toolbar>
        <Alert
          severity={
            state === "correct"
              ? "success"
              : state === "incorrect"
              ? "error"
              : "info"
          }
          variant={state === "incomplete" ? "standard" : "filled"}
        >
          {state !== "incomplete" ? (
            state
          ) : (
            <span>
              <strong>{turnToWords(chess.turn())}</strong> to move
            </span>
          )}
        </Alert>
      </Toolbar>
      <div className={css.root}>
        <div className={css.board}>
          <Board
            config={config}
            complete={state !== "incomplete"}
            chess={chess}
            onMove={onBoardMove}
            orientation={userColor || "white"}
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
            <Button
              disabled={turnToColor(chess.turn()) !== userColor}
              onClick={hint}
            >
              Hint
            </Button>
            <Button
              onClick={resetPuzzle}
              disabled={!moves.length}
              variant={state === "incorrect" ? "contained" : "outlined"}
            >
              Try again
            </Button>
            <Button
              onClick={nextPuzzle}
              disabled={!moves.length}
              variant={state === "correct" ? "contained" : "outlined"}
            >
              Next Puzzle
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

export default Puzzle;
