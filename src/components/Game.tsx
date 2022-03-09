import { useCallback, useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import UndoIcon from "@mui/icons-material/Undo";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

import ChessCtrl from "../lib/chess";
import engine from "../lib/engine/stockfish";
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
import AccountRating from "./AccountRating";

import css from "./Game.module.css";

import type { Config } from "chessground/config";
import type { Color } from "chessground/types";
import type { UserColor } from "./Board";
import type { ShapeOptionType } from "./Board/brushes";
import type { BestMove } from "../lib/engine/uci";
import type { Account } from "../state/accounts";
import type { Game as GameType } from "../state/games";
import type { EngineLevel } from "../lib/engine/levels";

type Props = {
  currentGame: GameType;
  account: Account;
  engineLevel: EngineLevel;
  newGame: () => void;
};

const enforceOrientation = (
  color: UserColor | undefined,
  fallback: Color
): Color => (color === "white" || color === "black" ? color : fallback);

function Game({ currentGame, account, engineLevel, newGame }: Props) {
  const { t } = useTranslation();
  const chess = useMemo(() => new ChessCtrl(), []);
  const [showDefenders, setShowDefenders] = useState<ShapeOptionType>("none");
  const [showThreats, setShowThreats] = useState<ShapeOptionType>("none");
  const [config, setConfig] = useState<Config>({
    movable: { color: currentGame.color },
  });
  const [bestMove, setBestMove] = useState<BestMove | null>(null);
  const { updateCurrentGameState } = gameStateForAccountId(account.id);
  const updateCurrentGame = useSetRecoilState(updateCurrentGameState);

  const userColor = config.movable?.color;

  const toggleShowThreats = useCallback(
    (e, value) => setShowThreats(value || "none"),
    []
  );
  const toggleShowDefenders = useCallback(
    (e, value) => setShowDefenders(value || "none"),
    []
  );

  const toggleUserColor = useCallback(
    (e, color: UserColor | null) => {
      if (color != null) {
        setConfig({ movable: { color } });
        updateCurrentGame({ color });
      }
    },
    [setConfig, updateCurrentGame]
  );

  const undo = useCallback(() => {
    if (currentGame.pgn.length && chess.color === userColor) {
      chess.undo();
      chess.undo();
    }
  }, [chess, currentGame, userColor]);

  useEffect(
    () =>
      chess.on("change", () =>
        updateCurrentGame({
          position: chess.fen,
          pgn: chess.js.pgn(),
          result: chess.result,
        })
      ),
    [chess, updateCurrentGame]
  );

  useEffect(() => {
    if (bestMove && chess.color !== userColor && userColor !== "both") {
      chess.move(bestMove.move);
    }
  }, [bestMove, chess, userColor]);

  useEffect(() => {
    if (!currentGame.pgn) {
      engine.newGame();
    }
    chess.load(currentGame.pgn, currentGame.position);
    setConfig({ movable: { color: currentGame.color } });
  }, [currentGame, chess, setConfig]);

  useEffect(() => {
    engine.setLevel(engineLevel.id);
  }, [engineLevel]);

  useEffect(() => {
    let timeout: any;
    if (!chess.js.game_over()) {
      engine.bestMove(chess).then(setBestMove);
      timeout = setTimeout(engine.stop, 1500);
    }
    return () => clearTimeout(timeout);
  }, [chess, currentGame, engineLevel]);

  return (
    <>
      <Toolbar
        title={
          chess.js.game_over() ? (
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
          )
        }
      >
        <AccountRating account={account} type="game" />
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
          {!currentGame.pgn ? (
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
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Game;
