// src/components/Board.tsx
import React from "react";
import type { HexTile } from "../types/board";

type BoardProps = {
  boardTiles: HexTile[];
};

const BOARD_WIDTH = 900;
const BOARD_HEIGHT = 800;
const HEX_SIZE = 60; // radius
const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
const HEX_HEIGHT = 2 * HEX_SIZE;
const HEX_SPACING_X = HEX_WIDTH * 0.9;

// Helper to convert number -> pips (probability dots)
function getPips(number: number | undefined) {
  if (!number || number === 7) return 0;
  switch(number) {
    case 2:
    case 12: return 1;
    case 3:
    case 11: return 2;
    case 4:
    case 10: return 3;
    case 5:
    case 9:  return 4;
    case 6:
    case 8:  return 5;
    default: return 0;
  }
}

const Board: React.FC<BoardProps> = ({ boardTiles }) => {
  // Preprocess board by rows for centering
  const rows: HexTile[][] = [];

  // Group tiles by r coordinate
  boardTiles.forEach((tile) => {
    const r = tile.r;
    if (!rows[r + 2]) rows[r + 2] = []; // offset for negative r
    rows[r + 2].push(tile);
  });

  // Sort each row by q
  rows.forEach((row) => row.sort((a, b) => a.q - b.q));

const maxTilesInRow = 5;

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <svg width={BOARD_WIDTH} height={BOARD_HEIGHT} viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`} style={{ background: "#0a5ca7", border: "2px solid #555" }}>
        {rows.map((row, rowIndex) => {
          const rowLength = row.length;
          const rowOffsetX = ((maxTilesInRow - rowLength) * HEX_SPACING_X) / 2;

          return row.map((tile, i) => {
            const x = i * HEX_SPACING_X + rowOffsetX + BOARD_WIDTH / 2 - HEX_SPACING_X * maxTilesInRow / 2;
            const y = rowIndex * (HEX_SIZE * 1.35) + BOARD_HEIGHT / 2 - (HEX_SIZE * 1.35 * 2);
            const NUMBER_Y_OFFSET = 15; 
            const number = tile.number;
            const pips = getPips(number);

            return (
                <g key={tile.id}>
                {/* Hex tile */}
                <image
                  href={`/src/assets/hex-tiles/${tile.resource}.svg`}
                  x={x}
                  y={y}
                  width={HEX_WIDTH}
                  height={HEX_HEIGHT}
                />
              {/* Number token */}
                {number && (
                  <g transform={`translate(${x + HEX_WIDTH / 2.28}, ${y + HEX_HEIGHT / 2 + NUMBER_Y_OFFSET})`}>

                    {/* Background circle */}
                    <circle cx={0} cy={0} r={20} fill="#eee" stroke="#000" strokeWidth={2} />

                    {/* Number */}
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      fontSize={16}
                      fontWeight="bold"
                      fill="#000"
                    >
                      {number}
                    </text>

                    {/* Pips */}
                    {[...Array(pips)].map((_, idx) => (
                      <circle
                        key={idx}
                        cx={(idx - (pips-1)/2) * 6} // spread horizontally
                        cy={7.5} // below the number
                        r={2}
                        fill="#000"
                      />
                    ))}
                  </g>
                )}
              </g>
            );
          });
        })}
      </svg>
    </div>
  );
};

export default Board;