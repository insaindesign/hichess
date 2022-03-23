import ChessCtrl from "../chess";
import { toDecimal } from "../numbers";
import { levels } from "./levels";

import type { ShortMove } from "chess.js";
import type { Color } from "chessground/types";

export type MoveInfoScore = {
  type: "cp" | "mate";
  value: number;
  normalised: number;
  sentence: string;
};
export type MoveInfo = {
  depth: string;
  score: MoveInfoScore;
  pv: string[];
  moves: ShortMove[];
};

export type BestMove = {
  color: Color;
  fen: string;
  best: ShortMove[];
  bestRating: MoveInfoScore;
  move: ShortMove;
  moveRating: MoveInfoScore;
  to: Record<string, MoveInfoScore>;
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

export const normaliseScore = (score: Pick<MoveInfoScore, 'value'|'type'>): MoveInfoScore => {
  let normalised = score.value;
  let sentence = `${normalised > 0 ? '+' : ''}${toDecimal(normalised / 100, 2)}`;
  if (score.type === 'mate') {
    sentence = (normalised < 0 ? '-M' : 'M') + Math.abs(normalised);
    normalised = 20000 / normalised;
  }
  return {
    ...score,
    normalised,
    sentence
  }
}

const parseMoveInfo = (line: string): MoveInfo | string => {
  try {
    const collected = collect(line, infoKeywords);
    return {
      depth: collected.depth[0],
      score: normaliseScore({
        type: collected.score[0] as MoveInfoScore['type'],
        value: parseInt(collected.score[1], 10),
      }),
      pv: collected.pv,
      moves: collected.pv.map(ChessCtrl.toMove),
    } as MoveInfo;
  } catch (err) {
    return line;
  }
};

export const linesToBestMove = (
  color: Color,
  fen: string,
  lines: ParsedUci[],
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
    randomMove && // has a random move
    Math.random() <= (level.randomness || -1) && // should use the randomness
    engineMoveRating.normalised > randomMove.score.normalised; // play the worse move

  return {
    color,
    fen,
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
  return line;
};
