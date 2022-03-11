import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Chess from "chess.js";

import Loading from "../components/Loading";
import { withRequireAccount } from "../components/RequireAccount";
import { gameStateForAccountId } from "../state/games";
import { notEmpty } from "../lib/arrays";

import type { Account } from "../state/accounts";

type Props = {
  account: Account;
};

const color = "white";

function GamePage({ account }: Props) {
  const navigate = useNavigate();
  const params = useParams();
  const fens = [
    params.fen,
    params.fen2,
    params.fen3,
    params.fen4,
    params.fen5,
    params.fen6,
    params.fen7,
    params.fen8,
  ].filter(notEmpty);
  const fen = fens.join("/");
  const position =
    fens.length === 8 && new Chess().validate_fen(fen).valid ? fen : undefined;

  const {
    currentGameState,
    potentialGameState,
    currentGameIdState,
    gameLoadedState,
  } = gameStateForAccountId(account.id);
  const [currentGame, setCurrentGame] = useRecoilState(currentGameState);
  const potentialGame = useRecoilValue(potentialGameState);
  const setCurrentGameId = useSetRecoilState(currentGameIdState);
  const gameLoaded = useRecoilValue(gameLoadedState("currentGame"));

  useEffect(() => {
    if (position) {
      setCurrentGame({ position, date: Date.now(), pgn: "", color });
    }
  }, [position, setCurrentGame]);

  useEffect(() => {
    if (gameLoaded && !currentGame && !position) {
      if (potentialGame) {
        setCurrentGameId(potentialGame.date);
      } else {
        setCurrentGame({ date: Date.now(), pgn: "", color });
      }
    }
  }, [
    setCurrentGame,
    setCurrentGameId,
    potentialGame,
    currentGame,
    gameLoaded,
    position,
  ]);

  useEffect(() => {
    if (currentGame) {
      navigate("/play/" + currentGame.date);
    }
  }, [currentGame, navigate]);

  return <Loading />;
}

export default withRequireAccount(GamePage);
