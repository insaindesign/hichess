import { ShortMove } from "chess.js";
import ChessCtrl from "./chess";

interface MoveInfo {
  score: {
    type: string;
    value: number;
  };
  pv: string[];
  moves: ShortMove[];
}

const parseMoveInfo = (line: string): MoveInfo => {
  const info = line.split(" ");
  const data: Partial<MoveInfo> = {};
  for (let ii = 1; ii < info.length; ii += 1) {
    const key = info[ii];
    if (key === "score") {
      data.score = {
        type: info[++ii],
        value: parseFloat(info[++ii]),
      };
    } else if (key === "pv") {
      data.pv = info.slice(ii + 1);
      data.moves = data.pv.map(ChessCtrl.toMove);
      break;
    }
  }
  return data as MoveInfo;
};

export const isMoveInfo = (
  line: ShortMove | MoveInfo | string
): line is MoveInfo => {
  return typeof line !== "string" && "score" in line;
};

const parseBestMove = (line: string): ShortMove => {
  const move = line.split(" ");
  return ChessCtrl.toMove(move[1]);
};

export const isBestMove = (
  line: ShortMove | MoveInfo | string
): line is ShortMove => {
  return typeof line !== "string" && "from" in line;
};

export const parseUci = (line: string): ShortMove | MoveInfo | string => {
  if (line.startsWith("bestmove")) {
    return parseBestMove(line);
  }
  if (line.startsWith("info")) {
    return parseMoveInfo(line);
  }
  return line;
};
