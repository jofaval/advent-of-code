"""
Day 7
https://adventofcode.com/2015/day/7
"""

import re
from typing import List

# core
from ..core import (AdventOfCodeChallenge, Input, Star, benchmark, read,
                    result_wrapper)

POINTER_SEPARATOR = " -> "
DEBUG = True


def is_numeric(value: str) -> bool:
    return re.search(r"\d+", value) is not None


def bitwise_uint16_and(first, second):
    """bitwise uint16 AND implementation"""
    return [
        int(first_value == 1 and second[i] == 1)
        for i, first_value in enumerate(first)
    ]


def bitwise_uint16_lshift(first, second: int):
    """inefficient bitwise uint16 LSHIFT implementation"""
    result = [*first]

    for _ in range(0, second):
        result = [*result[1:], 0]

    return result


def bitwise_uint16_rshift(first, second: int):
    """inefficient bitwise uint16 RSHIFT implementation"""
    result = [*first]

    for _ in range(0, second):
        result.pop()
        result = [0, *result[:-1]]

    return result


def bitwise_uint16_not(first):
    """bitwise uint16 NOT implementation"""
    return [1 if value == 0 else 0 for value in first]


def bitwise_uint16_or(first, second):
    """bitwise uint16 OR implementation"""
    return [
        int(first_value == 1 or second[i] == 1)
        for i, first_value in enumerate(first)
    ]


def evaluate_operation(operation: str, first: int, second: int = None):
    """bitwise operations"""
    if DEBUG:
        print({"first": first, "second": second})
    if operation == "AND":
        return bitwise_uint16_and(first, second)
    elif operation == "LSHIFT":
        return bitwise_uint16_lshift(first, second)
    elif operation == "RSHIFT":
        return bitwise_uint16_rshift(first, second)
    elif operation == "NOT":
        return bitwise_uint16_not(first)
    elif operation == "OR":
        return bitwise_uint16_or(first, second)


def to_uint16(number: int):
    """inefficient Python's uint16 implementation"""
    total = 0
    accumulative = []
    for i in range(0, 16):
        current = 2 ** (15 - i)
        if total + current <= number:
            accumulative.append(1)
            total += current
        else:
            accumulative.append(0)

    return accumulative


def from_uint16(uint16: List[int]):
    total = 0

    for i, n in enumerate(uint16):
        if n == 0:
            continue
        total += 2 ** (15 - i)

    return total


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
        input=Input.PROD,
        star=Star.FIRST
    )

    content = read(challenge)

    result = None
    stash = dict()

    try:
        if challenge['star'] == Star.FIRST:
            for line in content.split("\n"):
                operation, address = line.split(POINTER_SEPARATOR)
                if re.search(r"(\w+|\d+)\s\w+\s(\w+|\d+)", operation) is not None:
                    first, action, second = operation.split(" ")
                    if DEBUG:
                        print(first, action, second)
                    stash[address] = safe_evaluation(
                        stash, action, first, second)
                elif re.search(r"\w+\s(\w+|\d+)", operation) is not None:
                    action, first = operation.split(" ")
                    if DEBUG:
                        print(first, action)
                    stash[address] = safe_evaluation(stash, action, first)
                else:
                    value = operation
                    stash[address] = to_uint16(int(value))

                if DEBUG:
                    print(line)
                    print(stash)
                    print("")
        elif challenge['star'] == Star.SECOND:
            raise Exception(
                f"No result was prepared for the {Star.SECOND.value} star."
            )
    except Exception as error:
        print(error)

    parsed_stash = {
        key: from_uint16(value)
        for key, value in stash.items()
    }
    return parsed_stash


if __name__ == "__main__":
    main()
