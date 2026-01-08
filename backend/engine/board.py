import random
from typing import List, Optional

from engine.models import BoardModel, HexTileModel

class HexTile:
    def __init__(self, id: int, q: int, r: int, resource: str, number: Optional[int] = None):
        self.id = id
        self.q = q  # axial coordinates
        self.r = r
        self.resource = resource  # "brick", "ore", "sheep", etc.
        self.number = number
    
    def to_model(self):
        return HexTileModel(
            id=self.id,
            q=self.q,
            r=self.r,
            resource=self.resource,
            number=self.number
        )

class Board:
    def __init__(self, tiles: List[HexTile]):
        self.tiles = tiles
        # Find desert tile for the robber
        self.robber = next((tile for tile in tiles if tile.resource == "desert"), None)

    def to_model(self):
        return BoardModel(
            tiles=[tile.to_model() for tile in self.tiles],
            robber=self.robber.to_model() if self.robber else None
        )

def generate_standard_board() -> Board:
    """
    Generates a standard Catan board with randomized tiles and number tokens.
    """
    # Standard Catan terrain counts
    resources = (
        ["wood"] * 4 +
        ["sheep"] * 4 +
        ["wheat"] * 4 +
        ["brick"] * 3 +
        ["ore"] * 3 +
        ["desert"] * 1
    )
    random.shuffle(resources)

    # Standard Catan numbers (without 7 for robber)
    numbers = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12]
    random.shuffle(numbers)

    # Axial coordinates for 19 hexes (pointy-top)
    axial_coords = [
        (0, -2), (1, -2), (2, -2),
        (-1, -1), (0, -1), (1, -1), (2, -1),
        (-2, 0), (-1, 0), (0, 0), (1, 0), (2, 0),
        (-2, 1), (-1, 1), (0, 1), (1, 1),
        (-2, 2), (-1, 2), (0, 2)
    ]

    tiles: List[HexTile] = []

    number_index = 0
    for i, (q, r) in enumerate(axial_coords):
        resource = resources[i]
        if resource == "desert":
            tile_number = None
        else:
            tile_number = numbers[number_index]
            number_index += 1
        tiles.append(HexTile(id=i, q=q, r=r, resource=resource, number=tile_number))

    return Board(tiles)
