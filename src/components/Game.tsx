import { useCallback, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { loadScript } from "../lib/scripts";
import Board, { enforceOrientation } from "./Board";

import type { Move, ShortMove, Square } from "chess.js";
import type { Config } from "chessground/config";
import type { Key, Piece } from "chessground/types";
import type { UserColor, ShapeOptionType } from "./Board";

import css from "./Game.module.css";
import Toolbar from "./Toolbar";
import ChessCtrl from "../lib/chess";

type Props = {};
type StockfishWorker = any;

const isStockfishTurn = (turn: UserColor, userColor: UserColor | undefined) =>
  !userColor || (turn !== userColor && userColor !== "both");

function Game(props: Props) {
  const [chess] = useState(() => new ChessCtrl());
  const [showDefenders, setShowDefenders] = useState<ShapeOptionType>("none");
  const [showThreats, setShowThreats] = useState<ShapeOptionType>("none");
  const [config] = useState<Config>({ movable: { color: "white" } });
  const [moves, setMoves] = useState<Move[]>([]);
  const [stockfish, setStockfish] = useState<
    StockfishWorker | null | undefined
  >(undefined);

  const userColor = config.movable?.color;

  const onMove = useCallback(
    (from: Square, to: Square, promotion: ShortMove["promotion"]) => {
      if (chess) {
        chess.move(from, to, promotion);
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

  const newGame = useCallback(() => {
    chess.reset();
  }, [chess]);

  const toggleShowThreats = useCallback(
    (e, value) => (value ? setShowThreats(value) : setShowThreats("none")),
    []
  );
  const toggleShowDefenders = useCallback(
    (e, value) => (value ? setShowDefenders(value) : setShowDefenders("none")),
    []
  );

  useEffect(
    () => chess.on("change", setMoves),
    [chess]
  );

  const undo = useCallback(() => {
    if (moves.length && chess.color === userColor) {
      chess.undo();
      chess.undo();
    }
  }, [chess, moves, userColor]);

  useEffect(() => {
    if (
      stockfish &&
      isStockfishTurn(chess.color, userColor) &&
      !chess.js.game_over()
    ) {
      stockfish.postMessage(
        "position fen " +
          chess.fen +
          " moves " +
          moves.map((m) => m.to).join(" ")
      );
      stockfish.postMessage("go movetime 1000 depth 1 nodes 1 multipv 500");
    }
  }, [chess, stockfish, userColor, moves]);

  useEffect(() => {
    if (chess && stockfish) {
      stockfish.addMessageListener((line: any) => {
        if (line.includes("bestmove") && chess.color !== userColor) {
          const move = line.split(" ")[1];
          onMove(move[0] + move[1], move[2] + move[3], move[4]);
        } else if (!line.includes("info")) {
          // console.log(line);
        }
      });
    }
  }, [chess, stockfish, onMove, userColor]);

  useEffect(() => {
    if (stockfish !== undefined || userColor === "both") {
      return;
    }
    setStockfish(null);
    loadScript("/lib/stockfish/stockfish.js")
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
    <>
      <Toolbar>
        <Alert
          severity={
            chess.js.in_draw()
              ? "warning"
              : chess.js.game_over()
              ? "success"
              : "info"
          }
          variant={chess.js.game_over() ? "filled" : "standard"}
        >
          {chess.js.game_over() ? (
            chess.js.in_draw() ? (
              "Draw"
            ) : (
              ChessCtrl.swapColor(chess.color) + " wins"
            )
          ) : (
            <span>
              <strong>{chess.color}</strong> to move
            </span>
          )}
        </Alert>
      </Toolbar>
      <div className={css.root}>
        <div className={css.board}>
          <Board
            config={config}
            chess={chess}
            complete={chess.js.game_over()}
            onMove={onBoardMove}
            orientation={enforceOrientation(userColor, "white")}
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
              onClick={undo}
              disabled={!moves.length || chess.color !== userColor}
            >
              Undo
            </Button>
            <Button onClick={newGame} disabled={!moves.length}>
              New Game
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

export default Game;
