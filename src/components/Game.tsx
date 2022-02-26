import { useCallback, useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import UndoIcon from "@mui/icons-material/Undo";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

import ChessCtrl from "../lib/chess";
import StockfishCtrl from "../lib/stockfish";
import { gameStateForAccountId } from "../state/games";
import ButtonGroup from "./ButtonGroup";
import ToggleButtonGroup from "./ToggleButtonGroup";
import Board from "./Board";
import EvaluationBar from "./EvaluationBar";
import Toolbar from "./Toolbar";
import ShowDefenders from "./ShowDefenders";
import ShowAttackers from "./ShowAttackers";
import MoveBar from "./MoveBar";
import Piece from "./Board/Piece";

import css from "./Game.module.css";

import type { Config } from "chessground/config";
import type { Color } from "chessground/types";
import type { UserColor } from "./Board";
import type { ShapeOptionType } from "./Board/brushes";
import type { BestMove } from "../lib/uci";
import type { Account } from "../state/accounts";
import type { Game as GameType } from "../state/games";

type Props = {
  currentGame: GameType;
  account: Account;
};

const enforceOrientation = (
  color: UserColor | undefined,
  fallback: Color
): Color => (color === "white" || color === "black" ? color : fallback);

function Game({ currentGame, account }: Props) {
  const { t } = useTranslation();
  const chess = useMemo(() => new ChessCtrl(), []);
  const stockfish = useMemo(() => new StockfishCtrl(), []);
  const [showDefenders, setShowDefenders] = useState<ShapeOptionType>("none");
  const [showThreats, setShowThreats] = useState<ShapeOptionType>("none");
  const [config, setConfig] = useState<Config>({ movable: { color: currentGame.color } });
  const [pgn, setPgn] = useState<string>("");
  const [stockfishLevel, setStockfishLevel] = useState(0);
  const [bestMove, setBestMove] = useState<BestMove | null>(null);
  const { currentGameState } = gameStateForAccountId(account.id);
  const setCurrentGame = useSetRecoilState(currentGameState);

  const userColor = config.movable?.color;

  const newGame = useCallback(() => {
    setCurrentGame(null);
  }, [setCurrentGame]);

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
  const toggleUserColor = useCallback(
    (e, color: UserColor | null) =>
      color != null ? setConfig({ movable: { color } }) : null,
    [setConfig]
  );

  const undo = useCallback(() => {
    if (currentGame.pgn.length && chess.color === userColor) {
      chess.undo();
      chess.undo();
    }
  }, [chess, currentGame, userColor]);

  useEffect(() => chess.on("change", () => setPgn(chess.js.pgn())), [chess]);

  useEffect(() => {
    if (bestMove && chess.color !== userColor && userColor !== "both") {
      chess.move(bestMove.move);
    }
  }, [bestMove, chess, userColor]);

  useEffect(() => {
    let timeout: any;
    if (!chess.js.game_over()) {
      stockfish.bestMove(chess).then(setBestMove);
      timeout = setTimeout(stockfish.stop, 1500);
    }
    return () => clearTimeout(timeout);
  }, [chess, stockfish, pgn]);

  useEffect(() => {
    // TODO: this shouldn't happen on undo of first move
    if (!pgn && currentGame.pgn) {
      chess.load(currentGame.pgn, currentGame.position);
    } else if (pgn !== currentGame.pgn || chess.fen !== currentGame.position) {
      setCurrentGame({
        ...currentGame,
        position: chess.fen,
        pgn,
        result: chess.result,
      });
    }
  }, [currentGame, setCurrentGame, chess, pgn]);

  useEffect(() => {
    stockfish.setLevel(stockfishLevel);
  }, [stockfish, stockfishLevel]);

  return (
    <>
      <Toolbar>
        {chess.js.game_over() ? (
          <Alert
            severity={chess.js.in_draw() ? "warning" : "success"}
            variant="filled"
          >
            {chess.js.in_draw()
              ? t("result.draw")
              : t("result.win." + ChessCtrl.swapColor(chess.color))}
          </Alert>
        ) : (
          <MoveBar color={chess.color} />
        )}
      </Toolbar>
      <div className={css.root}>
        <div className={css.board}>
          <Board
            config={config}
            chess={chess}
            complete={chess.js.game_over()}
            onMove={chess.move}
            orientation={enforceOrientation(userColor, "white")}
            showDefenders={showDefenders}
            showThreats={showThreats}
          />
        </div>
        <div className={css.panel}>
          <EvaluationBar bestMove={bestMove} />
          <ButtonGroup
            variant="outlined"
            fullWidth
            className={css.panelButtons}
          >
            <Button
              onClick={undo}
              disabled={!currentGame.pgn || chess.color !== userColor}
            >
              <UndoIcon titleAccess={t("undo")} />
            </Button>
            <Button
              onClick={newGame}
              variant={chess.js.game_over() ? "contained" : "outlined"}
            >
              <AddCircleIcon titleAccess={t("newGame")} />
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
          <ToggleButtonGroup
            className={css.panelButtons}
            color="primary"
            exclusive
            fullWidth
            onChange={toggleUserColor}
            value={userColor}
          >
            <ToggleButton value={"white"}>
              <Piece color="white" piece="p" />
            </ToggleButton>
            <ToggleButton value={"both"}>
              <Piece color="white" piece="p" />{" "}
              <Piece color="black" piece="p" />
            </ToggleButton>
            <ToggleButton value={"black"}>
              <Piece color="black" piece="p" />
            </ToggleButton>
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
