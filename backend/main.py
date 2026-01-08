from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from engine.board import generate_standard_board
from engine.player import Player
from engine.state import GameState

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default
    allow_methods=["*"],
    allow_headers=["*"],
)

# Generate board and initial game state
board = generate_standard_board()
players = [Player(1, "Alice", "red"), Player(2, "Bob", "blue")]
game_state = GameState(board, players)

@app.get("/game")
def get_game():
    return game_state.to_model()
