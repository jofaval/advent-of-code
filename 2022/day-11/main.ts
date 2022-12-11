import {
  BENCHMARK_ID,
  MainProps,
  readInput,
  DOUBLE_JUMP_LINE,
  JUMP_LINE,
  SPACE,
  ascending,
  logDebug,
  setDebug,
  mulReducer,
  sortArray,
} from "../__core__";

type MonkeyOperationOperand = "+" | "-" | "*" | "/";

type MonkeyOperation = {
  first: number;
  operand: MonkeyOperationOperand;
  second: number;
};

type MonkeyTestCondition = {
  operation: "divisible";
  by: number;
};

type MonkeyTest = {
  condition: MonkeyTestCondition;
  whenTrueThrowTo: number;
  whenFalseThrowTo: number;
};

type Monkey = {
  id: number;
  items: number[];
  operation: MonkeyOperation;
  test: MonkeyTest;
};

type MonkeysMap = Map<number, Monkey>;

const OLD_OPERATION = -1;
const NUMBERS_REGEX = /\d+/g;

function parseMonkey(lines: string): Monkey {
  const monkey: Monkey = {
    id: 0,
    items: [],
    operation: {
      first: 0,
      operand: "+",
      second: 0,
    },
    test: {
      whenTrueThrowTo: 0,
      whenFalseThrowTo: 0,
      condition: {
        operation: "divisible",
        by: 0,
      },
    },
  };

  lines.split(JUMP_LINE).forEach((line, index) => {
    switch (index) {
      case 0:
        monkey.id = Number(line.match(NUMBERS_REGEX)[0]);
        break;
      case 1:
        monkey.items = line.match(NUMBERS_REGEX).map(Number);
        break;
      case 2:
        const splitted = line.split(SPACE);

        let second = splitted.at(-1);
        if (second === "old") {
          second = OLD_OPERATION.toString();
        }

        monkey.operation = {
          ...monkey.operation,
          operand: splitted.at(-2) as MonkeyOperationOperand,
          second: Number(second),
        };
        break;
      case 3:
        monkey.test.condition.by = Number(line.match(NUMBERS_REGEX)[0]);
        break;
      case 4:
        monkey.test.whenTrueThrowTo = Number(line.match(NUMBERS_REGEX)[0]);
        break;
      case 5:
        monkey.test.whenFalseThrowTo = Number(line.match(NUMBERS_REGEX)[0]);
        break;
    }
  });

  return monkey;
}

function parseInput(content: string): MonkeysMap {
  const monkeys = content.split(DOUBLE_JUMP_LINE).map(parseMonkey);
  return new Map(monkeys.map((monkey) => [monkey.id, monkey]));
}

function getNewWorryLevel(monkey: Monkey) {
  const { operand, second } = monkey.operation;

  return (worryLevel: number) => {
    let newWorryLevel = worryLevel;
    const secondNumber = second === OLD_OPERATION ? worryLevel : second;

    switch (operand) {
      case "+":
        newWorryLevel = worryLevel + secondNumber;
        break;
      case "*":
        newWorryLevel = worryLevel * secondNumber;
        break;
      case "-":
        newWorryLevel = worryLevel - secondNumber;
        break;
      case "/":
        newWorryLevel = worryLevel / secondNumber;
        break;
    }

    return Math.floor(newWorryLevel / 3);
  };
}

function displayMonkeys(monkeys: MonkeysMap): void {
  monkeys.forEach(({ items }, id) => {
    logDebug(`Monkey ${id}: ${items.join(", ")}`);
  });
}

type GetMonkeyBussinessProps = {
  monkeys: MonkeysMap;
  rounds?: number;
  mostActive?: number;
};

function getMonkeyToThrowAt(monkey: Monkey, item: number): number {
  const condition = item % monkey.test.condition.by === 0;

  const monkeyId = condition
    ? monkey.test.whenTrueThrowTo
    : monkey.test.whenFalseThrowTo;

  return monkeyId;
}

function getMonkeyBussiness({
  monkeys,
  rounds = 20,
  mostActive = 2,
}: GetMonkeyBussinessProps): number {
  const timesUsed = new Map<Monkey["id"], number>();

  for (let round = 0; round < rounds; round++) {
    // logDebug("round", round + 1, "starts");
    // displayMonkeys(monkeys);
    // logDebug("");

    monkeys.forEach((monkey, id, map) => {
      // logDebug("evaluating monkey with id:", id);
      if (!timesUsed.has(id)) {
        timesUsed.set(id, 0);
      }
      timesUsed.set(id, timesUsed.get(id) + monkey.items.length);

      monkey.items = monkey.items.map(getNewWorryLevel(monkey));
      // logDebug("items evaluated", monkey.items);

      const itemsLen = monkey.items.length - 1;

      const throwables: Record<number, number[]> = {};

      // reverse for-loop because we're deleting elements
      for (let itemIndex = itemsLen; itemIndex >= 0; itemIndex--) {
        // logDebug("preparing to throw items", monkey.items.length);
        const item = monkey.items[itemIndex];

        const monkeyId = getMonkeyToThrowAt(monkey, item);
        if (!(monkeyId in throwables)) {
          throwables[monkeyId] = [];
        }
        throwables[monkeyId] = [item, ...throwables[monkeyId]];

        monkey.items = monkey.items.filter((_, index) => index !== itemIndex);
      }

      // actually throw the items to the monkeys, at the end of the stack (by/in order)
      Object.entries(throwables).map(([monkeyId, items]) => {
        map.get(Number(monkeyId)).items.push(...items);
      });

      // logDebug("");
    });

    logDebug("round", round + 1, "ends");
    displayMonkeys(monkeys);
    logDebug("");
  }

  return sortArray<number>({
    array: [...timesUsed.values()],
    isDescending: true,
  })
    .slice(0, mostActive)
    .reduce(mulReducer, 1);
}

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });
  setDebug(type === "example");

  const monkeys = parseInput(content);

  switch (star) {
    case "first":
      return getMonkeyBussiness({ monkeys, rounds: 20 });
    case "second":
      return monkeys;
  }
}

// entrypoint
(() => {
  console.time(BENCHMARK_ID);

  const result = main({ star: "first", day: 11, type: "test" });
  console.log({ result });

  console.timeEnd(BENCHMARK_ID);
})();
