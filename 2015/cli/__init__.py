"""
Advent of Code 2015 CLI
"""

# cli - args
from argparse import ArgumentParser
# filesystem
from distutils.dir_util import copy_tree
from os.path import join

from .utils import import_from, pad, get_day_path, get_template_path, replace_content

CHANGE_DAY_PLACEHOLDER = "__CHANGE_DAY__"


def create(day: int) -> None:
    """Creates a challenge"""
    print(f"Attempting to create day {day}")
    print()

    template = get_template_path()
    day_path = get_day_path(day)

    try:
        # copy template into the new day
        copy_tree(template, day_path)

        # replace the contents
        common = {"haystack": CHANGE_DAY_PLACEHOLDER, "needle": str(day)}
        replace_content(filename=join(day_path, "__init__.py"), **common)
        replace_content(filename=join(day_path, "run.sh"), **common)

        print(f'Day {day} successfully created')
    except Exception as err:
        print(f"Could not create the day \"{day}\"")
        print("Error:", err)


def run(day: int) -> None:
    """Runs a challenge"""
    print(f"Attempting to execute day {day}")
    print()

    try:
        day_main = import_from(f'.day_{pad(day)}', 'main')
        day_main()
    except KeyError:
        print(f'Day "{day}" was not found or does not export a "main" function.')


def prepare_arg() -> ArgumentParser:
    """Prepares the CLI"""
    parser = ArgumentParser()

    parser.add_argument(
        "-a", "--action",
        dest="action",
        default=None,
        help="Action to execute, must be \"create\" or \"run\"",
        choices=["create", "run"],
        required=True
    )

    parser.add_argument(
        "-d", "--day",
        dest="day",
        default=None,
        help="Runs a challenge",
        type=int,
        required=True
    )

    return parser


def main() -> None:
    """Main entrypoint for the CLI"""
    print('Executing the CLI')

    args = prepare_arg().parse_args()

    action = args.action

    if action == "create":
        create(args.day)
    elif action == "run":
        run(args.day)


if __name__ == "__main__":
    main()
