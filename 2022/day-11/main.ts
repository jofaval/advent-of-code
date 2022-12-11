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

const RELEIEVED_BY = 3;

function getNewWorryLevel(
  monkey: Monkey,
  worryLevel: number,
  areYouRelievedAfterThrow: boolean
) {
  const { operand, second } = monkey.operation;

  let newWorryLevel = worryLevel;
  const secondNumber: number = second === OLD_OPERATION ? worryLevel : second;

  switch (operand) {
    case "+":
      newWorryLevel = worryLevel + secondNumber;
      break;
    case "*":
      newWorryLevel = worryLevel * secondNumber;
      break;
  }

  if (areYouRelievedAfterThrow) {
    newWorryLevel = newWorryLevel / RELEIEVED_BY;
  }

  return Math.round(newWorryLevel);
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
  const condition = item % monkey.test.condition.by === 0;

  const monkeyId = condition
    ? monkey.test.whenTrueThrowTo
    : monkey.test.whenFalseThrowTo;

  return monkeyId;
}

function evaluateMonkey(
  areYouRelievedAfterThrow: boolean,
  timesUsed: Map<number, number>
): (value: Monkey, key: number, map: Map<number, Monkey>) => void {
  return (monkey, id, map) => {
    // logDebug("evaluating monkey with id:", id);
    const throwables: Record<Monkey["id"], number[]> = {};

    let item: number;
    while ((item = monkey.items.shift())) {
      item = getNewWorryLevel(monkey, item, areYouRelievedAfterThrow);
      const monkeyId = getMonkeyToThrowAt(monkey, item);

      if (!(monkeyId in throwables)) {
        throwables[monkeyId] = [];
      }
      throwables[monkeyId].push(item);

      timesUsed.set(id, timesUsed.get(id) + 1);
    }

    // actually throw the items to the monkeys, at the end of the stack (by/in order)
    Object.entries(throwables).map(([monkeyId, items]) => {
      map.get(Number(monkeyId)).items.push(...items);
    });
  };
}

function getMonkeyBussiness({
  monkeys,
  rounds = 20,
  mostActive = 2,
  areYouRelievedAfterThrow,
}: GetMonkeyBussinessProps): BigInt {
  const timesUsed = new Map<Monkey["id"], number>();
  monkeys.forEach((_, id) => timesUsed.set(id, 0));

  for (let round = 0; round < rounds; round++) {
    // logDebug("round", round + 1, "starts");
    // displayMonkeys(monkeys);
    // logDebug("");

    monkeys.forEach(evaluateMonkey(areYouRelievedAfterThrow, timesUsed));

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

  console.log(mostActiveMonkeys);

  mostActiveMonkeys = mostActiveMonkeys.slice(0, mostActive);

  return BigInt(mostActiveMonkeys.reduce(mulReducer, 1));
}

const Rounds = {
  first: 20,
  // second: 10_000,
  second: 20,
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

  const result = main({ star: "second", day: 11, type: "example" });
  console.log({ result });

  console.timeEnd(BENCHMARK_ID);
})();
