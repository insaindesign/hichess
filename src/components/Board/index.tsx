import { useEffect, useRef, useState } from "react";
import { Chessground } from "chessground";
import { brushes, add_shapes } from "./brushes";

import "./base.css";
import "./brown.css";
import "./california.css";
import "./apples.css";
import styles from "./Board.module.css";

import type { Api } from "chessground/api";
import type { Config } from "chessground/config";
import type { Color, Key, Piece } from "chessground/types";
import type { DrawShape } from "chessground/draw";
import type { Move } from "chess.js";
import type { ChessCtrl } from "../../lib/chess";
import type { ShapeOptionType } from "./brushes";

interface Props {
  chess: ChessCtrl;
  complete: boolean;
  config: Partial<Config>;
  shapes?: DrawShape[];
  showDefenders?: ShapeOptionType;
  showThreats?: ShapeOptionType;
  orientation: Color;
  onMove: (from: Key, to: Key, promotion: Piece | undefined) => void;
}
export type UserColor = Color | "both";

function Board({
  config,
  onMove,
  chess,
  showThreats,
  showDefenders,
  complete,
  orientation,
  shapes,
}: Props) {
  const [api, setApi] = useState<Api | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [history, setHistory] = useState<Move[]>([]);

  useEffect(() => chess.on("change", setHistory), [chess]);

  useEffect(() => {
    if (!api && ref.current) {
      setApi(
        Chessground(ref.current, {
          animation: { enabled: true, duration: 200 },
          highlight: { lastMove: true, check: true },
          autoCastle: true,
          movable: { free: false, showDests: true },
          draggable: { showGhost: true },
          drawable: { brushes },
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
        fen: chess.fen,
        check: Boolean(chess.js.in_check()),
        lastMove: chess.lastMove,
        turnColor: chess.color,
        movable: { dests: chess.dests() },
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
    const draw: DrawShape[] = shapes ? [...shapes] : [];
    if (!complete && showThreats && showThreats !== "none") {
      add_shapes(draw, chess.js.threats(), "threat", showThreats);
    }
    if (!complete && showDefenders && showDefenders !== "none") {
      add_shapes(draw, chess.js.defenders(), "defender", showDefenders);
    }
    api.setShapes(draw);
  }, [api, chess, complete, showThreats, showDefenders, history, shapes]);

  return <div ref={ref} className={styles.board} />;
}

export default Board;
