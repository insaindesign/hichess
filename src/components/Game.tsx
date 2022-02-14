import { useCallback, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import { useTranslation } from "react-i18next";

import ChessCtrl from "../lib/chess";
import StockfishCtrl from "../lib/stockfish";
import ButtonGroup from "./ButtonGroup";
import ToggleButtonGroup from "./ToggleButtonGroup";
import Board from "./Board";
import EvaluationBar from "./EvaluationBar";
import Toolbar from "./Toolbar";

import type { Move, ShortMove } from "chess.js";
import type { Config } from "chessground/config";
import type { Color } from "chessground/types";
import type { UserColor } from "./Board";
import type { ShapeOptionType } from "./Board/brushes";
import type { BestMove, Evaluations } from "../lib/uci";

import css from "./Game.module.css";

type Props = {
  fen?: string;
};

const enforceOrientation = (
  color: UserColor | undefined,
  fallback: Color
): Color => (color === "white" || color === "black" ? color : fallback);

function Game({ fen }: Props) {
  const { t } = useTranslation();
  const [chess] = useState(() => new ChessCtrl(fen));
  const [showDefenders, setShowDefenders] = useState<ShapeOptionType>("none");
  const [showThreats, setShowThreats] = useState<ShapeOptionType>("none");
  const [config] = useState<Config>({ movable: { color: "white" } });
  const [moves, setMoves] = useState<Move[]>([]);
  const [stockfish] = useState(() => new StockfishCtrl());
  const [stockfishLevel, setStockfishLevel] = useState(0);
  const [bestMove, setBestMove] = useState<BestMove | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluations | null>(null);

  const userColor = config.movable?.color;

  const onMove = useCallback(
    (move: ShortMove) => {
      if (chess) {
        chess.move(move);
      }
    },
    [chess]
  );

  const newGame = useCallback(() => chess.reset(), [chess]);

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
    if (bestMove && chess.color !== userColor && userColor !== "both") {
      onMove(bestMove.move);
    }
  }, [bestMove, onMove, userColor, chess]);

  useEffect(() => {
    let timeout: any;
    if (
      !chess.js.game_over() &&
      ChessCtrl.swapColor(chess.color) === userColor
    ) {
      stockfish.bestMove(chess).then(setBestMove);
      timeout = setTimeout(stockfish.stop, 1500);
    }
    return () => clearTimeout(timeout);
  }, [chess, stockfish, moves, userColor]);

  useEffect(() => {
    if (!chess.js.game_over()) {
      stockfish.evaluate(chess).then(setEvaluation);
    }
  }, [chess, stockfish, moves]);

  useEffect(() => {
    stockfish.setLevel(stockfishLevel);
  }, [stockfish, stockfishLevel]);

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
          {chess.js.game_over()
            ? chess.js.in_draw()
              ? t("result.draw")
              : t("result.win." + ChessCtrl.swapColor(chess.color))
            : t("move." + chess.color)}
        </Alert>
      </Toolbar>
      <div className={css.root}>
        <div className={css.board}>
          <Board
            config={config}
            chess={chess}
            complete={chess.js.game_over()}
            onMove={onMove}
            orientation={enforceOrientation(userColor, "white")}
            showDefenders={showDefenders}
            showThreats={showThreats}
          />
        </div>
        <div className={css.panel}>
          <EvaluationBar min={-20} max={20} evaluation={evaluation} />
          <ButtonGroup
            variant="outlined"
            fullWidth
            className={css.panelButtons}
          >
            <Button
              onClick={undo}
              disabled={!moves.length || chess.color !== userColor}
            >
              {t('undo')}
            </Button>
            <Button
              onClick={newGame}
              disabled={!moves.length}
              variant={chess.js.game_over() ? "contained" : "outlined"}
            >
              {t('newGame')}
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
