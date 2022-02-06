import { useEffect, useRef, useState } from "react";
import { Chessground } from "chessground";

import "./base.css";
import "./brown.css";
import "./california.css";

import type { Api } from "chessground/api";
import type { Config } from "chessground/config";
import type { Key, Piece } from "chessground/types";
import type { DrawBrush, DrawShape } from "chessground/draw";
import type { ChessInstance, Move } from "chess.js";

import styles from "./Board.module.css";

interface Props {
  chess: ChessInstance;
  complete: boolean;
  config: Partial<Config>;
  showDefenders?: boolean;
  showThreats?: boolean;
  onMove: (from: Key, to: Key, promotion: Piece | undefined) => void;
}

type BrushTypes = "threat" | "defender";

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
  key: BrushTypes
) {
  Object.values(square_moves).forEach((t) => {
    list.push({
      orig: t[0].to,
      customSvg: circleSvg(t[0].color, key, t.length),
    });
    t.forEach((move) => {
      list.push({
        orig: move.from,
        dest: move.to,
        brush: key + move.color,
      });
    });
  });
}

function toDests(chess: ChessInstance): Map<Key, Key[]> {
  const dests = new Map();
  chess.SQUARES.forEach((s) => {
    const ms = chess.moves({ square: s, verbose: true });
    if (ms.length)
      dests.set(
        s,
        ms.map((m) => m.to)
      );
  });
  return dests;
}

function Board({
  config,
  onMove,
  chess,
  showThreats,
  showDefenders,
  complete,
}: Props) {
  const [api, setApi] = useState<Api | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(
    () => chess.on("history", () => setHistory(chess.history())),
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
        fen: chess.fen(),
        check: chess.in_check(),
        turnColor: chess.turn() === "b" ? "black" : "white",
        movable: {
          dests: toDests(chess),
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
    if (complete || !api) {
      return;
    }
    const shapes: DrawShape[] = [];
    if (showThreats) {
      add_shapes(shapes, chess.threats(), "threat");
    }
    if (showDefenders) {
      add_shapes(shapes, chess.defenders(), "defender");
    }
    api.setShapes(shapes);
  }, [api, chess, complete, showThreats, showDefenders, history]);

  return <div ref={ref} className={styles.board} />;
}

export default Board;
