import { JUMP_LINE, MainProps, readInput } from "../__core__";

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

function toEdge(
  grid: Input,
  x: number,
  y: number,
  direction: Direction
): number[] {
  const elements = [];
  switch (direction) {
    case Direction.Top:
      for (let index = x - 1; x > 0; index--) {
        if (!grid[index]) {
          break;
        }
        elements.push(grid[index][y]);
      }
      return elements;
    case Direction.Right:
      return grid[x].slice(y + 1);
    case Direction.Bottom:
      const rows = grid.length;
      for (let index = x + 1; x < rows + 1; index++) {
        if (!grid[index]) {
          break;
        }
        elements.push(grid[index][y]);
      }
      return elements;
    case Direction.Left:
      return grid[x].slice(0, y).reverse();
  }
}

function isHigher(current: number, rest: number[]): boolean {
  return rest.every((tree) => tree < current);
}

type CoordinatesVisibility = [boolean, boolean, boolean, boolean];

function isVisible(
  grid: Input,
  row: number,
  col: number
): CoordinatesVisibility {
  const current = grid[row][col];

  const topVisible = isHigher(current, toEdge(grid, row, col, Direction.Top));
  const rightVisible = isHigher(
    current,
    toEdge(grid, row, col, Direction.Right)
  );
  const bottomVisible = isHigher(
    current,
    toEdge(grid, row, col, Direction.Bottom)
  );
  const leftVisible = isHigher(current, toEdge(grid, row, col, Direction.Left));

  return [topVisible, rightVisible, bottomVisible, leftVisible];
}

function getGridSize(grid: Input): { width: number; height: number } {
  return {
    width: grid.length,
    height: grid[0].length,
  };
}

function mapGrid(
  grid: Input,
  callback: (visibility: CoordinatesVisibility, x: number, y: number) => void
) {
  const { width, height } = getGridSize(grid);

  for (let x = 1; x < width - 1; x++) {
    for (let y = 1; y < height - 1; y++) {
      const visible = isVisible(grid, x, y);
      callback(visible, x, y);
    }
  }
}

function countVisibleTrees(grid: Input): number {
  const { width, height } = getGridSize(grid);
  // minus four because of the collision corners
  let visibleTrees = Math.round(width * 2 + (height * 2 - 4));

  mapGrid(grid, (visibility) => {
    if (visibility.some(Boolean)) {
      visibleTrees++;
    }
  });

  return visibleTrees;
}

function nonBlockingTreesScore(current: number, view: number[]): number {
  let nonBlocking = 0;

  for (let index = 0; index < view.length; index++) {
    nonBlocking++;

    if (current <= view[index]) {
      break;
    }
  }

  return Math.max(1, nonBlocking);
}

function getScenicScore(grid: Input, row: number, col: number): number {
  const current = grid[row][col];

  const top = nonBlockingTreesScore(
    current,
    toEdge(grid, row, col, Direction.Top)
  );
  const right = nonBlockingTreesScore(
    current,
    toEdge(grid, row, col, Direction.Right)
  );
  const bottom = nonBlockingTreesScore(
    current,
    toEdge(grid, row, col, Direction.Bottom)
  );
  const left = nonBlockingTreesScore(
    current,
    toEdge(grid, row, col, Direction.Left)
  );

  return top * right * bottom * left;
}

function getMostScenicTree(grid: Input): number {
  let mostScenicScore = -Infinity;

  mapGrid(grid, (visibility, x, y) => {
    if (visibility.some(Boolean)) {
      const currentScore = getScenicScore(grid, x, y);

      if (currentScore > mostScenicScore) {
        mostScenicScore = currentScore;
      }
    }
  });

  return mostScenicScore;
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
  const result = main({ star: "second", day: 8, type: "test" });
  console.log({ result });
})();
