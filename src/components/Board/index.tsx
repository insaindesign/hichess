import { useEffect, useRef, useState } from "react";
import { Chessground } from "chessground";

import "./base.css";
import "./brown.css";
import "./california.css";

import type { Api } from "chessground/api";
import type { Config } from "chessground/config";
import type { Color, Key, Piece } from "chessground/types";
import type { DrawBrush, DrawShape } from "chessground/draw";
import type { Move } from "chess.js";
import type { ChessCtrl } from "../../lib/chess";

import styles from "./Board.module.css";

export type ShapeOptionType = "none" | "counts" | "both";
export type UserColor = Color | "both";

interface Props {
  chess: ChessCtrl;
  complete: boolean;
  config: Partial<Config>;
  showDefenders?: ShapeOptionType;
  showThreats?: ShapeOptionType;
  orientation: Color;
  onMove: (from: Key, to: Key, promotion: Piece | undefined) => void;
}

type BrushTypes = "threat" | "defender";

export const turnFlip = (turn: Move["color"]) => (turn === "w" ? "b" : "w");
export const moveToSan = (move: Move) => move.from + move.to + (move.promotion || "");
export const turnToColor = (turn: Move["color"]) => (turn === "w" ? "white" : "black");
export const turnToWords = (turn: Move["color"]) => (turn === "w" ? "White" : "Black");

export const enforceOrientation = (
  color: Color | "both" | undefined,
  fallback: Color
): Color => (color === "white" || color === "black" ? color : fallback);

const threatBBrush: DrawBrush = {
  key: "threatB",
  color: "darkred",
  opacity: 0.7,
  lineWidth: 10,
};
const threatWBrush: DrawBrush = {
  ...threatBBrush,
  key: "threatW",
  color: "red",
};
const defenderBBrush: DrawBrush = {
  key: "defenderB",
  color: "darkgreen",
  opacity: 0.7,
  lineWidth: 10,
};
const defenderWBrush: DrawBrush = {
  ...defenderBBrush,
  key: "defenderW",
  color: "green",
};

const circleSvg = (
  color: "b" | "w",
  key: BrushTypes,
  text: string | number
) => {
  const offset = key === "defender" ? 85 : 15;
  return `<circle class="${key}-circle-${color}" cx="${offset}" cy="${offset}" r="10"/><text class="${key}-text" x="${offset}" y="${offset}" dy=".33em" text-anchor="middle">${text}</text>`;
};

function add_shapes(
  list: DrawShape[],
  square_moves: { [square: string]: Move[] },
  key: BrushTypes,
  options: ShapeOptionType
) {
  Object.values(square_moves).forEach((t) => {
    list.push({
      orig: t[0].to,
      customSvg: circleSvg(t[0].color, key, t.length),
    });
    if (options === "both") {
      t.forEach((move) => {
        list.push({
          orig: move.from,
          dest: move.to,
          brush: key + move.color,
        });
      });
    }
  });
}

function Board({
  config,
  onMove,
  chess,
  showThreats,
  showDefenders,
  complete,
  orientation,
}: Props) {
  const [api, setApi] = useState<Api | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(
    () => chess.js.on("history", () => setHistory(chess.js.history())),
    [chess]
  );

  useEffect(() => {
    if (!api && ref.current) {
      setApi(
        Chessground(ref.current, {
          animation: { enabled: true, duration: 200 },
          highlight: { lastMove: true, check: true },
          movable: {
            free: false,
            showDests: true,
          },
          draggable: {
            showGhost: true,
          },
          drawable: {
            brushes: {
              threatb: threatBBrush,
              threatw: threatWBrush,
              defenderb: defenderBBrush,
              defenderw: defenderWBrush,
            },
          },
        })
      );
    }
  }, [ref, api]);

  useEffect(() => {
    if (api) {
      api.set(config);
    }
  }, [api, config]);

  useEffect(() => {
    if (api) {
      api.set({
        events: {
          move: onMove,
        },
      });
    }
  }, [api, onMove]);

  useEffect(() => {
    if (api) {
      api.set({
        fen: chess.js.fen(),
        check: Boolean(chess.js.in_check()),
        turnColor: chess.color,
        movable: {
          dests: chess.dests()
        },
      });
    }
  }, [chess, api, history]);

  useEffect(() => {
    if (api) {
      api.set({
        viewOnly: complete,
      });
    }
  }, [api, complete]);

  useEffect(() => {
    if (api) {
      if (api.state.orientation !== orientation) {
        api.toggleOrientation();
      }
    }
  }, [api, orientation]);

  useEffect(() => {
    if (!api) {
      return;
    }
    const shapes: DrawShape[] = [];
    if (!complete && showThreats && showThreats !== "none") {
      add_shapes(shapes, chess.js.threats(), "threat", showThreats);
    }
    if (!complete && showDefenders && showDefenders !== "none") {
      add_shapes(shapes, chess.js.defenders(), "defender", showDefenders);
    }
    api.setShapes(shapes);
  }, [api, chess, complete, showThreats, showDefenders, history]);

  return <div ref={ref} className={styles.board} />;
}

export default Board;
