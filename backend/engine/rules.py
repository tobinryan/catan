from engine.state import GameState
from engine.player import Player, HexPosition, Road

def validate_settlement(state: GameState, player: Player, position: HexPosition) -> bool:
    """
    Check if a settlement placement is legal.
    """
    # TODO: check distance from other settlements, connection rules, etc.
    return True

def validate_road(state: GameState, player: Player, road: Road) -> bool:
    """
    Check if road placement is legal.
    """
    return True
