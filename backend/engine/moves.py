from engine.state import GameState
from engine.player import Player, HexPosition, Road

def place_settlement(state: GameState, player: Player, position: HexPosition) -> bool:
    """
    Attempt to place a settlement.
    Returns True if successful, False if invalid move.
    """
    # TODO: validate placement using rules.py
    player.settlements.append(position)
    player.victory_points += 1
    return True

def place_road(state: GameState, player: Player, road: Road) -> bool:
    """
    Attempt to place a road.
    """
    # TODO: validate road connection
    player.roads.append(road)
    return True
