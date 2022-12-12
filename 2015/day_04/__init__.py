"""
Day 4
https://adventofcode.com/2015/day/4
"""

# dates
import datetime
from hashlib import md5
# system
from os.path import join, dirname

# core
from ..core import Input, Star, read, AdventOfCodeChallenge, result_wrapper, benchmark


OUTPUT_FILENAME = join(dirname(__file__), "output.txt")


def output(index: int, raw: str, hashed: str) -> None:
    """Logs the output"""
    current = datetime.datetime.now().strftime("%Y/%m/%d %H:%M:%S")
    num = str(index).zfill(9)

    with open(OUTPUT_FILENAME, 'a+', encoding='utf-8') as writter:
        writter.write(
            f"[{current}] with number: {num} | {raw}, \"{hashed}\".\n"
        )


@result_wrapper
@benchmark
def main() -> None:
    """Main flow of execution"""
    challenge = AdventOfCodeChallenge(
        day=4,
        input=Input.PROD,
        star=Star.FIRST
    )

    content = read(challenge)

    with open(OUTPUT_FILENAME, 'w+', encoding='utf-8') as writter:
        writter.write("")

    # index = 1_000_000
    index = 0
    valid_hash = ""
    while True:
        raw = content + str(index)
        hashed = md5(raw.encode()).hexdigest()

        # logger
        # if index % 20 == 0:
        #     output(index=index, raw=raw, hashed=hashed)

        if hashed.startswith("0" * 6):
            output(index=index, raw=raw, hashed=hashed)
            valid_hash = hashed
            break

        index += 1

    result = None

    if challenge['star'] == Star.FIRST:
        result = index
    elif challenge['star'] == Star.SECOND:
        result = valid_hash

    return result


if __name__ == "__main__":
    main()
