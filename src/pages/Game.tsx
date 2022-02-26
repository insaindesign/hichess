import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import Game from "../components/Game";
import Loading from "../components/Loading";
import { withRequireAccount } from "../components/RequireAccount";
import { gameStateForAccountId } from "../state/games";

import type { Account } from "../state/accounts";
import type { Game as GameType } from "../state/games";

type Props = {
  account: Account;
};

function GamePage({ account }: Props) {
  const params = useParams<"fen" | "color">();
  const fen = params.fen ? params.fen.replace(/_/g, "/") : undefined;
  const color = params.color as GameType["color"];

  const { currentGameState, isLoadedState } =
    gameStateForAccountId(account.id);
  const [currentGame, setCurrentGame] = useRecoilState(currentGameState);
  const isLoaded = useRecoilValue(isLoadedState);

  useEffect(() => {
    if (fen && isLoaded && currentGame?.position !== fen) {
      setCurrentGame({
        position: fen,
        date: Date.now(),
        pgn: '',
        color,
      });
    } else if (isLoaded && !currentGame) {
      setCurrentGame({
        date: Date.now(),
        pgn: '',
        color: "white",
      });
    }
  }, [currentGame, isLoaded, setCurrentGame, fen, color]);

  if (!currentGame) {
    return <Loading />;
  }

  return <Game currentGame={currentGame} account={account} />;
}

export default withRequireAccount(GamePage);
