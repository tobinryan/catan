from pydantic import BaseModel
from typing import List, Optional

class HexTileModel(BaseModel):
    id: int
    q: int
    r: int
    resource: str
    number: Optional[int]

class HexPositionModel(BaseModel):
    q: int
    r: int

class RoadModel(BaseModel):
    start: HexPositionModel
    end: HexPositionModel

class PlayerModel(BaseModel):
    id: int
    name: str
    color: str
    resources: dict
    settlements: List[HexPositionModel]
    cities: List[HexPositionModel]
    roads: List[RoadModel]
    victory_points: int

class BoardModel(BaseModel):
    tiles: List[HexTileModel]
    robber: Optional[HexTileModel]

class GameStateModel(BaseModel):
    board: BoardModel
    players: List[PlayerModel]
    current_player_index: int
    turn_phase: str
