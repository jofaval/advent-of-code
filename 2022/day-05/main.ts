import {
  DOUBLE_JUMP_LINE,
  JUMP_LINE,
  MainProps,
  readInput,
  SPACE,
} from "../__core__";

type Crate = string[];

type CargoCrane = Map<number, Crate>;

type RearrangementStep = [number, number, number];

type Input = [CargoCrane, RearrangementStep[]];

function parseCargo(rawCargo: string): CargoCrane {
  const rawCrates = rawCargo.split(JUMP_LINE);

  const cratesMap: CargoCrane = new Map();

  const lastLine = rawCrates.at(-1);
  const lastLineLen = lastLine.length;
  const rawCratesLen = rawCrates.length - 1;

  for (let charIndex = 0; charIndex < lastLineLen; charIndex++) {
    const char = lastLine[charIndex];

    if (char === SPACE) {
      continue;
    }

    // evaluate cargo content
    const cargoContent: Crate = [];

    for (let crateIndex = rawCratesLen; crateIndex >= 0; crateIndex--) {
      const crateChar = rawCrates[crateIndex][charIndex];

      if (crateChar !== SPACE) {
        cargoContent.push(crateChar);
      }
    }

    cratesMap.set(Number(char), cargoContent);
  }

  return cratesMap;
}

function parseStep(rawStep: string): RearrangementStep {
  return rawStep.split(/\s/).map(Number).filter(Boolean) as RearrangementStep;
}

function parseInput(content: string): Input {
  const [rawCargo, rawSteps] = content.split(DOUBLE_JUMP_LINE);

  const parsedCargo = parseCargo(rawCargo);
  const parsedSteps = rawSteps.split(JUMP_LINE).map(parseStep);

  return [parsedCargo, parsedSteps];
}

function rearrangeCrates(crane: CargoCrane, steps: RearrangementStep[]) {
  steps.forEach(([quantity, origin, destination]) => {
    for (let quantityIndex = 0; quantityIndex < quantity; quantityIndex++) {
      const element = crane.get(origin).pop();
      crane.get(destination).push(element);
    }
  });
}

function getTopCratesLetters(
  [crane, steps]: Input,
  quantity: number = 1
): string {
  const letters = [];

  rearrangeCrates(crane, steps);
  crane.forEach((crate) => {
    letters.push(...crate.slice(-quantity));
  });

  return letters.join("");
}

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });
  const parsed = parseInput(content);

  const letters = getTopCratesLetters(parsed);

  switch (star) {
    case "first":
      return letters;
    case "second":
      return letters;
  }
}

// entrypoint
(() => {
  const result = main({ star: "first", day: 5, type: "test" });
  console.log({ result });
})();
