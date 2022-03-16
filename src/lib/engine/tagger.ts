import {
  advanced_pawn,
  double_check,
  sacrifice,
  x_ray,
  fork,
  mateIn,
  hanging_piece,
  trapped_piece,
  discovered_attack,
  skewer,
  capturing_defender,
} from "./analyse";

import type { ChessPosition } from "./analyse";

type TagKind =
  | "mate"
  | "advancedPawn"
  | "doubleCheck"
  | "sacrifice"
  | "fork"
  | "pin"
  | "hangingPiece"
  | "trappedPiece"
  | "skewer"
  | "capturingDefender"
  | "discoveredAttack"
  | "xRayAttack";

const tag = (position: ChessPosition): TagKind[] => {
  const tags: TagKind[] = [];
  const mate_tag = mateIn(position);
  if (mate_tag !== null) {
    tags.push("mate");
  }

  if (advanced_pawn(position)) {
    tags.push("advancedPawn");
  }

  if (double_check(position)) {
    tags.push("doubleCheck");
  }

  if (sacrifice(position)) {
    tags.push("sacrifice");
  }

  if (x_ray(position)) {
    tags.push("xRayAttack");
  }

  if (fork(position)) {
    tags.push("fork");
  }

  if (hanging_piece(position)) {
    tags.push("hangingPiece");
  }

  if (trapped_piece(position)) {
    tags.push("trappedPiece");
  }

  if (discovered_attack(position)) {
    tags.push("discoveredAttack");
  }

  if (skewer(position)) {
    tags.push("skewer");
  }

  // if (pin_prevents_attack(position) || pin_prevents_escape(position)) {
  //   tags.push("pin");
  // }

  if (capturing_defender(position)) {
    tags.push("capturingDefender");
  }

  return tags;
};


export default tag;