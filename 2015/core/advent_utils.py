"""
Advent of Code 2015 utils
"""


def pad(day: int, zeros: int = 2) -> str:
    """The day padding"""
    return str(day).zfill(zeros)
