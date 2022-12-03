import { JUMP_LINE, MainProps, readInput, sumReducer } from "../__core__";

type Compartment = string[];

type Row = Compartment[];

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

function parseSecondInput(content: string, groupSize: number = 3): Input {
  const rows = content.split(JUMP_LINE).filter(Boolean);
  const groups = [];

  const rowsLen = rows.length;
  let groupIndex = 1;
  let newGroup = [];
  for (let rowIndex = 0; rowIndex < rowsLen; rowIndex++) {
    newGroup.push(rows[rowIndex].split(""));

    if (groupIndex % groupSize !== 0) {
      groupIndex++;
      continue;
    }

    groups.push(newGroup);
    newGroup = [];
    groupIndex = 1;
  }

  return groups;
}

function analyzeCompartments([first, ...rest]: Row): string {
  return first.find((char) => rest.every((part) => part.includes(char)));
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

  let parsed;
  if (star === "first") {
    parsed = parseInput(content);
  } else if (star === "second") {
    parsed = parseSecondInput(content);
  }

  const sumPriorities = evaluateRows(parsed);
  return sumPriorities;
}

// entrypoint
(() => {
  const result = main({ star: "second", day: 3, type: "test" });
  console.log({ result });
})();
