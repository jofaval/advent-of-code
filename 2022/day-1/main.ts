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

function main({ star, day, type }: MainProps): CaloryCount | CaloryCount[] {
  const content = readInput({ star, day, type });

  const inventories = parseInput(content);
  const totalCaloriesPerInventory = inventories.map((inventory) =>
    inventory.reduce((prev, acc) => prev + acc, 0)
  );

  const sortedTotals = totalCaloriesPerInventory.sort((a, b) => a - b);

  if (star === "first") {
    return sortedTotals.at(-1);
  } else if (star === "second") {
    const topInventories = sortedTotals.slice(-3);
    return topInventories.reduce((prev, acc) => prev + acc, 0);
  }
}

// entrypoint
(() => {
  const result = main({ star: "second", day: 1, type: "test" });
  console.log({ result });
})();
