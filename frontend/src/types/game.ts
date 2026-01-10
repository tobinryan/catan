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

export type Port = {
  q: number;
  r: number;
  direction: number; // 0-5 (0=NE, 1=E, 2=SE, 3=SW, 4=W, 5=NW)
  resource?: string; // undefined for 3:1, or "wood", "brick", etc for 2:1
  ratio: number; // 2 or 3
};

export type Board = {
  tiles: HexTile[];
  robber?: HexTile;
  ports: Port[];
};

export type GameState = {
  board: Board;
  players: Player[];
  currentPlayerIndex: number;
  turnPhase: "setup" | "main" | "robbing" | "trading";
};
