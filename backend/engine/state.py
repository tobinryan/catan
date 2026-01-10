from typing import List
from engine.models import GameStateModel
from engine.board import generate_standard_board, Board
from engine.player import Player

class GameState:
    def __init__(self, board: Board, players: List[Player]):
        self.board = board
        self.players = players
        self.current_player_index = 0
        self.turn_phase = "setup"  # "setup", "main", "robbing", "trading"

    @property
    def current_player(self) -> Player:
        return self.players[self.current_player_index]

    def to_model(self):
        return GameStateModel(
            board=self.board.to_model(),
            players=[p.to_model() for p in self.players],
            current_player_index=self.current_player_index,
            turn_phase=self.turn_phase
        )