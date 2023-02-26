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

// remove all useEffects unless they are state based changes

function PlayPage({ account }: Props) {
  const params = useParams<"id">();
  const navigate = useNavigate();

  const { eloCalculateState, eloLoadedState } = eloStateForAccountId(
    account.id
  );
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

  const createNewGame = useCallback(() => {
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

  const handleResult = useCallback(
    (game) => {
      const res = game.result;
      const opponent = game.opponent;
      if (opponent && game.color !== "both" && !game.ratingChange) {
        const r = res === "draw" ? 0.5 : res === game.color ? 1 : 0;
        setCurrentGame({
          ...game,
          ratingChange: elo.change(rating, opponent, r)[0],
        });
        setRating([opponent, r]);
      }
    },
    [setCurrentGame, setRating, rating]
  );

  if (!currentGame) {
    return <Loading />;
  }

  return (
    <Game
      key={currentGame.date}
      currentGame={currentGame}
      account={account}
      newGame={createNewGame}
      onResult={handleResult}
    />
  );
}

export default withRequireAccount(PlayPage);
