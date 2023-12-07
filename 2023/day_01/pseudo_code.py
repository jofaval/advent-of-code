import os
import re

PART_TWO = True

with open(os.path.join(os.path.dirname(__file__), "data", "prod.txt"), encoding="utf-8") as file:
    lines = filter(bool, file.readlines())

    numbers = []

    for line in lines:
        first_digit = None
        last_digit = None

        parsed_line = line

        if PART_TWO:
            parsed_line = (
                parsed_line.replace("one", "o1e")
                .replace("two", "t2o")
                .replace("three", "t3e")
                .replace("four", "f4r")
                .replace("five", "f5e")
                .replace("six", "s6x")
                .replace("seven", "s7n")
                .replace("eight", "e8t")
                .replace("nine", "n9e")
            )

        for character in parsed_line:
            if re.match(r"\d", character) is None:
                continue

            if first_digit is None:
                first_digit = character
                last_digit = character
            else:
                last_digit = character

        number = int(first_digit + last_digit)
        # print(line.replace("\n", ""), number)
        numbers.append(number)

    total = 0
    for n in numbers:
        total += n

    print(total)
