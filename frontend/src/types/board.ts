// src/types/board.ts
export type HexTile = {
  id: number;
  q: number;
  r: number;
  resource: "wood" | "brick" | "sheep" | "wheat" | "ore" | "desert";
  number?: number;
};
