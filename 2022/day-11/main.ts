import {
  BENCHMARK_ID,
  MainProps,
  readInput,
  DOUBLE_JUMP_LINE,
  JUMP_LINE,
  SPACE,
  logDebug,
  setDebug,
  sortArray,
  mulReducer,
} from "../__core__";

type MonkeyOperationOperand = "+" | "-" | "*" | "/";

type MonkeyOperation = {
  operand: MonkeyOperationOperand;
  operator: number | "old";
};

type MonkeyTest = {
  by: number;
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

const NUMBERS_REGEX = /\d+/g;

function parseMonkey(lines: string): Monkey {
  const monkey: Monkey = {
    id: 0,
    items: [],
    operation: {
      operand: "+",
      operator: 0,
    },
    test: {
      by: 0,
      whenTrueThrowTo: 0,
      whenFalseThrowTo: 0,
    },
  };

  const splittedLines = lines.split(JUMP_LINE);

  // Monkey ID
  monkey.id = Number(splittedLines[0].match(NUMBERS_REGEX)[0]);
  // Items
  monkey.items = splittedLines[1].match(NUMBERS_REGEX).map(Number);
  // Operation
  const splitted = splittedLines[2].split(SPACE);
  const operator = splitted.at(-1);
  monkey.operation = {
    operand: splitted.at(-2) as MonkeyOperationOperand,
    operator: operator !== "old" ? Number(operator) : operator,
  };
  // Test, divide by
  monkey.test.by = Number(splittedLines[3].match(NUMBERS_REGEX)[0]);
  // If true
  monkey.test.whenTrueThrowTo = Number(
    splittedLines[4].match(NUMBERS_REGEX)[0]
  );
  // If false
  monkey.test.whenFalseThrowTo = Number(
    splittedLines[5].match(NUMBERS_REGEX)[0]
  );

  return monkey;
}

function parseInput(content: string): MonkeysMap {
  const monkeys = content.split(DOUBLE_JUMP_LINE).map(parseMonkey);
  return new Map(monkeys.map((monkey) => [monkey.id, monkey]));
}

const RELEIEVED_BY = 3;

function getNewWorryLevel(
  monkey: Monkey,
  worryLevel: number,
  areYouRelievedAfterThrow: boolean
) {
  const { operand, operator } = monkey.operation;

  let newWorryLevel = eval(
    `${worryLevel} ${operand} ${operator === "old" ? worryLevel : operator}`
  );
  if (areYouRelievedAfterThrow) {
    newWorryLevel = newWorryLevel / RELEIEVED_BY;
  }

  return Math.floor(newWorryLevel);
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
  areYouRelievedAfterThrow: boolean;
};

function getMonkeyToThrowAt(monkey: Monkey, item: number): number {
  const condition = item % monkey.test.by === 0;

  const monkeyId = condition
    ? monkey.test.whenTrueThrowTo
    : monkey.test.whenFalseThrowTo;

  return monkeyId;
}

function getMonkeyBussiness({
  monkeys,
  rounds = 20,
  mostActive = 2,
  areYouRelievedAfterThrow,
}: GetMonkeyBussinessProps): number {
  const timesUsed = new Map<Monkey["id"], number>();
  monkeys.forEach((_, id) => timesUsed.set(id, 0));

  // Got it from: https://github.com/Fadi88/AoC/blob/master/2022/day11/code.py
  // I did not even had the slightest idea this was what was missing
  const divisors = [...monkeys.values()].map(({ test: { by } }) => by);
  const commonDivisor = divisors.reduce(mulReducer, 1);

  for (let round = 0; round < rounds; round++) {
    // logDebug("round", round + 1, "starts");
    // displayMonkeys(monkeys);
    // logDebug("");

    monkeys.forEach((monkey, id, map) => {
      // logDebug("evaluating monkey with id:", id);
      if (!monkey.items.length) {
        return;
      }

      const throwables: Record<Monkey["id"], number[]> = {};

      let item: number;
      while ((item = monkey.items.shift())) {
        item = getNewWorryLevel(monkey, item, areYouRelievedAfterThrow);
        const monkeyId = getMonkeyToThrowAt(monkey, item);

        if (!(monkeyId in throwables)) {
          throwables[monkeyId] = [];
        }
        throwables[monkeyId].push(item % commonDivisor);

        timesUsed.set(id, timesUsed.get(id) + 1);
      }

      // actually throw the items to the monkeys, at the end of the stack (by/in order)
      Object.entries(throwables).map(([monkeyId, items]) => {
        map.get(Number(monkeyId)).items.push(...items);
      });

      // logDebug("");
    });

    if (areYouRelievedAfterThrow) {
      logDebug("round", round + 1, "ends");
      displayMonkeys(monkeys);
      logDebug();
    } else {
      logDebug(`== After round ${round + 1} ==`);
      timesUsed.forEach((times, id) => {
        logDebug("Monkey", id, "inspected items", times, "times.");
      });
      logDebug();
    }
  }

  let mostActiveMonkeys = sortArray({
    array: [...timesUsed.values()],
    isDescending: true,
  });

  return mostActiveMonkeys.slice(0, mostActive).reduce(mulReducer, 1);
}

const Rounds = {
  first: 20,
  second: 10_000,
} as const;

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });
  setDebug(type === "example");

  const monkeys = parseInput(content);

  return getMonkeyBussiness({
    monkeys,
    rounds: Rounds[star],
    areYouRelievedAfterThrow: star === "first",
  });
}

// entrypoint
(() => {
  console.time(BENCHMARK_ID);

  const result = main({ star: "second", day: 11, type: "test" });
  console.log({ result });

  console.timeEnd(BENCHMARK_ID);
})();
