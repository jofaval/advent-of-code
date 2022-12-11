import {
  BENCHMARK_ID,
  MainProps,
  readInput,
  logger,
  DOUBLE_JUMP_LINE,
  JUMP_LINE,
  SPACE,
  ascending,
  logDebug,
  setDebug,
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

const INITIAL_MONKEY: Monkey = {
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

function parseMonkey(lines: string): Monkey {
  const monkey: Monkey = { ...INITIAL_MONKEY };

  lines.split(JUMP_LINE).forEach((line, index) => {
    switch (index) {
      case 0:
        monkey.id = parseInt(/\d/.exec(line)[0]);
        break;
      case 1:
        monkey.items = /\d/.exec(line).map(parseInt);
        break;
      case 2:
        const splitted = line.split(SPACE);
        monkey.operation = {
          ...monkey.operation,
          operand: splitted.at(-2) as MonkeyOperationOperand,
          second: parseInt(splitted.at(-1)),
        };
        break;
      case 3:
        monkey.test.condition.by = parseInt(/\d/.exec(line)[0]);
        break;
      case 4:
        monkey.test.whenTrueThrowTo = parseInt(/\d/.exec(line)[0]);
        break;
      case 5:
        monkey.test.whenTrueThrowTo = parseInt(/\d/.exec(line)[0]);
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

    switch (operand) {
      case "+":
        newWorryLevel = worryLevel + second;
        break;
      case "*":
        newWorryLevel = worryLevel * second;
        break;
      case "-":
        newWorryLevel = worryLevel - second;
        break;
      case "/":
        newWorryLevel = worryLevel / second;
        break;
    }

    return Math.round(newWorryLevel / 3);
  };
}

function displayMonkeys(monkeys: MonkeysMap): void {
  monkeys.forEach(({ items }, id) => {
    logDebug(`Monkey ${id}: ${items.join(", ")}`);
  });
}

function getMonkeyBussiness(
  monkeys: MonkeysMap,
  rounds: number = 20,
  mostActive: number = 2
): number {
  const timesUsed = new Map<Monkey["id"], number>();

  for (let round = 0; round < rounds; round++) {
    logDebug("round", round + 1, "starts");

    monkeys.forEach((monkey, id, map) => {
      // logDebug("evaluating monkey with id:", id);
      if (!timesUsed.has(id)) {
        timesUsed.set(id, 0);
      }
      timesUsed.set(id, timesUsed.get(id) + monkey.items.length);

      monkey.items = monkey.items.map(getNewWorryLevel(monkey));
      // logDebug("items evaluated", monkey.items.length);

      const itemsLen = monkey.items.length - 1;
      for (let itemIndex = itemsLen; itemIndex >= 0; itemIndex--) {
        // logDebug("preparing to throw items", monkey.items.length);

        const item = monkey.items[itemIndex];
        const condition = item % monkey.test.condition.by === 0;

        const monkeyId = condition
          ? monkey.test.whenTrueThrowTo
          : monkey.test.whenFalseThrowTo;

        map.get(monkeyId).items.push(item);
        monkey.items = monkey.items.filter((_, index) => index !== itemIndex);
      }

      // logDebug("");
    });

    displayMonkeys(monkeys);
    logDebug("");
  }

  return [...timesUsed.values()]
    .sort(ascending)
    .slice(0, mostActive)
    .reduce((prev, curr) => prev * curr, 1);
}

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });
  setDebug(type === "example");

  const monkeys = parseInput(content);

  switch (star) {
    case "first":
      return getMonkeyBussiness(monkeys);
    case "second":
      return monkeys;
  }
}

// entrypoint
(() => {
  console.time(BENCHMARK_ID);

  const result = main({ star: "first", day: 11, type: "example" });
  console.log({ result });

  console.timeEnd(BENCHMARK_ID);
})();
