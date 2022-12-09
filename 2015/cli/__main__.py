"""
Advent of Code 2015 CLI
"""

from argparse import ArgumentParser

from .utils import get_basepath


def create(day: int) -> None:
    """Creates a challenge"""
    print(f"Attempting to create day {day}")


def run(day: int) -> None:
    """Runs a challenge"""
    print(f"Attempting to execute day {day}")

    get_basepath()


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
    args = prepare_arg().parse_args()

    action = args.action

    if action == "create":
        create(args.day)
    elif action == "run":
        run(args.day)


if __name__ == "__main__":
    main()
