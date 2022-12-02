import { MainProps, readInput } from "..";

type Input = any;

function parseInput(content: string): Input {
  return content;
}

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });
  const parsed = parseInput(content);

  switch (star) {
    case "first":
      return parsed;
    case"second":
      return parsed;
  }
}

// entrypoint
(() => {
  const result = main({ star: "second", day: §DAY, type: "test" });
  console.log({ result });
})();
