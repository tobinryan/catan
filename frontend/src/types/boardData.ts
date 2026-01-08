// src/types/boardData.ts
import type { HexTile } from "./board";

export const sampleBoard: HexTile[] = [
  // Row 0
  { id: 0, q: -1, r: -2, resource: "wood", number: 5 },
  { id: 1, q: 0, r: -2, resource: "brick", number: 2 },
  { id: 2, q: 1, r: -2, resource: "sheep", number: 6 },
  // Row 1
  { id: 3, q: -2, r: -1, resource: "wheat", number: 3 },
  { id: 4, q: -1, r: -1, resource: "ore", number: 8 },
  { id: 5, q: 0, r: -1, resource: "sheep", number: 4 },
  { id: 6, q: 1, r: -1, resource: "wood", number: 9 },
  // Row 2
  { id: 7, q: -2, r: 0, resource: "wheat", number: 11 },
  { id: 8, q: -1, r: 0, resource: "desert" },
  { id: 9, q: 0, r: 0, resource: "brick", number: 10 },
  { id: 10, q: 1, r: 0, resource: "sheep", number: 3 },
  { id: 11, q: 2, r: 0, resource: "ore", number: 8 },
  // Row 3
  { id: 12, q: -1, r: 1, resource: "wood", number: 4 },
  { id: 13, q: 0, r: 1, resource: "wheat", number: 5 },
  { id: 14, q: 1, r: 1, resource: "sheep", number: 6 },
  { id: 15, q: 2, r: 1, resource: "brick", number: 9 },
  // Row 4
  { id: 16, q: 0, r: 2, resource: "wheat", number: 10 },
  { id: 17, q: 1, r: 2, resource: "ore", number: 11 },
  { id: 18, q: 2, r: 2, resource: "wood", number: 3 },
];
