"""
Advent of Code 2015 CLI utilities
"""

# filesystem
from os.path import dirname, join


def pad(day: int, zeros: int = 2) -> str:
    """The day padding"""
    return str(day).zfill(zeros)


def get_basepath() -> str:
    """Gets the basepath for the project"""
    current_dir = dirname(__file__)

    return join(current_dir, "..")


def get_day_path(day: int) -> str:
    """Get the path of the day"""
    return join(get_basepath(), f"day_{pad(day)}")


def get_template_path() -> str:
    """Gets the path of the template"""
    return join(get_basepath(), "__template__")


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


def replace_content(filename: str, haystack: str, needle: str) -> None:
    """
    Replaces content in a file
    source: https://stackoverflow.com/questions/17140886/how-to-search-and-replace-text-in-a-file#answer-20593644
    """
    content = ""

    with open(filename, mode='r', encoding='utf-8') as file:
        content = file.readlines()

    with open(filename, mode='w+', encoding='utf-8') as file:
        file.writelines([line.replace(haystack, needle) for line in content])
