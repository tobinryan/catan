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

class PortModel(BaseModel):
    q: int
    r: int
    direction: int  # 0-5, which edge of the hex (0=NE, 1=E, 2=SE, 3=SW, 4=W, 5=NW)
    resource: Optional[str]  # "wood", "brick", "sheep", "wheat", "ore", or None for 3:1
    ratio: int  # 2 for specialized, 3 for generic

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
    ports: List[PortModel]

class GameStateModel(BaseModel):
    board: BoardModel
    players: List[PlayerModel]
    current_player_index: int
    turn_phase: str
