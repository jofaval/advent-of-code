import {
  DOUBLE_JUMP_LINE,
  JUMP_LINE,
  MainProps,
  readInput,
} from "../__core__/";

type CaloryCount = number;

type Inventory = CaloryCount[];

type Input = Inventory[];

function parseInput(content: string): Input {
  let sections = content.split(DOUBLE_JUMP_LINE);

  return sections.map((inventory) => inventory.split(JUMP_LINE).map(Number));
}

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });

  const inventories = parseInput(content);
  const totalCaloriesPerInventory = inventories.map((inventory) =>
    inventory.reduce((prev, acc) => prev + acc, 0)
  );

  return totalCaloriesPerInventory.reduce(
    (candidate, max) => (candidate > max ? candidate : max),
    -Infinity
  );
}

// entrypoint
(() => {
  const result = main({ star: "first", day: 1, type: "test" });
  console.log({ result });
})();
