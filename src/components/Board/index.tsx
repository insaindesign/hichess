import { useEffect, useRef, useState } from "react";
import { Chessground } from "chessground";

import "./base.css";
import "./brown.css";
import "./california.css";

import type { Api } from "chessground/api";
import type { Config } from "chessground/config";
import type { Key, Piece } from "chessground/types";
import type { DrawBrush, DrawShape } from "chessground/draw";
import type { ChessInstance } from "chess.js";

import styles from "./Board.module.css";

interface Props {
  chess: ChessInstance;
  config: Partial<Config>;
  showThreats?: boolean;
  onMove: (from: Key, to: Key, promotion: Piece | undefined) => void;
}

const threatBBrush: DrawBrush = {
  key: "threatB",
  color: "purple",
  opacity: 0.7,
  lineWidth: 10,
};

const threatWBrush: DrawBrush = {
  ...threatBBrush,
  key: "threatW",
  color: "orange",
};

const circleSvg = (color: "b" | "w", text: string | number) =>
  `<circle class="threat-circle-${color}" cx="15" cy="15" r="10"/><text class="threat-text" x="15" y="15" dy=".33em" text-anchor="middle">${text}</text>`;

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

function Board({ config, onMove, chess, showThreats }: Props) {
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
        viewOnly: chess.game_over(),
      });
    }
  }, [chess, api, history]);

  useEffect(() => {
    if (chess.game_over() || !api) {
      return;
    }
    if (!showThreats) {
      api.setShapes([]);
      return;
    }
    const shapes: DrawShape[] = [];
    Object.values(chess.threats()).forEach((t) => {
      shapes.push({
        orig: t[0].to,
        customSvg: circleSvg(t[0].color, t.length),
      });
      t.forEach((move) => {
        shapes.push({
          orig: move.from,
          dest: move.to,
          brush: "threat" + move.color,
        });
      });
    });
    api.setShapes(shapes);
  }, [api, chess, showThreats, history]);

  return <div ref={ref} className={styles.board} />;
}

export default Board;
