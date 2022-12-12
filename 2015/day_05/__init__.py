"""
Day 5
https://adventofcode.com/2015/day/5
"""

# types
import re
from typing import List

# core
from ..core import Input, Star, read, AdventOfCodeChallenge, result_wrapper, benchmark


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


def is_new_naughty(string: str) -> bool:
    """Checks if a string is naughty by the new rules"""
    # https://blog.jverkamp.com/2015/12/05/advent-of-code-day-5/
    return not (re.search(r'(..).*\1', string) and re.search(r'(.).\1', string))


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
