"""
Advent of Code 2015 CLI utilities
"""
from os.path import dirname, join


def pad(day: int, zeros: int = 2) -> str:
    """The day padding"""
    return str(day).zfill(zeros)


def get_basepath() -> str:
    """Gets the basepath for the project"""
    current_dir = dirname(__file__)

    return join(current_dir, "..")


def import_from(module_name, name):
    """Dynamically imports an element from a module"""
    print(f'Loading "{module_name}"...')
    module = __import__(module_name, fromlist=[name])
    print(f'Loaded "{module_name}"!!')
    print()

    print(f'Loading "{name}" from "{module_name}"...')
    attr = getattr(module, name)
    print(f'Loaded "{name}"!!')
    print()

    return attr
