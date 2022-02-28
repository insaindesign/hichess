import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import Game from "../components/Game";
import Loading from "../components/Loading";
import { withRequireAccount } from "../components/RequireAccount";
import { gameStateForAccountId } from "../state/games";
import { eloStateForAccountId } from "../state/elo";
import { getLevelForRating } from "../lib/engine/levels";

import type { Account } from "../state/accounts";
import type { Game as GameType } from "../state/games";

type Props = {
  account: Account;
};

function GamePage({ account }: Props) {
  const params = useParams<"fen" | "color">();
  const fen = params.fen ? params.fen.replace(/_/g, "/") : undefined;
  const color = params.color as GameType["color"];

  const { eloCalculateState } = eloStateForAccountId(account.id);
  const { currentGameState, isLoadedState } = gameStateForAccountId(account.id);
  const [currentGame, setCurrentGame] = useRecoilState(currentGameState);
  const [elo, setElo] = useRecoilState(eloCalculateState("game"));
  const isLoaded = useRecoilValue(isLoadedState);

  const level = getLevelForRating(elo[0]);

  useEffect(() => {
    if (fen && isLoaded && currentGame?.position !== fen) {
      setCurrentGame({
        position: fen,
        date: Date.now(),
        pgn: "",
        color,
      });
    } else if (isLoaded && !currentGame) {
      setCurrentGame({
        date: Date.now(),
        pgn: "",
        color: "white",
      });
    }
  }, [currentGame, isLoaded, setCurrentGame, fen, color]);

  useEffect(() => {
    if (currentGame?.result && color !== "both") {
      const result =
        currentGame.result === "draw"
          ? 0.5
          : currentGame.result === color
          ? 1
          : 0;
      setElo([level.rating, result]);
    }
  }, [currentGame, level, color, setElo]);

  const newGame = useCallback(() => {
    setCurrentGame({
      date: Date.now(),
      pgn: "",
      color: "white",
    })
  }, [setCurrentGame]);

  if (!currentGame) {
    return <Loading />;
  }

  return (
    <Game currentGame={currentGame} account={account} engineLevel={level} newGame={newGame} />
  );
}

export default withRequireAccount(GamePage);
