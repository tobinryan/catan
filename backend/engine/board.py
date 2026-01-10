import random
from typing import List, Optional

from engine.models import BoardModel, HexTileModel, PortModel

HEX_DIRECTIONS = [
    (1, -1),   # 0 = NE
    (1, 0),    # 1 = E
    (0, 1),    # 2 = SE
    (-1, 1),   # 3 = SW
    (-1, 0),   # 4 = W
    (0, -1),   # 5 = NW
]

def is_coastal(q: int, r: int) -> bool:
    return max(abs(q), abs(r), abs(-q - r)) == 2

def generate_port_anchors(tiles):
    """
    Returns strategically placed port positions following standard Catan layout.
    Ports are evenly spaced around the perimeter, placed at the ends of long rows
    and alternating every other coastal edge space.
    
    Returns list of (q, r, direction) tuples.
    Direction mapping: 0=NE, 1=E, 2=SE, 3=SW, 4=W, 5=NW
    """
    # Fixed positions for 9 ports, evenly distributed around the board perimeter
    # These are positioned at strategic coastal hex edges, roughly every other space,
    # prioritizing placement at the ends of the longest (5-hex) row
    
    return [
        # Starting from top, going clockwise
        (0, -2, 5),    # Top-left corner, facing NW (top edge)
        (2, -2, 0),    # Top-right corner, facing NE (top edge)
        
        (2, -1, 1),    # Upper-right side, facing E
        
        (2, 0, 1),     # Right end of longest row, facing E
        (1, 1, 2),     # Lower-right side, facing SE
        
        (-1, 2, 3),    # Bottom-right corner, facing SW
        (-2, 2, 4),    # Bottom-left corner, facing W
        
        (-2, 0, 4),    # Left end of longest row, facing W
        (-1, -1, 5),   # Upper-left side, facing NW
    ]


def generate_ports(tiles):
    anchors = generate_port_anchors(tiles)
    
    # Standard Catan port distribution: 4 generic 3:1 ports and 5 resource-specific 2:1 ports
    port_types = (
        [(None, 3)] * 4 +
        [("wood", 2), ("brick", 2), ("sheep", 2), ("wheat", 2), ("ore", 2)]
    )
    random.shuffle(port_types)

    ports = []
    for (q, r, direction), (resource, ratio) in zip(anchors, port_types):
        ports.append(Port(q, r, direction, resource, ratio))

    return ports

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

class Port:
    def __init__(self, q: int, r: int, direction: int, resource: Optional[str], ratio: int):
        self.q = q
        self.r = r
        self.direction = direction  # 0-5 (0=NE, 1=E, 2=SE, 3=SW, 4=W, 5=NW)
        self.resource = resource  # None for 3:1, or "wood", "brick", etc for 2:1
        self.ratio = ratio
    
    def to_model(self):
        return PortModel(
            q=self.q,
            r=self.r,
            direction=self.direction,
            resource=self.resource,
            ratio=self.ratio
        )

class Board:
    def __init__(self, tiles: List[HexTile], ports: List[Port]):
        self.tiles = tiles
        self.ports = ports
        # Find desert tile for the robber
        self.robber = next((tile for tile in tiles if tile.resource == "desert"), None)

    def to_model(self):
        return BoardModel(
            tiles=[tile.to_model() for tile in self.tiles],
            robber=self.robber.to_model() if self.robber else None,
            ports=[port.to_model() for port in self.ports]
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

    ports = generate_ports(tiles)

    for port in ports:
        print(f"Port at ({port.q}, {port.r}) facing {port.direction} for {port.resource} at {port.ratio}:1")
    return Board(tiles, ports)