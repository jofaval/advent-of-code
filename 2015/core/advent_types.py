"""
Advent of Code Types
"""

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
