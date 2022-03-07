import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import Loading from "../components/Loading";
import { withRequireAccount } from "../components/RequireAccount";
import { gameStateForAccountId } from "../state/games";

import type { Account } from "../state/accounts";
import type { Game as GameType } from "../state/games";

type Props = {
  account: Account;
};

function GamePage({ account }: Props) {
  const navigate = useNavigate();
  const params = useParams<"fen" | "color">();
  const fen = params.fen ? params.fen.replace(/_/g, "/") : undefined;
  const color = (params.color as GameType["color"]) || "white";
  const position = fen && fen.includes("/") ? fen : undefined;

  const { currentGameState, gameLoadedState } = gameStateForAccountId(
    account.id
  );
  const [currentGame, setCurrentGame] = useRecoilState(currentGameState);
  const gameLoaded = useRecoilValue(gameLoadedState('currentGame'));

  useEffect(() => {
    if (position) {
      setCurrentGame({
        position,
        date: Date.now(),
        pgn: "",
        color,
      });
    } else if (!currentGame && gameLoaded) {
      setCurrentGame({
        date: Date.now(),
        pgn: "",
        color,
      });
    }
  }, [setCurrentGame, currentGame, gameLoaded, position, color]);

  useEffect(() => {
    if (currentGame) {
      navigate("/play/" + currentGame.date);
    }
  }, [currentGame, navigate]);

  return <Loading />;
}

export default withRequireAccount(GamePage);
