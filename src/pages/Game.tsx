import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import Game from "../components/Game";
import Loading from "../components/Loading";
import { withRequireAccount } from "../components/RequireAccount";
import { gameStateForAccountId } from "../state/games";
import { eloStateForAccountId, elo } from "../state/elo";
import { getLevelForRating } from "../lib/engine/levels";

import type { Account } from "../state/accounts";
import type { Game as GameType } from "../state/games";

type Props = {
  account: Account;
};

function GamePage({ account }: Props) {
  const params = useParams<"fen" | "color">();
  const position = params.fen ? params.fen.replace(/_/g, "/") : undefined;
  const color = params.color as GameType["color"];

  const { eloCalculateState } = eloStateForAccountId(account.id);
  const { currentGameState, isLoadedState } = gameStateForAccountId(account.id);
  const [currentGame, setCurrentGame] = useRecoilState(currentGameState);
  const [rating, setRating] = useRecoilState(eloCalculateState("game"));
  const isLoaded = useRecoilValue(isLoadedState);

  const level = getLevelForRating(rating[0]);

  const newGame = useCallback(() => {
    setCurrentGame({
      date: Date.now(),
      pgn: "",
      color: "white",
    });
  }, [setCurrentGame]);

  useEffect(() => {
    if (position && isLoaded && currentGame?.position !== position) {
      setCurrentGame({
        position,
        date: Date.now(),
        pgn: "",
        color,
      });
    } else if (isLoaded && !currentGame) {
      newGame();
    }
  }, [newGame, setCurrentGame, currentGame, isLoaded, position, color]);

  useEffect(() => {
    if (
      currentGame &&
      currentGame.result &&
      currentGame.color !== "both" &&
      currentGame?.ratingChange === undefined
    ) {
      const result =
        currentGame.result === "draw"
          ? 0.5
          : currentGame.result === currentGame.color
          ? 1
          : 0;
      setCurrentGame({
        ...currentGame,
        ratingChange: elo.change(rating[0], level.rating, result)[0],
      });
      setRating([level.rating, result]);
    }
  }, [setCurrentGame, setRating, currentGame, rating, level]);

  if (!currentGame) {
    return <Loading />;
  }

  return (
    <Game
      currentGame={currentGame}
      account={account}
      engineLevel={level}
      newGame={newGame}
    />
  );
}

export default withRequireAccount(GamePage);
