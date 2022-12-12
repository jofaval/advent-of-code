"""
Day 6
https://adventofcode.com/2015/day/6
"""

# types
import numpy as np
from functools import wraps
import time
from enum import Enum
import re
from typing import List, Tuple, TypedDict
# system
from os.path import join, dirname, exists


def pad(day: int, zeros: int = 2) -> str:
    """The day padding"""
    return str(day).zfill(zeros)


class Star(Enum):
    """Type of star to evaluate"""
    FIRST = "first"
    SECOND = "second"


class Input(Enum):
    """Type of input to read from"""
    TEST = 'test'
    PROD = 'prod'


class AdventOfCodeChallenge(TypedDict):
    """Challenge details for each day"""
    day: int
    star: Star
    input: Input


def get_basepath() -> str:
    """Gets the basepath for the project"""
    current_dir = dirname(__file__)

    return join(current_dir, "..")


def get_day_path(day: int) -> str:
    """Gets the path for a given day"""
    return join(get_basepath(), f"day_{pad(day)}")


def read(challenge: AdventOfCodeChallenge) -> str:
    """Reads the input data for the challenge"""
    data_path = join(get_day_path(
        challenge['day']), "data", f"{challenge['input'].value}.txt"
    )
    if not exists(data_path):
        raise Exception(
            f"The {challenge['input'].value} file for {pad(challenge['day'])} was not found"
        )

    with open(data_path, encoding='utf-8') as reader:
        content = reader.read()

    if len(content.strip()) <= 0:
        raise Exception(
            f"The content file for {pad(challenge['day'])} is empty")

    return content


def benchmark(func):
    """
    @source: https://dev.to/kcdchennai/python-decorator-to-measure-execution-time-54hk
    """
    @wraps(func)
    def timeit_wrapper(*args, **kwargs):
        start_time = time.perf_counter()

        result = func(*args, **kwargs)

        end_time = time.perf_counter()
        total_time = end_time - start_time

        miliseconds = total_time * 1_000

        print(f'Function "{func.__name__}" took {miliseconds:.4f} ms')
        return result
    return timeit_wrapper


def result_wrapper(func):
    """
    @source: https://dev.to/kcdchennai/python-decorator-to-measure-execution-time-54hk
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)

        print("\n" + "Result: ", result)
        return result
    return wrapper


class ActionEnum(Enum):
    """The enum for the actions"""
    TURN_ON = "turn on"
    TURN_OFF = "turn off"
    TOGGLE = "toggle"


Range = Tuple[int]


class Instruction(TypedDict):
    """An instruction for the lights"""
    start_range: Range
    action: ActionEnum
    end_range: Range


TGrid = np.ndarray


@result_wrapper
@benchmark
def main() -> None:
    """Main flow of execution"""
    challenge = AdventOfCodeChallenge(
        day=6,
        input=Input.PROD,
        star=Star.FIRST
    )

    content = read(challenge)
    content = re.sub(r'\s$', '', content)

    rows, cols = (1_000, 1_000)
    grid = generate_grid(rows, cols, initial_lit_status=False)

    instructions = parse_instructions(content.split("\n"))
    grid = evaluate_instructions(
        grid, instructions, actual_translation=challenge['star'] == Star.SECOND
    )

    return count_lit_lights(grid)


def count_lit_lights(grid: TGrid) -> int:
    """Counts how many lights are lit"""
    return int(grid.sum())


def parse_instructions(raw: List[str], delimiter: str = " ") -> List[Instruction]:
    """Parses the raw instructions"""
    instructions = []

    for line in raw:
        splitted = line.split(delimiter)
        instructions.append(Instruction(
            action=delimiter.join(splitted[:-3]),
            start_range=[int(n) for n in splitted[-3].split(",")],
            end_range=[int(n) for n in splitted[-1].split(",")]
        ))

    return instructions


UNLIT = -1
LIT_OFF = 0
LIT_ON = 1
ULTRA_LIT_ON = 2


def traditionally_toggle_lights(grid: TGrid, start: Range, end: Range) -> TGrid:
    """Traditionally toggle all of the lights"""
    wanted_range = grid[start[0]:end[0]+1, start[1]:end[1] + 1]

    # could be optimized by not using an aux instruction
    wanted_range *= UNLIT
    wanted_range[wanted_range == LIT_OFF] = LIT_ON
    wanted_range[wanted_range == UNLIT] = LIT_OFF

    return grid


def evaluate_instructions(grid: TGrid, instructions: List[Instruction], actual_translation: bool = False) -> TGrid:
    """Evaluate all of the instructions"""
    for ins in instructions:
        s_x, s_y = ins['start_range']
        e_x, e_y = ins['end_range']
        action = ins['action']

        # each light can have a brightness of zero or more, only positives
        grid = np.maximum(grid, 0)

        if actual_translation:
            value = LIT_OFF

            if action == ActionEnum.TURN_OFF.value:
                value = UNLIT
            elif action == ActionEnum.TURN_ON.value:
                value = LIT_ON
            elif action == ActionEnum.TOGGLE.value:
                value = ULTRA_LIT_ON

            grid[s_x:e_x+1, s_y:e_y+1] += value
            continue

        if action == ActionEnum.TOGGLE.value:
            grid = traditionally_toggle_lights(
                grid, ins['start_range'], ins['end_range']
            )
        else:
            value = LIT_OFF

            if action == ActionEnum.TURN_OFF.value:
                value = LIT_OFF
            elif action == ActionEnum.TURN_ON.value:
                value = LIT_ON

            grid[s_x:e_x+1, s_y:e_y+1] = value

    # each light can have a brightness of zero or more, only positives
    grid = np.maximum(grid, 0)

    return grid


def generate_grid(rows: int, cols: int, initial_lit_status: bool = False) -> TGrid:
    """Generates a grid of the given size"""
    grid = np.zeros(shape=(rows, cols))

    if initial_lit_status:
        grid += LIT_ON

    return grid


if __name__ == "__main__":
    main()
