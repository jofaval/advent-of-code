import { JUMP_LINE, MainProps, readInput } from "../__core__";
import { sumReducer } from "../__core__/helpers/reducers";

type Compartment = string[];

type Row = [Compartment, Compartment];

type Input = Row[];

function parseInput(content: string): Input {
  return content.split(JUMP_LINE).map((section) => {
    const splitted = section.split("");

    const halfIndex = Math.floor(splitted.length / 2);

    const firstCompartment = splitted.slice(0, halfIndex);
    const secondCompartment = splitted.slice(halfIndex);

    return [firstCompartment, secondCompartment];
  });
}

function analyzeCompartments(row: Row): string {
  const [first, second] = row;

  const found = first.find((char) => second.includes(char));

  return found;
}

function isLowerCase(char: string): boolean {
  return char === char.toLocaleLowerCase();
}

function getCharPriority(char: string): number {
  let points = char.charCodeAt(0);

  if (isLowerCase(char)) {
    points -= 96;
  } else {
    points -= 64;
    points += 26;
  }

  return points;
}

function evaluateRows(rows: Input): number {
  return rows
    .map(analyzeCompartments)
    .map(getCharPriority)
    .reduce(sumReducer, 0);
}

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });
  const parsed = parseInput(content);

  const sumPriorities = evaluateRows(parsed);

  switch (star) {
    case "first":
      return sumPriorities;
    case "second":
      return parsed;
  }
}

// entrypoint
(() => {
  const result = main({ star: "first", day: 3, type: "test" });
  console.log({ result });
})();
