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
    star=Star.FIRST
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

for char in content:
    if char == Floor.UP.value:
        floor += 1
    elif char == Floor.DOWN.value:
        floor -= 1

print("Result:", floor)
