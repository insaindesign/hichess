import { useEffect, useRef, useState } from "react";
import { Chessground } from "chessground";

import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "./california.css";

import type { Api } from "chessground/api";
import type { Config } from "chessground/config";
import type { Key, Piece } from "chessground/types";
import type { ChessInstance, Move } from "chess.js";

import styles from "./Board.module.css";

interface Props {
  chess: ChessInstance;
  config: Partial<Config>;
  moves: Move[];
  onMove: (from: Key, to: Key, promotion: Piece | undefined) => void;
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

function Board({ config, onMove, moves, chess }: Props) {
  const [api, setApi] = useState<Api | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

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
  }, [chess, api, moves]);

  return <div ref={ref} className={styles.board} />;
}

export default Board;
