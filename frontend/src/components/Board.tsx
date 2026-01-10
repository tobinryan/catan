// src/components/Board.tsx
import React from "react";
import type { HexTile } from "../types/board";
import type { Port } from "../types/game";

type BoardProps = {
  boardTiles: HexTile[];
  robber?: HexTile;
  ports: Port[];
};

const BOARD_WIDTH = 900;
const BOARD_HEIGHT = 800;
const HEX_SIZE = 60; // radius
const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
const HEX_HEIGHT = 2 * HEX_SIZE;
const HEX_SPACING_X = HEX_WIDTH * 1.04; // slightly more than tile width
const ROW_HEIGHT = HEX_SIZE * 1.55;     // vertical spacing
const ISLAND_FILL = "#EAD9B0"; // beige island
const ISLAND_BLEED = 4;

// Helper to convert number -> pips (probability dots)
function getPips(number: number | undefined) {
  if (!number || number === 7) return 0;
  switch (number) {
    case 2:
    case 12:
      return 1;
    case 3:
    case 11:
      return 2;
    case 4:
    case 10:
      return 3;
    case 5:
    case 9:
      return 4;
    case 6:
    case 8:
      return 5;
    default:
      return 0;
  }
}

const Board: React.FC<BoardProps> = ({ boardTiles, robber, ports }) => {
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
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg
        width={BOARD_WIDTH}
        height={BOARD_HEIGHT}
        viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
        style={{ background: "#0a5ca7", border: "2px solid #555" }}
      >
        {/* Beige island underlay: beneath all tiles */}
        <g>
          {rows.map((row, rowIndex) => {
            const rowLength = row.length;
            const rowOffsetX = ((maxTilesInRow - rowLength) * HEX_SPACING_X) / 2;
            return row.map((tile, i) => {
              const x =
                i * HEX_SPACING_X +
                rowOffsetX +
                BOARD_WIDTH / 2 -
                (HEX_SPACING_X * maxTilesInRow) / 2;
              const y =
                rowIndex * ROW_HEIGHT +
                BOARD_HEIGHT / 2 -
                ROW_HEIGHT * 2;

              const hexCenterX = x + HEX_WIDTH / 2;
              const hexCenterY = y + HEX_HEIGHT / 2;
              const VERTEX_ANGLES = [-30, 30, 90, 150, -150, -90];
              const R = HEX_SIZE + ISLAND_BLEED;
              const islandPoints = VERTEX_ANGLES.map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const px = hexCenterX + (R * Math.cos(rad));
                const py = hexCenterY + R * Math.sin(rad);
                return `${px},${py}`;
              }).join(" ");
              return <polygon key={`island-${tile.id}`} points={islandPoints} fill={ISLAND_FILL} />;
            });
          })}
        </g>

        {rows.map((row, rowIndex) => {
          const rowLength = row.length;
          const rowOffsetX = ((maxTilesInRow - rowLength) * HEX_SPACING_X) / 2;

          return row.map((tile, i) => {
            const x =
              i * HEX_SPACING_X +
              rowOffsetX +
              BOARD_WIDTH / 2 -
              (HEX_SPACING_X * maxTilesInRow) / 2;
            const y =
              rowIndex * ROW_HEIGHT +
              BOARD_HEIGHT / 2 -
              ROW_HEIGHT * 2;
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
                  <g
                    transform={`translate(${x + HEX_WIDTH / 2}, ${
                      y + HEX_HEIGHT / 2 + NUMBER_Y_OFFSET
                    })`}
                  >
                    {/* Background circle */}
                    <circle
                      cx={0}
                      cy={0}
                      r={20}
                      fill="lightgrey"
                      stroke="#000"
                      strokeWidth={2}
                    />

                    {/* Number */}
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      fontSize={16}
                      fontWeight="bold"
                      fill={number === 6 || number === 8 ? "#d90000ff" : "#000"}
                    >
                      {number}
                    </text>

                    {/* Pips */}
                    {[...Array(pips)].map((_, idx) => (
                      <circle
                        key={idx}
                        cx={(idx - (pips - 1) / 2) * 6} // spread horizontally
                        cy={7.5} // below the number
                        r={2}
                        fill={
                          number === 6 || number === 8
                            ? "#d90000ff"
                            : "#000000ff"
                        }
                      />
                    ))}
                  </g>
                )}
              </g>
            );
          });
        })}

        {/* Render robber */}
        {robber &&
          (() => {
            const robberRow = rows[robber.r + 2];
            if (!robberRow) return null;

            const robberTileIndex = robberRow.findIndex(
              (t) => t.id === robber.id
            );
            if (robberTileIndex === -1) return null;

            const rowLength = robberRow.length;
            const rowOffsetX =
              ((maxTilesInRow - rowLength) * HEX_SPACING_X) / 2;
            const x =
              robberTileIndex * HEX_SPACING_X +
              rowOffsetX +
              BOARD_WIDTH / 2 -
              (HEX_SPACING_X * maxTilesInRow) / 2;
            const y =
              (robber.r + 2) * (HEX_SIZE * 1.35) +
              BOARD_HEIGHT / 2 -
              HEX_SIZE * 1.35 * 2;

            return (
              <image
                href="/src/assets/icons/robber.svg"
                x={x + HEX_WIDTH / 2 - 44}
                y={y + HEX_HEIGHT / 2 - 20}
                width={48}
                preserveAspectRatio="xMidYMid meet"
              />
            );
          })()}

        {/* Render ports */}
        {ports.map((port, idx) => {
          const portRow = rows[port.r + 2];
          if (!portRow) return null;

          const portTileIndex = portRow.findIndex(
            (t) => t.q === port.q && t.r === port.r
          );
          if (portTileIndex === -1) return null;

          const rowLength = portRow.length;
          const rowOffsetX = ((maxTilesInRow - rowLength) * HEX_SPACING_X) / 2;

          const hexX =
            portTileIndex * HEX_SPACING_X +
            rowOffsetX +
            BOARD_WIDTH / 2 -
            (HEX_SPACING_X * maxTilesInRow) / 2;

          const rowIndex = port.r + 2;

          const hexY =
            rowIndex * ROW_HEIGHT +
            BOARD_HEIGHT / 2 -
            ROW_HEIGHT * 2;

          const hexCenterX = hexX + HEX_WIDTH / 2;
          const hexCenterY = hexY + HEX_HEIGHT / 2;
          const VERTEX_ANGLES = [-30, 30, 90, 150, -150, -90];
          
          // Each edge direction corresponds to two vertices
          // Edge 0: top, Edge 1: upper-right, Edge 2: lower-right, etc.
          const edgeVertices = [
            [5, 0], // Edge 0: top edge (between vertices 5 and 0)
            [0, 1], // Edge 1: upper-right
            [1, 2], // Edge 2: lower-right
            [2, 3], // Edge 3: bottom
            [3, 4], // Edge 4: lower-left
            [4, 5], // Edge 5: upper-left
          ];

          const [v1Idx, v2Idx] = edgeVertices[port.direction];
          
          // Calculate positions of the two vertices
          const angle1 = (VERTEX_ANGLES[v1Idx] * Math.PI) / 180;
          const angle2 = (VERTEX_ANGLES[v2Idx] * Math.PI) / 180;
          
          const v1x = hexCenterX + HEX_SIZE * Math.cos(angle1);
          const v1y = hexCenterY + HEX_SIZE * Math.sin(angle1);
          const v2x = hexCenterX + HEX_SIZE * Math.cos(angle2);
          const v2y = hexCenterY + HEX_SIZE * Math.sin(angle2);
          
          // Midpoint of the edge
          const edgeMidX = (v1x + v2x) / 2;
          const edgeMidY = (v1y + v2y) / 2;
          
          // Direction from hex center to edge midpoint (outward normal)
          const dx = edgeMidX - hexCenterX;
          const dy = edgeMidY - hexCenterY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const nx = dx / dist;
          const ny = dy / dist;
          
          // Push port outward from edge midpoint, adjust by board side
          const BASE_OUTWARD_OFFSET = 25;
          const portCenterX = edgeMidX + nx * BASE_OUTWARD_OFFSET;
          const portCenterY = edgeMidY + ny * BASE_OUTWARD_OFFSET;
          
          // Adjust for image size (40x40, so offset by 20 to center)
          const portX = portCenterX - 20;
          const portY = portCenterY - 20;

          const portResource = port.resource || "misc";

          const PIER_THICKNESS = 16;

          const EDGE_ANCHOR_FRACTION = 0.9;
          const a1x = edgeMidX + (v1x - edgeMidX) * EDGE_ANCHOR_FRACTION;
          const a1y = edgeMidY + (v1y - edgeMidY) * EDGE_ANCHOR_FRACTION;
          const a2x = edgeMidX + (v2x - edgeMidX) * EDGE_ANCHOR_FRACTION;
          const a2y = edgeMidY + (v2y - edgeMidY) * EDGE_ANCHOR_FRACTION;

          // Compute angles and lengths from port center to anchored points
          const t1dx = a1x - portCenterX;
          const t1dy = a1y - portCenterY;
          const t2dx = a2x - portCenterX;
          const t2dy = a2y - portCenterY;
          const t1len = Math.hypot(t1dx, t1dy);
          const t2len = Math.hypot(t2dx, t2dy);
          const pier1AngleDeg = (Math.atan2(t1dy, t1dx) * 180) / Math.PI;
          const pier2AngleDeg = (Math.atan2(t2dy, t2dx) * 180) / Math.PI;

          // Make piers longer by small overshoot toward the edge
          const EDGE_OVERSHOOT = 6;
          const pier1Len = t1len + EDGE_OVERSHOOT;
          const pier2Len = t2len + EDGE_OVERSHOOT;

          // Start the pier just touching the port
          const PIER_PORT_CLEAR = 3;
          const pier1Start = Math.min(PIER_PORT_CLEAR, pier1Len);
          const pier2Start = Math.min(PIER_PORT_CLEAR, pier2Len);
          const pier1DrawLen = Math.max(pier1Len - pier1Start, 0);
          const pier2DrawLen = Math.max(pier2Len - pier2Start, 0);

          return (
            <g key={`port-${idx}`}>
              {/* Pier to vertex 1 */}
              <g transform={`translate(${portCenterX}, ${portCenterY}) rotate(${pier1AngleDeg})`}>
                <image
                  href="/src/assets/ports/pier.svg"
                  x={pier1Start}
                  y={-PIER_THICKNESS / 2}
                  width={pier1DrawLen}
                  height={PIER_THICKNESS}
                  preserveAspectRatio="none"
                />
              </g>

              {/* Pier to vertex 2 */}
              <g transform={`translate(${portCenterX}, ${portCenterY}) rotate(${pier2AngleDeg})`}>
                <image
                  href="/src/assets/ports/pier.svg"
                  x={pier2Start}
                  y={-PIER_THICKNESS / 2}
                  width={pier2DrawLen}
                  height={PIER_THICKNESS}
                  preserveAspectRatio="none"
                />
              </g>

              {/* Port icon */}
              <image
                href={`/src/assets/ports/port_${portResource}.svg`}
                x={portX}
                y={portY}
                width={40}
                height={40}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default Board;
