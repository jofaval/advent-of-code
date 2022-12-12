import { BENCHMARK_ID, MainProps, readInput, logger } from "../__core__";

type Input = any;

function parseInput(content: string): Input {
  return content;
}

function getHeightLevel(char: string): number {
  return char.charCodeAt(0);
}

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });
  const parsed = parseInput(content);

  switch (star) {
    case "first":
      return parsed;
    case "second":
      return parsed;
  }
}

// entrypoint
(() => {
  console.time(BENCHMARK_ID);
  // const { empty, reset } = logger();

  const result = main({ star: "first", day: 12, type: "example" });
  console.log({ result });

  // reset();
  console.timeEnd(BENCHMARK_ID);
  // empty();
})();
