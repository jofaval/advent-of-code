import { JUMP_LINE, MainProps, readInput } from "../__core__";
import { sumReducer } from "../__core__/helpers/reducers";

type Compartment = string[];

type Row = [Compartment, Compartment];

type Input = Row[];

type SecondRow = [Compartment, Compartment, Compartment];

type SecondInput = SecondRow[];

function parseInput(content: string): Input {
  return content.split(JUMP_LINE).map((section) => {
    const splitted = section.split("");

    const halfIndex = Math.floor(splitted.length / 2);

    const firstCompartment = splitted.slice(0, halfIndex);
    const secondCompartment = splitted.slice(halfIndex);

    return [firstCompartment, secondCompartment];
  });
}

function parseSecondInput(content: string, groupSize: number = 3): SecondInput {
  const rows = content.split(JUMP_LINE).filter(Boolean);
  const groups = [];

  const rowsLen = rows.length;
  let groupIndex = 1;
  let newGroup = [];
  for (let rowIndex = 0; rowIndex < rowsLen; rowIndex++) {
    newGroup.push(rows[rowIndex].split(""));

    if (groupIndex % 3 === 0) {
      groups.push(newGroup);
      newGroup = [];

      groupIndex = 1;
    } else {
      groupIndex++;
    }
  }

  return groups as SecondInput;
}

function analyzeCompartments(row: Row): string {
  const [first, second] = row;

  const found = first.find((char) => second.includes(char));

  return found;
}

function analyzeSecondCompartments(row: SecondRow): string {
  const [first, second, third] = row;

  const found = first.find(
    (char) => second.includes(char) && third.includes(char)
  );

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

function evaluateSecondRows(rows: SecondInput) {
  return rows
    .map(analyzeSecondCompartments)
    .map(getCharPriority)
    .reduce(sumReducer, 0);
}

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });
  let parsed, sumPriorities;

  switch (star) {
    case "first":
      parsed = parseInput(content);
      sumPriorities = evaluateRows(parsed);
      return sumPriorities;
    case "second":
      parsed = parseSecondInput(content);
      sumPriorities = evaluateSecondRows(parsed);
      return sumPriorities;
  }
}

// entrypoint
(() => {
  const result = main({ star: "second", day: 3, type: "test" });
  console.log({ result });
})();
