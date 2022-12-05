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

function rearrangeCrates(
  crane: CargoCrane,
  steps: RearrangementStep[],
  crateMover9001: boolean
) {
  steps.forEach(([quantity, origin, destination]) => {
    const elements = [];

    const originCrate = crane.get(origin);
    if (crateMover9001) {
      elements.push(...originCrate.splice(-quantity));
    } else {
      for (let quantityIndex = 0; quantityIndex < quantity; quantityIndex++) {
        elements.push(originCrate.pop());
      }
    }

    crane.get(destination).push(...elements);
  });
}

function getTopCratesLetters(
  [crane, steps]: Input,
  /**
   * The amazing and new fantastic version
   */
  crateMover9001: boolean = false
): string {
  const letters = [];

  rearrangeCrates(crane, steps, crateMover9001);
  crane.forEach((crate) => {
    letters.push(...crate.slice(-1));
  });

  return letters.join("");
}

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });
  const parsed = parseInput(content);

  const letters = getTopCratesLetters(parsed, star === "second");

  return letters;
}

// entrypoint
(() => {
  const result = main({ star: "second", day: 5, type: "test" });
  console.log({ result });
})();
