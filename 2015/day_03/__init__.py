"""
Day 3
https://adventofcode.com/2015/day/3
"""

# types
from enum import Enum
from typing import List, Tuple

# core
from ..core import Input, Star, read, AdventOfCodeChallenge, result_wrapper, benchmark


class HouseMove(Enum):
    """Where should santa go"""
    NORTH = "^"
    SOUTH = "v"
    EAST = ">"
    WEST = "<"


def calc_surface(*areas: List[int]) -> int:
    """Calculates the area of a right rectangular prism"""
    return sum((2 * area for area in areas))


def serialize_coordinates(coordinates: List[int]) -> Tuple[int]:
    """Serializes coordinates to a string"""
    return tuple(coordinates)


@result_wrapper
@benchmark
def main() -> None:
    """Main flow of execution"""
    challenge = AdventOfCodeChallenge(
        day=3,
        input=Input.PROD,
        star=Star.SECOND
    )

    content = read(challenge)

    santas_coordinates = [0, 0]
    robo_santa_coordinates = [0, 0]

    visited_houses = set()

    # starting position
    visited_houses.add(serialize_coordinates(santas_coordinates))

    for index, direction in enumerate(content):
        is_robo_santas_turn = challenge['star'] == Star.SECOND and index % 2 != 0

        coordinates = santas_coordinates
        if is_robo_santas_turn:
            coordinates = robo_santa_coordinates

        if direction == HouseMove.NORTH.value:
            coordinates[1] += 1
        if direction == HouseMove.SOUTH.value:
            coordinates[1] -= 1
        if direction == HouseMove.EAST.value:
            coordinates[0] += 1
        if direction == HouseMove.WEST.value:
            coordinates[0] -= 1

        if is_robo_santas_turn:
            robo_santa_coordinates = coordinates
            visited_houses.add(
                serialize_coordinates(robo_santa_coordinates)
            )
        else:
            santas_coordinates = coordinates
            visited_houses.add(serialize_coordinates(santas_coordinates))

    result = None

    if challenge['star'] == Star.FIRST:
        result = len(visited_houses)
    elif challenge['star'] == Star.SECOND:
        result = len(visited_houses)

    return result


if __name__ == "__main__":
    main()
