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

    def get_memory_string(self, encode: bool) -> str:
        mutable = ""
        if encode:
            mutable = repr(self.raw)
            mutable = "\""+mutable+"\""
        else:
            mutable = eval(self.raw)

        print({"line": self.raw, "mutable": mutable,
              "len": [len(self.raw), len(mutable)]})

        return mutable

    def evaluate(self, encode: bool):
        self.code_len = len(self.raw)
        # https://www.reddit.com/r/adventofcode/comments/3vw32y/comment/cxrad1k/?utm_source=share&utm_medium=web2x&context=3
        self.in_memory_len = 2+self.raw.count('\\')+self.raw.count(
            '"') if encode else len(self.get_memory_string(encode))

        return self


@result_wrapper
@benchmark
def main() -> None:
    """Main flow of execution"""
    challenge = AdventOfCodeChallenge(
        day=8,
        input=Input.PROD,
        star=Star.SECOND
    )

    content = read(challenge)

    lines: List[Line] = []
    is_second_star = challenge['star'] == Star.SECOND
    for raw_line in content.splitlines():
        line = Line(raw=raw_line)
        line.evaluate(is_second_star)

        lines.append(line)

    result = None

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

    if is_second_star:
        result = total_in_memory_characters
    else:
        result = total_code_characters - total_in_memory_characters

    return result


if __name__ == "__main__":
    main()
