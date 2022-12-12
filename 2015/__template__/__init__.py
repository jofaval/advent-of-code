"""
Day __CHANGE_DAY__
https://adventofcode.com/2015/day/__CHANGE_DAY__
"""

# core
from ..core import Input, Star, read, AdventOfCodeChallenge, result_wrapper, benchmark


@result_wrapper
@benchmark
def main() -> None:
    """Main flow of execution"""
    challenge = AdventOfCodeChallenge(
        day=__CHANGE_DAY__,
        input=Input.TEST,
        star=Star.FIRST
    )

    content = read(challenge)

    result = None

    if challenge['star'] == Star.FIRST:
        raise Exception(
            f"No result was prepared for the {Star.FIRST.value} star."
        )
    elif challenge['star'] == Star.SECOND:
        raise Exception(
            f"No result was prepared for the {Star.SECOND.value} star."
        )

    return result


if __name__ == "__main__":
    main()
