"""
Day 1
https://adventofcode.com/2015/day/1
"""

# types
from enum import Enum
# core
from 2015.core import Input, Star, read, AdventOfCodeChallenge


challenge = AdventOfCodeChallenge(
    day=1,
    input=Input.PROD,
    star=Star.SECOND
)


class Floor(Enum):
    UP = "("
    DOWN = ")"


def main() -> None:
    """Main flow of execution"""
    content = read(challenge)

    floor = 0
    dropped_at = None

    for position, char in enumerate(content):
        if char == Floor.UP.value:
            floor += 1
        elif char == Floor.DOWN.value:
            floor -= 1

        if dropped_at is None and floor <= -1:
            dropped_at = position + 1

    result = None

    if challenge['star'] == Star.FIRST:
        result = floor
    elif challenge['star'] == Star.SECOND:
        result = dropped_at

    print("Result:", result)
