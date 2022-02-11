import { useParams } from "react-router-dom";

import Game from "./Game";

type Props = {};

function GameFrom(props: Props) {
  const params = useParams<'fen'|'color'>();
  const fen = params.fen ? params.fen.replace(/_/g, "/") : undefined;
  return <Game fen={fen} />;
}

export default GameFrom;
