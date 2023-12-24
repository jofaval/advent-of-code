"""
Day 8
https://adventofcode.com/2015/day/8
"""

import re
# core
from typing import List

from pydantic import BaseModel

from ..core import (AdventOfCodeChallenge, Input, Star, benchmark, read,
                    result_wrapper)


class Line(BaseModel):
    raw: str
    code_len: int = 0
    in_memory_len: int = 0

    def get_memory_string(self) -> str:
        mutable = eval(self.raw)

        return mutable

    def evaluate(self):
        self.code_len = len(self.raw)
        self.in_memory_len = len(self.get_memory_string())

        return self


@result_wrapper
@benchmark
def main() -> None:
    """Main flow of execution"""
    challenge = AdventOfCodeChallenge(
        day=8,
        input=Input.PROD,
        star=Star.FIRST
    )

    content = read(challenge)

    lines: List[Line] = []
    for raw_line in content.splitlines():
        line = Line(raw=raw_line)
        line.evaluate()

        lines.append(line)

    result = None

    if challenge['star'] == Star.FIRST:
        total_code_characters = 0
        total_in_memory_characters = 0

        for line in lines:
            total_code_characters += line.code_len
            total_in_memory_characters += line.in_memory_len

        print("")
        print({
            "total_code_characters": total_code_characters,
            "total_in_memory_characters": total_in_memory_characters,
        })
        result = total_code_characters - total_in_memory_characters
    elif challenge['star'] == Star.SECOND:
        raise Exception(
            f"No result was prepared for the {Star.SECOND.value} star."
        )

    return result


if __name__ == "__main__":
    main()
