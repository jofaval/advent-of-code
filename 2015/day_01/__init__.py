"""
Day 1
https://adventofcode.com/2015/day/1
"""

# types
from enum import Enum

# core
from ..core import Input, Star, read, AdventOfCodeChallenge, result_wrapper, benchmark


challenge = AdventOfCodeChallenge(
    day=1,
    input=Input.PROD,
    star=Star.SECOND
)


class Floor(Enum):
    """Indicates to which diretion translates it's lisp character"""
    UP = "("
    DOWN = ")"


FloorDirectionDict = {
    Floor.UP.value: 1,
    Floor.DOWN.value: -1,
}


@benchmark
@result_wrapper
def main() -> None:
    """Main flow of execution"""
    content = read(challenge)

    floor = 0
    dropped_at = -1 if challenge['star'] != Star.SECOND else None

    for position, char in enumerate(content):
        floor += FloorDirectionDict[char]

        if dropped_at is None and floor <= -1:
            dropped_at = position + 1
            break

    result = None

    if challenge['star'] == Star.FIRST:
        result = floor
    elif challenge['star'] == Star.SECOND:
        result = dropped_at

    return result


if __name__ == "__main__":
    main()
