"""
Day 5
https://adventofcode.com/2015/day/5
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


@result_wrapper
@benchmark
def main() -> None:
    """Main flow of execution"""
    challenge = AdventOfCodeChallenge(
        day=5,
        input=Input.PROD,
        star=Star.SECOND
    )

    content = read(challenge)
    content = re.sub(r'\s$', '', content)

    nice_strings = 0

    is_naughty = None
    if challenge['star'] == Star.FIRST:
        is_naughty = is_naughty_old
    elif challenge['star'] == Star.SECOND:
        is_naughty = is_new_naughty

    for string in content.split("\n"):
        if not is_naughty(string):
            nice_strings += 1

    return nice_strings


def is_new_naughty(string: str, group_size: int = 3, pair_size: int = 2) -> bool:
    """Checks if a string is naughty by the new rules"""
    prev_chars = []
    has_pair, has_group = False, False
    pairs = set()

    for index, char in enumerate(string):
        prev_chars.append(char)

        # slices the array(list)
        prev_chars = prev_chars[-group_size:]

        # checks for a repetting letter with a single letter in between
        if not has_group and len(prev_chars) == group_size:
            has_group = char == prev_chars[0]

        # checks for a pair
        if not has_pair and len(prev_chars) >= pair_size:
            pair = tuple(prev_chars[-2:])

            overlapping = pair[0] == pair[1] and (
                index >= pair_size
                and string[index - (pair_size + 1)] != pair[0]
            ) and (
                index + 1 < len(string) - 1
                and string[index + 1] != pair[1]
            )

            has_pair = not overlapping and pair in pairs
            pairs.add(pair)

        if has_pair and has_group:
            break

    print(
        string,
        has_pair and has_group,
        {"has_pair": int(has_pair), "has_group": int(has_group)},
    )
    return not has_pair or not has_group


def is_naughty_old(string: str) -> bool:
    """Checks if a string is naughty by the old rules"""
    naughty_substrings = ["ab", "cd", "pq", "xy"]

    contains_naughty = contains_naughty_substrings(
        naughty_substrings, string
    )

    not_enough_vowels = does_not_contain_n_vowels(string)

    does_not_repeat = does_not_repeat_twice_in_a_row(string)

    print(
        string, {
            "contains_naughty": contains_naughty,
            "not_enough_vowels": not_enough_vowels,
            "does_not_repeat": does_not_repeat,
        }
    )

    return contains_naughty or not_enough_vowels or does_not_repeat


def does_not_repeat_twice_in_a_row(string: str) -> bool:
    """Checks if a character doesn't repeat itself in a row"""
    prev_char = ""
    for char in string:
        if char == prev_char:
            return False
        prev_char = char

    return True


def does_not_contain_n_vowels(string: str, min_vowels: int = 3) -> bool:
    """Checks if it doesn't contain the expected amount of vowels"""
    vowels = re.findall(r'(a|e|i|o|u)', string)
    return len(vowels) < min_vowels


def contains_naughty_substrings(naughty_substrings: List[str], string: str) -> bool:
    """Check if it contains any of the prohibited substrings"""
    for candidate in naughty_substrings:
        if candidate in string:
            return True

    return False


if __name__ == "__main__":
    main()
