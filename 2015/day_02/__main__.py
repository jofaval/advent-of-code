"""
Day 1
https://adventofcode.com/2015/day/1
"""

# types
from functools import wraps
import time
from enum import Enum
import re
from typing import List, TypedDict
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


@benchmark
def result_wrapper(func):
    """
    @source: https://dev.to/kcdchennai/python-decorator-to-measure-execution-time-54hk
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)

        print("Result: ", result)
        return result
    return wrapper


class Floor(Enum):
    UP = "("
    DOWN = ")"


def calc_surface(*areas: List[int]) -> int:
    """Calculates the area of a right rectangular prism"""
    return sum((2 * area for area in areas))


@result_wrapper
def main() -> None:
    """Main flow of execution"""
    challenge = AdventOfCodeChallenge(
        day=2,
        input=Input.PROD,
        star=Star.FIRST
    )

    content = read(challenge)
    content = re.sub(r'\s$', '', content)
    content = content.split("\n")

    total_square_feet = 0

    for line in content:
        [length, width, height] = line.split("x")
        [length, width, height] = [int(length), int(width), int(height)]

        areas = [length*width, width*height, height*length]
        surface = calc_surface(*areas)

        square_feet = surface + min(areas)

        total_square_feet += square_feet

    result = None

    if challenge['star'] == Star.FIRST:
        result = total_square_feet
    elif challenge['star'] == Star.SECOND:
        result = total_square_feet

    return result


if __name__ == "__main__":
    main()
