import ChessCtrl from "../chess";
import { isShortMove, linesToBestMove } from "./uci";
import {levels} from "./levels";

import type { BestMove, ParsedUci, UciOption } from "./uci";
import type EventEmitter from "../emitter";

export type EngineEvents = { line: ParsedUci };
export type UciSettings = {
  sendMoves?: boolean;
};
export interface Engine {
  options: UciOption[];
  settings: UciSettings;
  worker: Worker;
  events: EventEmitter<EngineEvents>;
}

export const collectUntil = (
  events: EventEmitter<EngineEvents>,
  condition: (line: ParsedUci) => boolean
): Promise<ParsedUci[]> => {
  return new Promise((resolve) => {
    const collcation: ParsedUci[] = [];
    const removeListener = events.on("line", (line) => {
      collcation.push(line);
      if (condition(line)) {
        resolve(collcation);
        removeListener();
      }
    });
  });
};

export class EngineCtrl {
  private engine: Promise<Engine>;
  private level: number;

  constructor(engine: Promise<Engine>) {
    this.engine = engine;
    this.level = -1;
  }

  async setLevel(value: number) {
    if (value !== this.level) {
      this.level = value;
      const level = levels[value];
      return this.setOptions([
        ["Skill", level.skill],
        ["Skill Level", level.skill],
        ["MultiPV", level.multipv],
      ]);
    }
    return;
  }

  private setOptions(options: [string, boolean | string | number][]) {
    return this.send(
      options.map(([name, value]) => `setoption name ${name} value ${value}`)
    );
  }

  private async collectUntil(
    messages: string[],
    condition: (line: ParsedUci) => boolean
  ): Promise<ParsedUci[]> {
    const { events } = await this.engine;
    this.send(messages);
    return collectUntil(events, condition);
  }

  async bestMove(chess: ChessCtrl): Promise<BestMove | null> {
    const { settings } = await this.engine;
    await this.send(['stop']);
    await this.collectUntil(["isready"], (line) => line === "readyok");
    let position = `position fen ${chess.fen}`;
    if (settings.sendMoves) {
      const m = chess.moves.map((m) => m.to).join(" ");
      position += " moves " + m;
    }
    const lines = await this.collectUntil([position, "go movetime 1500"], isShortMove);
    return linesToBestMove(lines, chess.color, this.level);
  }

  newGame() {
    this.send(['ucinewgame']);
  }

  send = async (messages: string[]) => {
    const engine = await this.engine;
    messages.forEach((m) => engine.worker.postMessage(m));
  };

  stop = () => {
    return this.send(["stop"]);
  };
}

export default EngineCtrl;
