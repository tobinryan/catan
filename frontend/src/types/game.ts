import type { HexTile } from "./board";

// frontend/src/types/game.ts
export type Resource = "brick" | "ore" | "sheep" | "wheat" | "wood" | "desert";

export type PlayerColor = "red" | "blue" | "orange" | "white";

export type Player = {
  id: string;
  name: string;
  color: PlayerColor;
  resources: Record<Resource, number>;
  settlements: HexPosition[];
  cities: HexPosition[];
  roads: Road[];
  victoryPoints: number;
};

export type HexPosition = { q: number; r: number };
export type Road = { start: HexPosition; end: HexPosition };

export type Board = {
  tiles: HexTile[];
  robber?: HexTile;
};

export type GameState = {
  board: Board;
  players: Player[];
  currentPlayerIndex: number;
  turnPhase: "setup" | "main" | "robbing" | "trading";
};
