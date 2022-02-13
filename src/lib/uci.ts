import { ShortMove } from "chess.js";
import ChessCtrl from "./chess";

export type MoveInfo = {
  score: {
    type: string;
    value: number;
  };
  pv: string[];
  moves: ShortMove[];
};

export type BestMove = {
  best: MoveInfo;
  move: ShortMove;
  info: MoveInfo[];
};

export type Evaluation = {
  type: "Classical" | "NNUE" | "Final";
  score: number;
};

export type Evaluations = {
  Classical?: Evaluation;
  Final: Evaluation;
  NNUE?: Evaluation;
};

export type ParsedUci = ShortMove | MoveInfo | Evaluation | string;

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
      data.pv = info.slice(++ii);
      data.moves = data.pv.map(ChessCtrl.toMove);
      break;
    }
  }
  return data as MoveInfo;
};

const parseBestMove = (line: string): ShortMove => {
  const move = line.split(" ");
  return ChessCtrl.toMove(move[1]);
};

export const isMoveInfo = (line: ParsedUci): line is MoveInfo => {
  return typeof line !== "string" && "score" in line;
};

export const isShortMove = (line: ParsedUci): line is ShortMove => {
  return typeof line !== "string" && "from" in line;
};

export const isEvaluation = (line: ParsedUci): line is Evaluation => {
  return typeof line !== "string" && "type" in line;
};

export const isFinalEvaluation = (line: ParsedUci): line is Evaluation => {
  return isEvaluation(line) && line.type === "Final";
};

const parseEvaluation = (line: string): Evaluation => {
  const parts = line.split(/ +/);
  return {
    type: parts[0] as Evaluation["type"],
    score: parseFloat(parts[2]),
  };
};

export const parseUci = (line: string): ParsedUci => {
  if (line.startsWith("bestmove")) {
    return parseBestMove(line);
  }
  if (line.startsWith("info")) {
    return parseMoveInfo(line);
  }
  if (line.match(/^(Final|NNUE|Classical evaluation)/)) {
    return parseEvaluation(line);
  }
  return line;
};
