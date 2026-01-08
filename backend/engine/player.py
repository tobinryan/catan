from typing import List, Dict
from engine.models import HexPositionModel, PlayerModel, RoadModel
from engine.board import HexTile

class HexPosition:
    def __init__(self, q: int, r: int):
        self.q = q
        self.r = r

class Road:
    def __init__(self, start: HexPosition, end: HexPosition):
        self.start = start
        self.end = end

class Player:
    def __init__(self, id: int, name: str, color: str):
        self.id = id
        self.name = name
        self.color = color  # "red", "blue", etc.
        self.resources: Dict[str, int] = {
            "brick": 0,
            "ore": 0,
            "sheep": 0,
            "wheat": 0,
            "wood": 0
        }
        self.settlements: List[HexPosition] = []
        self.cities: List[HexPosition] = []
        self.roads: List[Road] = []
        self.victory_points = 0
        self.development_cards: List[str] = []  # "Knight", "VictoryPoint", etc.

    def to_model(self):
        return PlayerModel(
            id=self.id,
            name=self.name,
            color=self.color,
            resources=self.resources,
            settlements=[HexPositionModel(q=p.q, r=p.r) for p in self.settlements],
            cities=[HexPositionModel(q=p.q, r=p.r) for p in self.cities],
            roads=[RoadModel(start=HexPositionModel(q=r.start.q, r=r.start.r),
                             end=HexPositionModel(q=r.end.q, r=r.end.r)) for r in self.roads],
            victory_points=self.victory_points
        )