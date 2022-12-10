import {
  BENCHMARK_ID,
  MainProps,
  readInput,
  JUMP_LINE,
  SPACE,
  sumReducer,
  setDebug,
  logDebug,
} from "../__core__";

type Instruction =
  | {
      command: "addx";
      value: number;
      raw: string;
    }
  | {
      command: "noop";
      raw: string;
    };

type Input = Instruction[];

const ADD_WAITS_FOR = 1;

function parseInput(content: string): Input {
  return content.split(JUMP_LINE).map((raw) => {
    const [command, value] = raw.split(SPACE);
    const instruction = { command, raw } as any;

    if (value) {
      instruction.value = parseInt(value);
    }

    return instruction as Instruction;
  });
}

const STARTIN_REGISTER_VALUE = 1;

type EvaluateInstructionsProps = {
  instructions: Instruction[];
  onIntrestingValues: (
    cycle: number,
    X: number,
    logIntresting: (...args: any[]) => void
  ) => void;
  intrestingCycles: number[];
  debug?: {
    lifecycle: boolean;
    intresting: boolean;
  };
};

function evaluateInstructions({
  instructions,
  onIntrestingValues,
  intrestingCycles,
  debug = {
    lifecycle: false,
    intresting: true,
  },
}: EvaluateInstructionsProps): number {
  let cycle = 1;
  let X = STARTIN_REGISTER_VALUE;

  const intrestingValues: number[] = [];

  const onWait = {};

  const logIntresting = (...args: any[]) => {
    if (!debug.lifecycle) {
      return;
    }

    logDebug(...args);
  };

  const logLifecycle = (...args: any[]) => {
    if (!debug.lifecycle) {
      return;
    }

    logDebug(...args);
  };

  const increaseCycle = () => {
    cycle++;

    if (intrestingCycles.includes(cycle)) {
      onIntrestingValues(cycle, X, logIntresting);
    }
  };

  const waitCycles = () => {
    if (!Object.keys(onWait).length) {
      return;
    }

    while (!(cycle in onWait)) {
      increaseCycle();

      logLifecycle("durin", { cycle, X, raw: instruction.raw, onWait });
    }

    X += onWait[cycle];
    delete onWait[cycle];
  };

  const evaluateInstruction = (instruction: Instruction) => {
    if (!instruction) {
      return;
    }

    if (instruction.command === "noop") {
      // nothing happens
    } else if (instruction.command === "addx") {
      onWait[cycle + ADD_WAITS_FOR] = instruction.value;
    }
  };

  let instruction: Instruction;
  while ((instruction = instructions.shift()) || Object.keys(onWait).length) {
    logLifecycle("start", { cycle, X, raw: instruction.raw, onWait });

    evaluateInstruction(instruction);

    waitCycles();

    logLifecycle("after", { cycle, X, raw: instruction.raw, onWait });

    increaseCycle();
  }

  return intrestingValues.reduce(sumReducer, 0);
}

function getSumIntrestingCycles(
  instructions: Instruction[],
  intrestingCycles: number[]
): number {
  const intrestingValues: number[] = [];

  evaluateInstructions({
    instructions,
    onIntrestingValues: (cycle, X, logIntresting) => {
      const result = cycle * X;
      logIntresting("intresting cycle", { cycle, X, result });
      intrestingValues.push(result);
    },
    intrestingCycles,
  });

  return intrestingValues.reduce(sumReducer, 0);
}

const StartingCycle = {
  first: 20,
  second: 40,
} as const;

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });
  setDebug(type === "example");

  const instructions = parseInput(content);

  let startingCycle: number = StartingCycle[star];
  const intrestingCycles: number[] = [...Array(5).keys()].reduce(
    (arr) => [...arr, arr.at(-1) + 40],
    [startingCycle]
  );

  switch (star) {
    case "first":
      return getSumIntrestingCycles(instructions, intrestingCycles);
    case "second":
      return instructions;
  }
}

// entrypoint
(() => {
  console.time(BENCHMARK_ID);

  const result = main({ star: "first", day: 10, type: "test" });
  console.log({ result });

  console.timeEnd(BENCHMARK_ID);
})();
