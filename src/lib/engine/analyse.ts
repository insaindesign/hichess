import Chess, { Move, PieceType } from "chess.js";

import type {
  Square as Key,
  ShortMove,
  ChessInstance,
  Color as ChessColor,
} from "chess.js";

export type ChessPosition = {
  fen?: string;
  moves: ShortMove[];
  history: ShortMove[];
};

const chessFromPosition = (position: ChessPosition): ChessInstance => {
  const chess = new Chess(position.fen);
  position.history.forEach((m) => chess.move(m));
  return chess;
};

const chessFromMove = (
  position: ChessPosition,
  index: number
): ChessInstance => {
  const chess = new Chess(position.fen);
  position.history.forEach((m) => chess.move(m));
  for (let ii = 0; ii < index && position.moves.length; ii++) {
    chess.move(position.moves[ii]);
  }
  return chess;
};

const { KING, PAWN, KNIGHT, BISHOP, ROOK, QUEEN } = new Chess();

const values = {
  [PAWN]: 1,
  [KNIGHT]: 3,
  [BISHOP]: 3,
  [ROOK]: 5,
  [QUEEN]: 9,
  [KING]: 99,
} as const;

const ray_pieces: PieceType[] = [QUEEN, ROOK, BISHOP];

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const toFileRank = (a: string): [number, number] => {
  const [file, rank] = a.split('');
  return [files.indexOf(file), parseInt(rank, 10)];
}

const squaresBetween = (a: Key, b: Key): Key[] => {
  const [aFile, aRank] = toFileRank(a);
  const [bFile, bRank] = toFileRank(b);
  const rankDelta = bRank - aRank;
  const fileDelta = bFile - aFile;
  const delta = Math.max(Math.abs(fileDelta), Math.abs(rankDelta));
  const squares: Key[] = [];
  for (let ii = 1; ii < delta; ii++) {
    const file = fileDelta ? aFile + (fileDelta < 0 ? -ii : ii) : aFile;
    const rank = rankDelta ? aRank + (rankDelta < 0 ? -ii : ii) : aRank;
    squares.push(`${files[file]}${rank}` as Key);
  }
  return squares;
};

const findPiece = (
  chess: ChessInstance,
  piece: PieceType,
  color: ChessColor
): Key | null => {
  for (let ii = 0; ii < chess.SQUARES.length; ii++) {
    const k = chess.SQUARES[ii];
    const p = chess.get(k);
    if (p && p.type === piece && p.color === color) {
      return k;
    }
  }
  return null;
};

const is_hanging = (chess: ChessInstance, square: Key): boolean => {
  const attacked = chess.threats();
  const defended = chess.defenders();
  return attacked[square] && !defended[square];
};

const is_in_bad_spot = (chess: ChessInstance, square: Key): boolean => {
  return false;
};

const is_trapped = (chess: ChessInstance, square: Key): boolean => {
  return false;
};

const is_castling = (move: ShortMove): boolean => {
  return false;
};

const is_very_advanced_pawn_move = (move: ShortMove): boolean => {
  const [rank] = toFileRank(move.to);
  return rank < 2 || rank > 6;
};

const material = (chess: ChessInstance): number => {
  const color = chess.turn();
  let score = 0;
  chess.board().forEach(row => {
    row.forEach(piece => {
      if (piece && piece.color === color && piece.type !== KING) {
        score += values[piece.type];
      }
    });
  });
  return score;
};

export const advanced_pawn = (position: ChessPosition): boolean => {
  for (let ii = 0; ii < position.moves.length; ii++) {
    if (is_very_advanced_pawn_move(position.moves[ii])) {
      return true;
    }
  }
  return false;
};

export const checkers = (c: ChessInstance): Move[] => {
  if (c.in_check()) {
    const king = findPiece(c, KING, c.turn() === "w" ? "b" : "w");
    const threats = c.threats();
    if (king && threats[king]) {
      return threats[king];
    }
  }
  return [];
};

export const double_check = (position: ChessPosition): number | null => {
  const c = chessFromPosition(position);
  for (let ii = 0; ii < position.moves.length; ii++) {
    c.move(position.moves[ii]);
    if (checkers(c).length > 1) {
      return ii;
    }
  }
  return null;
};

export const sacrifice = (position: ChessPosition): boolean => {
  const chess = chessFromPosition(position);
  const diffs = [material(chess)];
  for (let ii = 0; ii < position.moves.length; ii++) {
    chess.move(position.moves[ii]);
    diffs.push(material(chess));
  }
  for (let ii = 1; ii < diffs.length; ii++) {
    if (diffs[ii] - diffs[0] <= -2 && position.moves[ii - 1].promotion) {
      return true;
    }
  }
  return false;
};

export const x_ray = (position: ChessPosition): boolean => {
  const chess = chessFromPosition(position);
  for (let ii = 0; ii < position.moves.length; ii += 1) {
    const move = chess.move(position.moves[ii]);
    const moves = chess.history({ verbose: true });
    if (!move || move.captured) {
      continue;
    }
    const prevMove = moves[moves.length - 2];
    if (!prevMove || prevMove.piece === KING) {
      continue;
    }
    if (moves[moves.length - 3]) {
      continue;
    }
    if (squaresBetween(move.from, move.to).includes(prevMove.from)) {
      return true;
    }
  }
  return false;
};

export const fork = (position: ChessPosition): boolean => {
  const chess = chessFromPosition(position);
  for (let node of position.moves) {
    const move = chess.move(node);
    if (move?.piece !== KING) {
      if (is_in_bad_spot(chess, node.to)) {
        continue;
      }
      let nb = 0;
      const threats = chess.threats();
      const defenders = chess.defenders();
      const piece = chess.get(node.to);
      for (let move of threats[node.to]) {
        if (!piece || piece.type === PAWN) {
          continue;
        }
        if (
          values[piece.type] > values[move.piece] ||
          (is_hanging(chess, node.to) && defenders[node.to])
        ) {
          nb += 1;
        }
      }
      if (nb > 1) {
        return true;
      }
    }
  }
  return false;
};

export const hanging_piece = (position: ChessPosition): boolean => {
  const chess = chessFromPosition(position);
  const to = position.moves[1].to;
  const captured = chess.get(to);
  if (chess.in_check() && (!captured || captured.type === PAWN)) {
    return false;
  }
  if (captured && captured.type !== PAWN) {
    if (is_hanging(chess, to)) {
      const op_move = position.moves[0];
      const op_capture = chess.get(op_move.to);
      if (
        op_capture &&
        values[op_capture.type] >= values[captured.type] &&
        op_move.to === to
      ) {
        return false;
      }
      if (position.moves.length < 4) {
        return true;
      }
      if (
        material(chessFromMove(position, 3)) >=
        material(chessFromMove(position, 1))
      ) {
        return true;
      }
    }
  }
  return false;
};

export const trapped_piece = (position: ChessPosition): boolean => {
  const chess = chessFromPosition(position);
  for (let ii = 0; ii < position.moves.length; ii++) {
    const node = position.moves[ii];
    let square = node.to;
    const captured = chess.get(square);
    if (captured && captured.type !== PAWN) {
      const prev = position.moves[ii - 1];
      if (prev && prev.to === square) {
        square = prev.from;
      }
      if (is_trapped(chess, square)) {
        return true;
      }
    }
  }
  return false;
};

export const discovered_attack = (position: ChessPosition): boolean => {
  if (discovered_check(position)) {
    return true;
  }
  const chess = chessFromPosition(position);
  for (let node of position.moves) {
    const move = chess.move(node);
    const moves = chess.history({ verbose: true });
    const prev = moves[moves.length - 2];
    if (move && move.captured) {
      const between = squaresBetween(node.from, node.to);
      if (!prev || prev.to === node.to) {
        return false;
      }
      if (between.includes(prev.from) && !is_castling(prev)) {
        return true;
      }
    }
  }
  return false;
};

export const discovered_check = (position: ChessPosition): boolean => {
  const chess = chessFromPosition(position);
  for (let node of position.moves) {
    const checks = checkers(chess);
    if (!checks.find((m) => m.to === node.to)) {
      return true;
    }
  }
  return false;
};

export const skewer = (position: ChessPosition): boolean => {
  const chess = chessFromPosition(position);
  for (let node of position.moves) {
    const move = chess.move(node);
    const moves = chess.history({ verbose: true });
    const prev = moves[moves.length - 1];
    if (
      move &&
      move.captured &&
      ray_pieces.includes(move.piece) &&
      chess.in_checkmate()
    ) {
      const between = squaresBetween(node.from, node.to);
      const op_move = prev;
      if (op_move.to === node.to || !between.includes(op_move.from)) {
        continue;
      }
      if (
        values[prev.piece] > values[move.captured] &&
        is_in_bad_spot(chess, node.to)
      ) {
        return true;
      }
    }
  }
  return false;
};

export const capturing_defender = (position: ChessPosition): boolean => {
  const chess = chessFromPosition(position);
  const init_board = new Chess(chess.fen());
  for (let node of position.moves) {
    const move = chess.move(node);
    if (
      chess.in_checkmate() ||
      (move?.captured &&
        move.piece !== KING &&
        values[move.captured] <= values[move.piece] &&
        is_hanging(chess, node.to))
    ) {
      const prev = node;
      if (!chess.in_check() && prev.to !== node.from) {
        const defender_square = prev.to;
        const defender = init_board.get(defender_square);
        if (
          defender &&
          defender_square in init_board.threats()[node.to] &&
          !init_board.in_check()
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export const mateIn = (position: ChessPosition): number | null => {
  const chess = chessFromPosition(position);
  if (!chess.in_checkmate() || position.moves.length > 10) {
    return null;
  }
  return position.moves.length;
};
