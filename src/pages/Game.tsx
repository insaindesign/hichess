import { useParams } from "react-router-dom";

import Game from "../components/Game";
import { withRequireAccount } from "../components/RequireAccount";

import type { Account } from "../state/accounts";

type Props = {
  account: Account;
};

function GamePage({ account }: Props) {
  const params = useParams<"fen" | "color">();
  const fen = params.fen ? params.fen.replace(/_/g, "/") : undefined;
  return <Game account={account} fen={fen} />;
}

export default withRequireAccount(GamePage);
