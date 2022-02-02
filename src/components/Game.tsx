import { useCallback, useEffect, useState } from "react";
import Chess, { Move, ShortMove, Square } from "chess.js";

import { loadScript } from "../lib/scripts";
import Board from "./Board";

import type { ChessInstance } from "chess.js";
import type { Config } from "chessground/config";
import type { Color, Key, Piece } from "chessground/types";

import css from "./Game.module.css";

type Props = {};
type StockfishWorker = any;
type UserColor = Color | "both";

const isStockfishTurn = (turn: "b" | "w", userColor: UserColor | undefined) =>
  !userColor || (turn !== userColor[0] && userColor !== "both");

function Game(props: Props) {
  // @ts-ignore
  const [chess] = useState<ChessInstance>(Chess());
  const [config] = useState<Config>({ movable: { color: "white" } });
  const [moves, setMoves] = useState<Move[]>([]);
  const [stockfish, setStockfish] = useState<
    StockfishWorker | null | undefined
  >(undefined);

  const userColor = config.movable?.color;

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

  const newGame = useCallback(
    () =>{
      chess.reset();
      setMoves([]);
    },
    [chess]
  );

  useEffect(() => {
    if (
      stockfish &&
      isStockfishTurn(chess.turn(), userColor) &&
      !chess.game_over()
    ) {
      stockfish.postMessage(
        "position fen " +
          chess.fen() +
          " moves " +
          moves.map((m) => m.to).join(" ")
      );
      stockfish.postMessage("go movetime 2000 depth 2");
    }
  }, [chess, stockfish, userColor, moves]);

  useEffect(() => {
    if (chess && stockfish) {
      stockfish.addMessageListener((line: any) => {
        if (line.includes("bestmove") && chess.turn() === "b") {
          const move = line.split(" ")[1];
          onMove(move[0] + move[1], move[2] + move[3], move[4]);
        } else if (!line.includes("info")) {
          console.log(line);
        }
      });
    }
  }, [chess, stockfish, onMove]);

  useEffect(() => {
    if (stockfish !== undefined || userColor === "both") {
      return;
    }
    setStockfish(null);
    loadScript("/lib/stockfish.js")
      .then((w: any) => w.Stockfish())
      .then((sf) => {
        sf.postMessage("uci");
        sf.postMessage("setoption name Use NNUE value false");
        sf.postMessage("setoption name Skill Level value 0");
        sf.postMessage("setoption name UCI_LimitStrength value true");
        setStockfish(sf);
      });
  }, [userColor, stockfish]);

  return (
    <div className={css.root}>
      <div className={css.board}>
        <Board
          config={config}
          chess={chess}
          moves={moves}
          onMove={onBoardMove}
        />
      </div>
      <div className={css.panel}>
        Turn: {chess.game_over() ? 'Game over' : chess.turn()}
        <button onClick={newGame} disabled={!moves.length}>New  Game</button>
        {stockfish === null ? <p>Loading</p> : null}
      </div>
    </div>
  );
}

export default Game;
