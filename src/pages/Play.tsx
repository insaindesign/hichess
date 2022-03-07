import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import Game from "../components/Game";
import Loading from "../components/Loading";
import { withRequireAccount } from "../components/RequireAccount";
import { gameStateForAccountId } from "../state/games";
import { eloStateForAccountId, elo } from "../state/elo";
import { getLevelForRating } from "../lib/engine/levels";

import type { Account } from "../state/accounts";

type Props = {
  account: Account;
};

function PlayPage({ account }: Props) {
  const params = useParams<"id">();
  const navigate = useNavigate();

  const { eloCalculateState } = eloStateForAccountId(account.id);
  const { currentGameState, currentGameIdState, gameLoadedState } =
    gameStateForAccountId(account.id);
  const [currentGame, setCurrentGame] = useRecoilState(currentGameState);
  const [currentGameId, setCurrentGameId] = useRecoilState(currentGameIdState);
  const [ratingPair, setRating] = useRecoilState(eloCalculateState("game"));
  const isLoaded = useRecoilValue(gameLoadedState("currentGame"));

  const rating = ratingPair[0];
  const level = getLevelForRating(rating);
  const id = params.id ? parseInt(params.id, 10) : undefined;

  const newGame = useCallback(() => {
    const date = Date.now();
    setCurrentGame({ date, pgn: "", color: "white" });
    navigate("/play/" + date);
  }, [setCurrentGame, navigate]);

  useEffect(() => {
    if (id && id !== currentGameId && isLoaded) {
      setCurrentGameId(id);
    }
  }, [id, setCurrentGameId, currentGameId, isLoaded]);

  useEffect(() => {
    const res = currentGame?.result;
    if (
      res &&
      currentGame.color !== "both" &&
      currentGame?.ratingChange === undefined
    ) {
      const r = res === "draw" ? 0.5 : res === currentGame.color ? 1 : 0;
      setCurrentGame({
        ...currentGame,
        ratingChange: elo.change(rating, level.rating, r)[0],
      });
      setRating([level.rating, r]);
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

export default withRequireAccount(PlayPage);
