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

  const { eloCalculateState, eloLoadedState } = eloStateForAccountId(account.id);
  const {
    currentGameState,
    currentGameIdState,
    gameLoadedState,
    potentialGameState,
  } = gameStateForAccountId(account.id);
  const [currentGame, setCurrentGame] = useRecoilState(currentGameState);
  const [currentGameId, setCurrentGameId] = useRecoilState(currentGameIdState);
  const potentialGame = useRecoilValue(potentialGameState);
  const [ratingPair, setRating] = useRecoilState(eloCalculateState("game"));

  useRecoilValue(gameLoadedState("currentGame"));
  useRecoilValue(eloLoadedState("game"));

  const rating = ratingPair[0];
  const id = params.id ? parseInt(params.id, 10) : undefined;

  const newGame = useCallback(() => {
    let date = Date.now();
    if (potentialGame) {
      date = potentialGame.date;
      setCurrentGameId(date);
    } else {
      setCurrentGame({
        date,
        pgn: "",
        color: "white",
        opponent: getLevelForRating(rating).rating,
      });
    }
    navigate("/play/" + date);
  }, [setCurrentGame, setCurrentGameId, navigate, potentialGame, rating]);

  useEffect(() => {
    if (id && id !== currentGameId) {
      setCurrentGameId(id);
    }
  }, [id, setCurrentGameId, currentGameId]);

  useEffect(() => {
    if (currentGame && !currentGame.opponent) {
      setCurrentGame({
        ...currentGame,
        opponent: getLevelForRating(rating).rating,
      });
    }
  }, [currentGame, rating, setCurrentGame]);

  useEffect(() => {
    const res = currentGame?.result;
    const opponent = currentGame?.opponent;
    if (
      res &&
      opponent &&
      currentGame.color !== "both" &&
      currentGame?.ratingChange === undefined
    ) {
      const r = res === "draw" ? 0.5 : res === currentGame.color ? 1 : 0;
      setCurrentGame({
        ...currentGame,
        ratingChange: elo.change(rating, opponent, r)[0],
      });
      setRating([opponent, r]);
    }
  }, [setCurrentGame, setRating, currentGame, rating]);

  if (!currentGame) {
    return <Loading />;
  }

  return <Game currentGame={currentGame} account={account} newGame={newGame} />;
}

export default withRequireAccount(PlayPage);
