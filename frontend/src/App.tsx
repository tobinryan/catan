import React from "react";
import Board from "./components/Board";
import { sampleBoard } from "./types/boardData";

function App() {
  return <Board boardTiles={sampleBoard} />;
}

export default App;
