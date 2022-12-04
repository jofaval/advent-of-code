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

function generateRange([min, max]: Range) {
  return [...Array(max - (min - 1)).keys()].map((key) => key + min);
}

function doesRangeOverlap([first, second]: Pair, atAll: boolean): boolean {
  const firstRange = generateRange(first);
  const secondRange = generateRange(second);

  if (atAll) {
    const doOverlapAtAll =
      firstRange.some((num) => secondRange.includes(num)) ||
      secondRange.some((num) => firstRange.includes(num));

    if (doOverlapAtAll) {
      return true;
    }
  }

  return (
    firstRange.every((num) => secondRange.includes(num)) ||
    secondRange.every((num) => firstRange.includes(num))
  );
}

function countOverlaps(pairs: Input, atAll: boolean = false): number {
  return pairs.reduce(
    (count, pair) => (doesRangeOverlap(pair, atAll) ? count + 1 : count),
    0
  );
}

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });
  const parsed = parseInput(content);

  const totalOverlaps = countOverlaps(parsed, star === "second");

  return totalOverlaps;
}

// entrypoint
(() => {
  const result = main({ star: "second", day: 4, type: "test" });
  console.log({ result });
})();
