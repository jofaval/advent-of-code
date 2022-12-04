import { JUMP_LINE, MainProps, readInput } from "../__core__";

type Range = [number, number];

type Pair = [Range, Range];

type Input = Pair[];

function parseInput(content: string): Input {
  return content.split(JUMP_LINE).map((rawPair) => {
    return rawPair
      .split(",")
      .map((rawRange) => rawRange.split("-").map(Number)) as Pair;
  });
}

function doesRangeOverlap([first, second]: Pair): boolean {
  if (first[0] >= second[0] && first[1] <= second[1]) {
    return true;
  }

  if (second[0] >= first[0] && second[1] <= first[1]) {
    return true;
  }

  return false;
}

function countOverlaps(pairs: Input): number {
  return pairs.reduce(
    (count, pair) => (doesRangeOverlap(pair) ? count + 1 : count),
    0
  );
}

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });
  const parsed = parseInput(content);

  const totalOverlaps = countOverlaps(parsed);

  switch (star) {
    case "first":
      return totalOverlaps;
    case "second":
      return parsed;
  }
}

// entrypoint
(() => {
  const result = main({ star: "first", day: 4, type: "test" });
  console.log({ result });
})();
