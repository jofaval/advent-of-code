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

# Escapes
BACKLASH = re.compile(r"\\\\")
DOUBLE_QUOTE = re.compile(r"\\\"")
HEXADECIMAL = re.compile(r"\\x\d{1,2}")

# MERGED = re.compile(r"("+BACKLASH+"|"+DOUBLE_QUOTE+"|"+HEXADECIMAL+")+")

DEBUG = {
    "CONDITIONS": False,
    "ITERATION_LINE": True
}


def is_hexadecimal(char: str) -> bool:
    return re.match(r"(\d|[a-f])", char) is not None


MAGIC_CHARACTERS = ["\"", "\\"]
HEX_CHAR = "§"


class Line(BaseModel):
    raw: str
    code_len: int = 0
    in_memory_len: int = 0

    def get_memory_string(self) -> str:
        mutable = ""

        was_last_char_hex = False
        was_last_char_bar = False

        hex_stack = []

        for char in self.raw[1:-1]:
            if DEBUG["CONDITIONS"]:
                print(char)
            if was_last_char_hex:
                if DEBUG["CONDITIONS"]:
                    print("if was_last_char_hex")
                if is_hexadecimal(char):
                    if DEBUG["CONDITIONS"]:
                        print("if is_hexadecimal(char):")
                    if len(hex_stack) < 1:
                        if DEBUG["CONDITIONS"]:
                            print('if len(hex_stack) < 1:')
                        hex_stack.append(char)
                    else:
                        if DEBUG["CONDITIONS"]:
                            print('else not len(hex_stack) < 1:')
                        mutable += HEX_CHAR
                        was_last_char_hex = False
                        hex_stack.clear()
                elif len(hex_stack) == 0:
                    if DEBUG["CONDITIONS"]:
                        print('elif len(hex_stack) == 0:')
                    mutable += "\\x" + char
                    was_last_char_hex = False
                else:
                    mutable += HEX_CHAR + char
                    hex_stack.clear()
            elif was_last_char_bar:
                if DEBUG["CONDITIONS"]:
                    print("elif was_last_char_bar")
                if char in MAGIC_CHARACTERS:
                    if DEBUG["CONDITIONS"]:
                        print('if char in MAGIC_CHARACTERS:')
                    mutable += char
                elif char == "x":
                    if DEBUG["CONDITIONS"]:
                        print('elif char == "x":')
                    was_last_char_hex = True
                else:
                    if DEBUG["CONDITIONS"]:
                        print('else:')
                    mutable += char
            elif char != "\\":
                if DEBUG["CONDITIONS"]:
                    print('elif char != "\\":')
                mutable += char
            else:
                if DEBUG["CONDITIONS"]:
                    print('is a bar')

            if DEBUG["CONDITIONS"]:
                print("")
            was_last_char_bar = char == "\\"

        if was_last_char_hex and len(hex_stack) != 0:
            if DEBUG["CONDITIONS"]:
                print("if was_last_char_hex and len(hex_stack) != 0:")
            mutable += HEX_CHAR

        if DEBUG["ITERATION_LINE"]:
            print({
                "raw": self.raw,
                "mutable": mutable,
            })

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

    lines: List[Line] = [
        # Line(raw='"a\\\\a"').evaluate()
        # Line(raw='"\\x27"').evaluate()
        Line(raw='"qludrkkvljljd\\\\xvdeum\\x4e"').evaluate()
    ]
    # for raw_line in content.splitlines():
    #     line = Line(raw=raw_line)
    #     line.evaluate()

    #     lines.append(line)

    result = None

    if challenge['star'] == Star.FIRST:
        total_code_characters = 0
        total_in_memory_characters = 0

        for line in lines:
            if DEBUG["ITERATION_LINE"]:
                print({
                    "line": line.raw,
                    "code_len": line.code_len,
                    "in_memory_len": line.in_memory_len,
                })
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
