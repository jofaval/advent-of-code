import {
  BENCHMARK_ID,
  JUMP_LINE,
  MainProps,
  maxReducer,
  readInput,
} from "../__core__";

type TreeHeight = number;

type Input = TreeHeight[][];

function parseInput(content: string): Input {
  return content.split(JUMP_LINE).map((row) => row.split("").map(Number));
}

enum Direction {
  Top = "top",
  Right = "right",
  Bottom = "bottom",
  Left = "left",
}

type GetEdgeProps = {
  grid: Input;
  x: number;
  y: number;
};

function getTopEdge({ grid, x, y }: GetEdgeProps): TreeHeight[] {
  const elements = [];
  for (let index = x - 1; x > 0; index--) {
    if (!grid[index]) {
      break;
    }
    elements.push(grid[index][y]);
  }
  return elements;
}

function getBottomEdge({ grid, x, y }: GetEdgeProps): TreeHeight[] {
  const elements = [];
  for (let index = x + 1; x < grid.length + 1; index++) {
    if (!grid[index]) {
      break;
    }
    elements.push(grid[index][y]);
  }
  return elements;
}

function getLeftEdge({ grid, x, y }: GetEdgeProps): TreeHeight[] {
  return grid[x].slice(0, y).reverse();
}

function getRightEdge({ grid, x, y }: GetEdgeProps): TreeHeight[] {
  return grid[x].slice(y + 1);
}

const EdgeDiscriminationDict = {
  [Direction.Top]: getTopEdge,
  [Direction.Right]: getRightEdge,
  [Direction.Bottom]: getBottomEdge,
  [Direction.Left]: getLeftEdge,
} as const;

function isHigher(current: TreeHeight, rest: TreeHeight[]): [boolean, number] {
  let visibleTrees = 0;

  const nonBlocked = rest.every((tree) => {
    visibleTrees++;
    return tree < current;
  });

  return [nonBlocked, Math.max(1, visibleTrees)];
}

type CoordinatesVisibility = [boolean, boolean, boolean, boolean];

function isVisible({ grid, x, y }: GetEdgeProps): CoordinatesVisibility {
  return Object.values(EdgeDiscriminationDict).map(
    (getEdge) => isHigher(grid[x][y], getEdge({ grid, x, y }))[0]
  ) as CoordinatesVisibility;
}

function getGridSize(grid: Input): { width: number; height: number } {
  return { width: grid.length, height: grid[0].length };
}

function mapGrid(
  grid: Input,
  callback: (visibility: CoordinatesVisibility, x: number, y: number) => void
) {
  const { width, height } = getGridSize(grid);

  for (let x = 1; x < width - 1; x++) {
    for (let y = 1; y < height - 1; y++) {
      const visible = isVisible({ grid, x, y });
      if (!visible.some(Boolean)) continue;

      callback(visible, x, y);
    }
  }
}

function countVisibleTrees(grid: Input): number {
  const { width, height } = getGridSize(grid);

  const collisionCorners = 4;
  let visibleTrees = Math.round(width * 2 + (height * 2 - collisionCorners));

  mapGrid(grid, () => visibleTrees++);

  return visibleTrees;
}

function getScenicScore({ grid, x, y }: GetEdgeProps): number {
  return Object.values(EdgeDiscriminationDict).reduce(
    (prev, getEdge) => prev * isHigher(grid[x][y], getEdge({ grid, x, y }))[1],
    1
  );
}

function getMostScenicTree(grid: Input): number {
  const scenicScores = [];

  mapGrid(grid, (_, x, y) => {
    scenicScores.push(getScenicScore({ grid, x, y }));
  });

  return scenicScores.reduce(maxReducer);
}

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });
  const grid = parseInput(content);

  switch (star) {
    case "first":
      return countVisibleTrees(grid);
    case "second":
      return getMostScenicTree(grid);
  }
}

// entrypoint
(() => {
  console.time(BENCHMARK_ID);

  const result = main({ star: "second", day: 8, type: "test" });
  console.log({ result });

  console.timeEnd(BENCHMARK_ID);
})();
