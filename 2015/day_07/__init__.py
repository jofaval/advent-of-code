"""
Day 7
https://adventofcode.com/2015/day/7
"""

import re

# core
from ..core import (AdventOfCodeChallenge, Input, Star, benchmark, read,
                    result_wrapper)

POINTER_SEPARATOR = " -> "
DEBUG = True


def is_numeric(value: str) -> bool:
    return re.search(r"\d+", value) is not None


def evaluate_operation(operation: str, first: int, second: int = None):
    """bitwise operations"""
    if DEBUG:
        print({"first": first, "second": second})
    if operation == "AND":
        return first & second
    elif operation == "LSHIFT":
        return first << second
    elif operation == "RSHIFT":
        return first >> second
    elif operation == "NOT":
        return ~(first << 16)
    elif operation == "OR":
        return first | second


def safe_evaluation(stash: dict, operation: str, first: int, second: int = None):
    """bitwise operations wrapper"""
    if DEBUG:
        print("safe_evaluation", {
            "operation": operation,
            "first": first,
            "second": second
        })

    first_value = None
    if is_numeric(first):
        first_value = int(first)
    else:
        first_value = stash[first]

    second_value = None
    if second is None:
        second_value = None
    elif is_numeric(second):
        second_value = int(second)
    else:
        second_value = stash[second]

    if DEBUG:
        print("[PARSED] safe_evaluation", {
            "first_value": first_value,
            "second_value": second_value
        })
    return evaluate_operation(operation, first_value, second_value)


@result_wrapper
@benchmark
def main() -> None:
    """Main flow of execution"""
    challenge = AdventOfCodeChallenge(
        day=7,
        input=Input.TEST,
        star=Star.FIRST
    )

    content = read(challenge)

    result = None
    stash = dict()

    if challenge['star'] == Star.FIRST:
        for line in content.split("\n"):
            operation, address = line.split(POINTER_SEPARATOR)
            if re.search(r"(\w+|\d+)\s\w+\s(\w+|\d+)", operation) is not None:
                first, action, second = operation.split(" ")
                if DEBUG:
                    print(first, action, second)
                stash[address] = safe_evaluation(stash, action, first, second)
            elif re.search(r"\w+\s(\w+|\d+)", operation) is not None:
                action, first = operation.split(" ")
                if DEBUG:
                    print(first, action)
                stash[address] = safe_evaluation(stash, action, first)
            else:
                value = operation
                stash[address] = int(value)

            if DEBUG:
                print(line)
                print(stash)
                print("")
    elif challenge['star'] == Star.SECOND:
        raise Exception(
            f"No result was prepared for the {Star.SECOND.value} star."
        )

    return stash


if __name__ == "__main__":
    main()
