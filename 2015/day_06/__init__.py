"""
Day 6
https://adventofcode.com/2015/day/6
"""

# system
from os.path import join
import re
# types
from enum import Enum
from typing import List, Tuple, TypedDict
# vectorization
import numpy as np
# plotters
import matplotlib.pyplot as plt
import seaborn as sns

# core
from ..core import Input, Star, read, AdventOfCodeChallenge, result_wrapper, benchmark, get_day_path


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
def main(
    # This will generate an image if True, if you want one
    with_image: bool = False
) -> None:
    """Main flow of execution"""
    challenge = AdventOfCodeChallenge(
        day=6,
        input=Input.PROD,
        star=Star.SECOND
    )

    content = read(challenge)
    content = re.sub(r'\s$', '', content)

    rows, cols = (1_000, 1_000)
    grid = generate_grid(rows, cols, initial_lit_status=False)

    instructions = parse_instructions(content.split("\n"))
    grid = evaluate_instructions(
        grid, instructions, actual_translation=challenge['star'] == Star.SECOND
    )

    if with_image and challenge['star'] == Star.SECOND:
        generate_image(grid)

    return count_lit_lights(grid)


def generate_image(grid: TGrid) -> None:
    """Generates an image for the given grid"""
    plt.figure(figsize=(20, 20))
    axes = sns.heatmap(
        grid,
        center=0,  # saturates the color if commented
        yticklabels=False,
        xticklabels=False,
        cbar=False,
        square=True,

    )
    axes.tick_params(bottom=False, left=False)
    axes.get_figure().savefig(
        join(get_day_path(6), 'output.png'), dpi=400
    )


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


# lit status
UNLIT = -1
LIT_OFF = 0
LIT_ON = 1
ULTRA_LIT_ON = 2


ActualTranslationDict = {
    ActionEnum.TURN_OFF.value: UNLIT,
    ActionEnum.TURN_ON.value: LIT_ON,
    ActionEnum.TOGGLE.value: ULTRA_LIT_ON,
}

WrongTranslationDict = {
    ActionEnum.TURN_OFF.value: LIT_OFF,
    ActionEnum.TURN_ON.value: LIT_ON,
}


def evaluate_instructions(
    grid: TGrid,
    instructions: List[Instruction],
    actual_translation: bool = False
) -> TGrid:
    """Evaluate all of the instructions"""
    for ins in instructions:
        s_x, s_y = ins['start_range']
        e_x, e_y = ins['end_range']
        action = ins['action']

        target_range = grid[s_x:(e_x + 1), s_y:(e_y + 1)]

        if actual_translation:
            target_range += ActualTranslationDict[action]
        elif action == ActionEnum.TOGGLE.value:
            target_range[target_range == LIT_ON] = UNLIT
            target_range[target_range == LIT_OFF] = LIT_ON
            target_range[target_range == UNLIT] = LIT_OFF
        else:
            target_range[True] = WrongTranslationDict[action]

        if actual_translation and action == ActionEnum.TURN_OFF.value:
            # each light can have a brightness of zero or more, only positives
            target_range[target_range < 0] = LIT_OFF

    return grid


def generate_grid(rows: int, cols: int, initial_lit_status: bool = False) -> TGrid:
    """Generates a grid of the given size"""
    grid = np.zeros(shape=(rows, cols))

    if initial_lit_status:
        grid += LIT_ON

    return grid


if __name__ == "__main__":
    main()
