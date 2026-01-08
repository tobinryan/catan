import React, { useEffect, useState } from "react";
import Board from "./components/Board";
import type { GameState } from "./types/game";

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);

    useEffect(() => {
      fetch("http://localhost:8000/game")
        .then(res => res.json())
        .then(data => setGameState(data));
    }, []);

    if (!gameState) return <div>Loading...</div>;

    return (
      <div>
        <Board boardTiles={gameState.board.tiles} />
      </div>
    );
}

export default App;
