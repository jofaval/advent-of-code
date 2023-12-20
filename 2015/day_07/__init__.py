"""
Day 7
https://adventofcode.com/2015/day/7
"""

import enum
import re
import traceback
from typing import Dict, List, Optional, Union

from pydantic import BaseModel

# core
from ..core import (AdventOfCodeChallenge, Input, Star, benchmark, read,
                    result_wrapper)

POINTER_SEPARATOR = " -> "
DEBUG = True


def is_numeric(value: str) -> bool:
    if value is None:
        return False

    return re.search(r"\d+", str(value)) is not None


def bitwise_uint16_and(first, second):
    """bitwise uint16 AND implementation"""
    return [
        int(first_value == 1 and second_value == 1)
        for first_value, second_value in zip(first, second)
    ]


def bitwise_uint16_lshift(first, second: int):
    """inefficient bitwise uint16 LSHIFT implementation"""
    result = list(first)

    for _ in range(0, second):
        result = result[1:]
        result.append(0)

    return result


def bitwise_uint16_rshift(first, second: int):
    """inefficient bitwise uint16 RSHIFT implementation"""
    result = list(first)

    for _ in range(0, second):
        aux = list(result)
        result = [0]
        result.extend(aux[:-1])

    return result


def bitwise_uint16_not(first):
    """bitwise uint16 NOT implementation"""
    return [1 if value == 0 else 0 for value in first]


def bitwise_uint16_or(first, second):
    """bitwise uint16 OR implementation"""
    return [
        int(first_value == 1 or second_value == 1)
        for first_value, second_value in zip(first, second)
    ]


class Action(enum.Enum):
    AND = "AND"
    LSHIFT = "LSHIFT"
    RSHIFT = "RSHIFT"
    NOT = "NOT"
    OR = "OR"
    SAVE = "SAVE"


def to_action_enum(action: str):
    if action == "AND":
        return Action.AND
    elif action == "LSHIFT":
        return Action.LSHIFT
    elif action == "RSHIFT":
        return Action.RSHIFT
    elif action == "NOT":
        return Action.NOT
    elif action == "OR":
        return Action.OR
    elif action == "SAVE":
        return Action.SAVE


def evaluate_action(action: str, first: int, second: int = None):
    """bitwise operations"""
    if DEBUG:
        print("evaluate action", {"first": first, "second": second})

    if action == Action.AND:
        return bitwise_uint16_and(first, second)
    elif action == Action.LSHIFT:
        return bitwise_uint16_lshift(first, second)
    elif action == Action.RSHIFT:
        return bitwise_uint16_rshift(first, second)
    elif action == Action.NOT:
        return bitwise_uint16_not(first)
    elif action == Action.OR:
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
    if uint16 is None:
        return total

    for i, n in enumerate(uint16):
        if n == 0:
            continue
        total += 2 ** (15 - i)

    return total


def safe_parse(value: str, action: Action):
    if action == Action.RSHIFT or action == Action.LSHIFT:
        return int(value)

    return to_uint16(int(value))


def safe_evaluation(stash: dict, action: Action, first: int, second: int = None):
    """bitwise operations wrapper"""
    if DEBUG:
        print("safe_evaluation", {
            "operation": action,
            "first": first,
            "second": second
        })

    first_value = None
    if is_numeric(first):
        first_value = safe_parse(value=first, action=action)
    else:
        first_value = stash[first]

    second_value = None
    if second is None:
        second_value = None
    elif is_numeric(second):
        second_value = safe_parse(value=second, action=action)
    else:
        second_value = stash[second]

    if DEBUG:
        print("[PARSED] safe_evaluation", {
            "first_value": first_value,
            "second_value": second_value
        })
    return evaluate_action(action, first_value, second_value)


class Operation(BaseModel):
    pointer: str
    first: Union[int, str]
    second: Union[int, str] = None
    action: Action
    executed: bool = False


COUNT = 0


class OperationStack:
    operations: List[Operation]
    stash: dict

    def __init__(self):
        self.operations = []
        self.stash = dict()

    def is_pointer_assigned(self, pointer: str):
        operation = self.get_by_pointer(pointer)
        if not operation:
            return False

        return operation.executed

    def execute(self, operation: Union[Operation, None]):
        if DEBUG:
            print("execution", operation)

        if not operation or operation.executed:
            return

        self.validate_pointer(operation.first)
        self.validate_pointer(operation.second)

        if operation.action == Action.SAVE:
            value = None

            if is_numeric(operation.first):
                value = to_uint16(int(operation.first))
            else:
                value = self.stash[operation.first]

            self.stash[operation.pointer] = value
            return

        # self.validate_pointer(operation.pointer)

        self.stash[operation.pointer] = safe_evaluation(
            stash=self.stash,
            action=operation.action,
            first=operation.first,
            second=operation.second
        )
        operation.executed = True

    def validate_pointer(self, pointer: str):
        operation = self.get_by_pointer(pointer)
        if pointer is None or is_numeric(pointer) or operation.executed:
            return

        self.execute(operation)

    def get_by_pointer(self, pointer: str):
        for operation in self.operations:
            if operation.pointer == pointer:
                return operation

        return None

    def get_by_first(self, first: Union[int, str]):
        for operation in self.operations:
            if operation.first == first:
                return operation

        return None

    def get_by_second(self, second: Union[int, str]):
        for operation in self.operations:
            if operation.second == second:
                return operation

        return None

    def parse_line(self, line: str):
        operation = None
        action, pointer = line.split(POINTER_SEPARATOR)

        if re.search(r"(\w+|\d+)\s\w+\s(\w+|\d+)", action) is not None:
            first, action, second = action.split(" ")
            if DEBUG:
                print(first, action, second)
            operation = Operation(
                first=first,
                second=second,
                action=to_action_enum(action),
                pointer=pointer
            )
        elif re.search(r"\w+\s(\w+|\d+)", action) is not None:
            action, first = action.split(" ")
            operation = Operation(
                first=first,
                action=to_action_enum(action),
                pointer=pointer
            )
        else:
            operation = Operation(
                first=action,
                action=Action.SAVE,
                pointer=pointer
            )

        if operation:
            self.operations.append(operation)

        if DEBUG:
            print(line)
            # print(self.stash)
            print("")

    def process(self):
        for operation in self.operations:
            if operation.executed:
                continue

            if DEBUG:
                print(operation)

            try:
                self.execute(operation)
            except Exception as e:
                print(traceback.format_exc())
            finally:
                if DEBUG:
                    print("")

    def reset(self, except_for: List[str] = None):
        for operation in self.operations:
            operation.executed = False

        print("before reset", self.stash)
        self.stash = {
            key: value
            for key, value in self.stash.items()
            if except_for is None or key in except_for
        }
        print("after reset", self.stash)

        for key in except_for:
            self.get_by_pointer(key).executed = True

    def rewire(self, instructions: Dict[str, List[str]]):
        for origin, targets in instructions.items():
            for target in targets:
                self.stash[target] = self.stash[origin]


@result_wrapper
@benchmark
def main() -> None:
    """Main flow of execution"""
    challenge = AdventOfCodeChallenge(
        day=7,
        input=Input.PROD,
        star=Star.SECOND
    )

    content = read(challenge)

    operation_stack = OperationStack()

    try:
        for line in content.split("\n"):
            operation_stack.parse_line(line)

        operation_stack.process()

        if challenge['star'] == Star.SECOND:
            operation_stack.rewire({"a": ["b"]})
            operation_stack.reset(except_for=["b"])
            operation_stack.process()
    except Exception as error:
        print(error)

    parsed_stash = {
        key: from_uint16(value)
        for key, value in operation_stack.stash.items()
    }
    return parsed_stash


if __name__ == "__main__":
    main()
