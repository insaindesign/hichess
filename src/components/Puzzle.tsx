import { useCallback, useEffect, useState } from "react";
import Chess from "chess.js";

import Board from "./Board";

import type { Move, ShortMove, Square, ChessInstance } from "chess.js";
import type { Config } from "chessground/config";
import type { Color, Key, Piece } from "chessground/types";

import css from "./Game.module.css";

type Props = {
  fen: string;
  solution: string;
  nextPuzzle: () => void;
};

type Turn = "b" | "w";
type PuzzleState = "incomplete" | "incorrect" | "correct";

const turn = (turn: Turn) => (turn === "w" ? "White" : "Black");
const turnFlip = (turn: Turn) => (turn === "w" ? "b" : "w");
const turnToColor = (turn: Turn) => (turn === "w" ? "white" : "black");
const moveToPgn = (move: Move) => move.from + move.to + (move.promotion || "");

function Puzzle({ fen, solution, nextPuzzle }: Props) {
  const [userColor, setUserColor] = useState<Color | null>(null);
  const [chess] = useState<ChessInstance>(Chess());
  const [config, setConfig] = useState<Config>({});
  const [moves, setMoves] = useState<Move[]>([]);
  const [state, setState] = useState<PuzzleState>("incomplete");
  const [showThreats, setShowThreats] = useState(false);
  const [showDefenders, setShowDefenders] = useState(false);

  const toggleShowThreats = useCallback(
    () => setShowThreats(!showThreats),
    [showThreats]
  );
  const toggleShowDefenders = useCallback(
    () => setShowDefenders(!showDefenders),
    [showDefenders]
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
    setState("incomplete");
    setMoves([]);
    const userColor = turnToColor(turnFlip(chess.turn()));
    setConfig({
      orientation: userColor,
      movable: { color: userColor },
    });
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
        const lastMove = moveToPgn(moves[moves.length - 1]);
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
    <div className={css.root}>
      <div className={css.board}>
        <Board
          config={config}
          complete={state !== "incomplete"}
          chess={chess}
          onMove={onBoardMove}
          showDefenders={showDefenders}
          showThreats={showThreats}
        />
      </div>
      <div className={css.panel}>
        <ul>
          <li>
            <strong>
              {state !== "incomplete" ? state : turn(chess.turn()) + " to move"}
            </strong>
          </li>
          <li>
            <button
              disabled={turnToColor(chess.turn()) !== userColor}
              onClick={hint}
            >
              Hint
            </button>
          </li>
          <li>
            <button onClick={toggleShowThreats}>
              {showThreats ? "Hide threats" : "Show threats"}
            </button>
          </li>
          <li>
            <button onClick={toggleShowDefenders}>
              {showDefenders ? "Hide defenders" : "Show defenders"}
            </button>
          </li>
          {moves.length && state === "incorrect" ? (
            <li>
              <button onClick={resetPuzzle}>Try again</button>
            </li>
          ) : null}
          {moves.length ? (
            <li>
              <button onClick={nextPuzzle}>Next Puzzle</button>
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}

export default Puzzle;
