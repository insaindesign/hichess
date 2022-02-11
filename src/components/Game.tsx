import { useCallback, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { loadScript } from "../lib/scripts";
import { isBestMove, parseUci } from "../lib/uci";
import ChessCtrl from "../lib/chess";
import Board from "./Board";
import Toolbar from "./Toolbar";

import type { Move, ShortMove, Square } from "chess.js";
import type { Config } from "chessground/config";
import type { Color, Key, Piece } from "chessground/types";
import type { UserColor } from "./Board";
import type { ShapeOptionType } from "./Board/brushes";

import css from "./Game.module.css";

type Props = {
  fen?: string;
};
type StockfishWorker = any;

const enforceOrientation = (
  color: UserColor | undefined,
  fallback: Color
): Color => (color === "white" || color === "black" ? color : fallback);

function Game({ fen }: Props) {
  const [chess] = useState(() => new ChessCtrl(fen));
  const [showDefenders, setShowDefenders] = useState<ShapeOptionType>("none");
  const [showThreats, setShowThreats] = useState<ShapeOptionType>("none");
  const [config] = useState<Config>({ movable: { color: "white" } });
  const [moves, setMoves] = useState<Move[]>([]);
  const [stockfish, setStockfish] = useState<
    StockfishWorker | null | undefined
  >(undefined);
  const [stockfishLevel, setStockfishLevel] = useState(0);

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
  const toggleStockfishLevel = useCallback(
    (e, value) =>
      value != null
        ? setStockfishLevel(value)
        : setStockfishLevel(stockfishLevel),
    [stockfishLevel]
  );

  useEffect(() => chess.on("change", setMoves), [chess]);

  const undo = useCallback(() => {
    if (moves.length && chess.color === userColor) {
      chess.undo();
      chess.undo();
    }
  }, [chess, moves, userColor]);

  useEffect(() => {
    let timeout: any;
    if (stockfish && !chess.js.game_over()) {
      stockfish.postMessage("stop");
      stockfish.postMessage(
        "position fen " +
          chess.fen +
          " moves " +
          moves.map((m) => m.to).join(" ")
      );
      stockfish.postMessage("go multipv 25");
      timeout = setTimeout(() => stockfish.postMessage("stop"), 1500);
    }
    return () => clearTimeout(timeout);
  }, [chess, stockfish, moves]);

  useEffect(() => {
    if (stockfish) {
      stockfish.postMessage(
        "setoption name Skill Level value " + stockfishLevel
      );
    }
  }, [stockfish, stockfishLevel]);

  useEffect(() => {
    if (chess && stockfish) {
      stockfish.addMessageListener((line: string) => {
        const parsed = parseUci(line);
        if (isBestMove(parsed) && chess.color !== userColor) {
          onMove(parsed.from, parsed.to, parsed.promotion);
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
        sf.postMessage("setoption name MultiPV value 25");
        sf.postMessage("setoption name Skill Level value " + stockfishLevel);
        setStockfish(sf);
      });
  }, [userColor, stockfish, stockfishLevel]);

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
          {userColor !== "both" ? (
            <ToggleButtonGroup
              className={css.panelButtons}
              color="primary"
              exclusive
              fullWidth
              onChange={toggleStockfishLevel}
              value={stockfishLevel}
            >
              <ToggleButton value={0}>1</ToggleButton>
              <ToggleButton value={1}>2</ToggleButton>
              <ToggleButton value={2}>3</ToggleButton>
              <ToggleButton value={3}>4</ToggleButton>
              <ToggleButton value={4}>5</ToggleButton>
              <ToggleButton value={5}>6</ToggleButton>
              <ToggleButton value={6}>7</ToggleButton>
              <ToggleButton value={7}>8</ToggleButton>
              <ToggleButton value={20}>20</ToggleButton>
            </ToggleButtonGroup>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Game;
