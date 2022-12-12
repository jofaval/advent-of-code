"""
Day 2
https://adventofcode.com/2015/day/2
"""

# functions
from functools import reduce
# types
from typing import List

# core
from ..core import Input, Star, read, AdventOfCodeChallenge, result_wrapper, benchmark


def calc_surface(*areas: List[int]) -> int:
    """Calculates the area of a right rectangular prism"""
    return sum((2 * area for area in areas))


@result_wrapper
@benchmark
def main() -> None:
    """Main flow of execution"""
    challenge = AdventOfCodeChallenge(
        day=2,
        input=Input.PROD,
        star=Star.SECOND
    )

    content = read(challenge)

    total_square_feet = 0
    total_ribbon_square_feet = 0

    for line in content.split("\n"):
        [length, width, height] = line.split("x")
        [length, width, height] = [int(length), int(width), int(height)]

        areas = [length*width, width*height, height*length]
        surface = calc_surface(*areas)

        square_feet = surface + min(areas)

        total_square_feet += square_feet

        sorted_perimeters = sorted([length, width, height])
        feet_of_ribbon = sum(
            (perimeter * 2 for perimeter in sorted_perimeters[:-1])
        )
        total_ribbon_square_feet += feet_of_ribbon + \
            reduce(lambda prev, curr: prev * curr, sorted_perimeters, 1)

    result = None

    if challenge['star'] == Star.FIRST:
        result = total_square_feet
    elif challenge['star'] == Star.SECOND:
        result = total_ribbon_square_feet

    return result


if __name__ == "__main__":
    main()
