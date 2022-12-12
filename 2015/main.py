"""
Advent of Code 2015
jofaval

https://github.com/advent-of-code/tree/master/2015
"""

from os.path import dirname


def get_basepath() -> str:
    """Gets the current basepath of the project"""
    return dirname(__file__)


def import_from(module, name):
    """Dynamically imports an element from a module"""
    module = __import__(module, fromlist=[name])
    return getattr(module, name)


def init() -> None:
    """Main entrypoint for the project"""
    cli_entrypoint = import_from('.cli', 'main')
    cli_entrypoint()


if __name__ == '__main__':
    init()
