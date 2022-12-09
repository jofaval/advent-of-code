"""
Day 1
https://adventofcode.com/2015/day/1
"""

import os
from typing import TypedDict
from enum import Enum


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


challenge = AdventOfCodeChallenge(
    day=1,
    input=Input.PROD,
    star=Star.SECOND
)

print(challenge['input'].value)

current_dir = os.path.dirname(__file__)

data_path = os.path.join(
    current_dir, "data", f"{challenge['input'].value}.txt")

with open(data_path, encoding='utf-8') as reader:
    content = reader.read()


class Floor(Enum):
    UP = "("
    DOWN = ")"


floor = 0
dropped_at = None

for position, char in enumerate(content):
    if char == Floor.UP.value:
        floor += 1
    elif char == Floor.DOWN.value:
        floor -= 1

    if dropped_at is None and floor <= -1:
        dropped_at = position + 1

result = None

if challenge['star'] == Star.FIRST:
    result = floor
elif challenge['star'] == Star.SECOND:
    result = dropped_at

print("Result:", result)
