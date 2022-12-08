import {
  DOUBLE_JUMP_LINE,
  JUMP_LINE,
  logDebug,
  MainProps,
  readInput,
  setDebug,
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
      return grid[x].slice(0, y);
  }
}

function isHigher(current: number, rest: number[]): boolean {
  return rest.every((tree) => tree < current);
}

function isVisible(grid: Input, row: number, col: number): boolean {
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

  return topVisible || rightVisible || bottomVisible || leftVisible;
}

function countVisibleTrees(grid: Input): number {
  const width = grid.length;
  const height = grid[0].length;
  // minus four because of the collision corners
  let visibleTrees = Math.round(width * 2 + (height * 2 - 4));

  const visibilityGrid = [];

  for (let x = 1; x < width - 1; x++) {
    const row = [];
    for (let y = 1; y < height - 1; y++) {
      const visible = isVisible(grid, x, y);
      if (visible) {
        visibleTrees++;
      }
      row.push(visible);
    }
    visibilityGrid.push(row);
  }

  logDebug(
    visibilityGrid
      .map((row) => row.map((cell) => cell.toString().padEnd(5, " ")).join(" "))
      .join(DOUBLE_JUMP_LINE)
  );

  return visibleTrees;
}

function main({ star, day, type }: MainProps) {
  setDebug(type === "example");

  const content = readInput({ star, day, type });
  const grid = parseInput(content);

  const totalVisibleTrees = countVisibleTrees(grid);

  switch (star) {
    case "first":
      return totalVisibleTrees;
    case "second":
      return totalVisibleTrees;
  }
}

// entrypoint
(() => {
  const result = main({ star: "first", day: 8, type: "test" });
  console.log({ result });
})();
