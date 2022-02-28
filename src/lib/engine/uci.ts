import ChessCtrl from "../chess";
import { levels } from "./levels";

import type { ShortMove } from "chess.js";
import type { Color } from "chessground/types";

export type MoveInfoScore = {
  type: "cp" | "mate";
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

export type EvaluationTypes = "Classical" | "NNUE" | "Final" | "cp" | "mate";
export type Evaluation<T> = {
  type: T;
  score: number;
};

export type Evaluations = {
  Classical?: Evaluation<"Classical">;
  Final: Evaluation<"Final">;
  NNUE?: Evaluation<"NNUE">;
};

type UciOptionType = "string" | "combo" | "button" | "spin";
export interface UciOption {
  name: string;
  defaultValue?: string;
  type: UciOptionType;
  min?: string;
  max?: string;
  var?: string[];
}

export type ParsedUci =
  | ShortMove
  | MoveInfo
  | Evaluation<EvaluationTypes>
  | UciOption
  | string;

const optionKeywords = [
  "name",
  "type",
  "default",
  "min",
  "max",
  "var",
] as const;
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

export const isKeyword = <K extends string, T extends Readonly<K[]>>(
  keyword: string,
  keywords: T
): keyword is T[number] => {
  return keywords.includes(keyword as T[number]);
};

const collect = <K extends string, T extends Readonly<K[]>>(
  line: string,
  keywords: T
) => {
  const info = line.split(" ");
  const out = {} as Record<T[number], string[]>;
  for (let ii = 1, key = null; ii < info.length; ii++) {
    const val = info[ii];
    if (isKeyword(val, keywords)) {
      key = val;
      if (!out[key]) {
        out[key] = [];
      }
    } else if (key) {
      out[key].push(val);
    }
  }
  return out;
};

export const parseOption = (line: string): UciOption => {
  const collected = collect(line, optionKeywords);
  return {
    name: collected.name.join(" "),
    type: collected.type
      ? (collected.type.join(" ") as UciOptionType)
      : "string",
    defaultValue: collected.default ? collected.default.join(" ") : undefined,
    min: collected.min ? collected.min.join(" ") : undefined,
    max: collected.max ? collected.max.join(" ") : undefined,
    var: collected.var,
  };
};

const parseMoveInfo = (line: string): MoveInfo | string => {
  try {
    const collected = collect(line, infoKeywords);
    return {
      depth: collected.depth[0],
      score: {
        type: collected.score[0],
        value: parseInt(collected.score[1], 10),
      },
      pv: collected.pv,
      moves: collected.pv.map(ChessCtrl.toMove),
    } as MoveInfo;
  } catch (err) {
    return line;
  }
};

const compareScore = (a: MoveInfoScore, b: MoveInfoScore): boolean => {
  const valA = a.type === "mate" ? 10000 * a.value : a.value;
  const valB = b.type === "mate" ? 10000 * b.value : b.value;
  return valA > valB;
};

export const linesToBestMove = (
  lines: ParsedUci[],
  color: Color,
  levelIndex: number
): BestMove => {
  const info: MoveInfo[] = lines.filter(isMoveInfo);
  const to = info.reduce<BestMove["to"]>((acc, i) => {
    const move = i.pv[0];
    if (!acc.hasOwnProperty(move)) {
      acc[move] = i.score;
    }
    return acc;
  }, {});

  const level = levels[levelIndex];
  const levelPv = Math.min(level.multipv, info.length);
  const randomMove = info[Math.floor(Math.random() * levelPv)];
  const engineMove = lines.find(isShortMove) as BestMove["move"];
  const engineMoveRating = to[ChessCtrl.fromMove(engineMove)];
  const useRandom =
    randomMove &&
    Math.random() <= (level.randomness || -1) &&
    compareScore(engineMoveRating, randomMove.score);

  return {
    color,
    move: useRandom ? randomMove.moves[0] : engineMove,
    moveRating: useRandom ? randomMove.score : engineMoveRating,
    best: info[0]?.moves,
    bestRating: info[0]?.score,
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

export const isOption = (line: ParsedUci): line is UciOption => {
  return typeof line !== "string" && "type" in line;
};

export const isEvaluation = (
  line: ParsedUci
): line is Evaluation<EvaluationTypes> => {
  return typeof line !== "string" && "type" in line;
};

export const isFinalEvaluation = (
  line: ParsedUci
): line is Evaluation<"Final"> => {
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
  if (line.startsWith("info") && line.includes("depth")) {
    return parseMoveInfo(line);
  }
  if (line.startsWith("option")) {
    return parseOption(line);
  }
  if (line.match(/^(Final|NNUE|Classical evaluation)/)) {
    return parseEvaluation(line);
  }
  return line;
};
