import ChessCtrl from "./chess";

import type { ShortMove } from "chess.js";
import type { Color } from "chessground/types";

export type MoveInfoScore =  {
  type: 'cp' | 'mate';
  value: number;
};
export type MoveInfo = {
  depth: string;
  score: MoveInfoScore;
  pv: string[];
  moves: ShortMove[];
};

export type BestMove = {
  color: Color;
  best: ShortMove[];
  bestRating: MoveInfoScore;
  move: ShortMove;
  moveRating: MoveInfoScore;
  to: Record<string, MoveInfoScore>;
};

export type EvaluationTypes = "Classical" | "NNUE" | "Final" | 'cp' | 'mate';
export type Evaluation<T> = {
  type: T;
  score: number;
};

export type Evaluations = {
  Classical?: Evaluation<"Classical">;
  Final: Evaluation<"Final">;
  NNUE?: Evaluation<"NNUE">;
};

export type ParsedUci = ShortMove | MoveInfo | Evaluation<EvaluationTypes> | string;

const infoKeywords = [
  "depth",
  "seldepth",
  "multipv",
  "hashfull",
  "tbhits",
  "score",
  "nodes",
  "nps",
  "time",
  "pv",
  "bmc",
] as const;
type Keyword = typeof infoKeywords[number];

export const isKeyword = (keyword: string): keyword is Keyword => {
  return infoKeywords.includes(keyword as Keyword);
};

const parseMoveInfo = (line: string): MoveInfo | string => {
  try {
    const info = line.split(" ");
    const collect = {} as Record<typeof infoKeywords[number], string[]>;
    for (let ii = 1, key = null; ii < info.length; ii++) {
      const val = info[ii];
      if (isKeyword(val)) {
        key = val;
        collect[key] = [];
      } else if (key) {
        collect[key].push(val);
      }
    }
    return {
      depth: collect.depth[0],
      score: {
        type: collect.score[0],
        value: parseInt(collect.score[1], 10),
      },
      pv: collect.pv,
      moves: collect.pv.map(ChessCtrl.toMove),
    } as MoveInfo;
  } catch (err) {
    return line;
  }
};

export const linesToBestMove = (lines: ParsedUci[], color: Color): BestMove => {
  const info = lines.filter(isMoveInfo);
  const to = info.reduce<BestMove['to']>((acc, i) => {
    const move = i.pv[0];
    if (i.moves.length === 1) {
      acc[move] = i.score;
    }
    return acc;
  }, {});
  const move = lines.find(isShortMove) as BestMove["move"];
  const moveRating = to[ChessCtrl.fromMove(move)];
  const best = info[0];
  return {
    color,
    move,
    moveRating,
    best: best.moves,
    bestRating: best.score,
    to,
  };
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

export const isEvaluation = (line: ParsedUci): line is Evaluation<EvaluationTypes> => {
  return typeof line !== "string" && "type" in line;
};

export const isFinalEvaluation = (line: ParsedUci): line is Evaluation<"Final"> => {
  return isEvaluation(line) && line.type === "Final";
};

const parseEvaluation = (line: string): Evaluation<EvaluationTypes> => {
  const parts = line.split(/ +/);
  return {
    type: parts[0] as Evaluation<EvaluationTypes>["type"],
    score: parseFloat(parts[2]),
  };
};

export const parseUci = (line: string): ParsedUci => {
  if (line.startsWith("bestmove")) {
    return parseBestMove(line);
  }
  if (line.startsWith("info") && line.includes('depth')) {
    return parseMoveInfo(line);
  }
  if (line.match(/^(Final|NNUE|Classical evaluation)/)) {
    return parseEvaluation(line);
  }
  return line;
};
