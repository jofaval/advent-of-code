import {
  BENCHMARK_ID,
  isDebug,
  JUMP_LINE,
  logDebug,
  MainProps,
  readInput,
  setDebug,
  SPACE,
  sumReducer,
} from "../__core__";

const VISITED = "#";
const DEFAULT = ".";

type Coordinates = {
  row: number;
  col: number;
};

type Tail = Coordinates;

type Head = Coordinates;

type Grid = string[][];

enum Direction {
  UP = "U",
  RIGHT = "R",
  DOWN = "D",
  LEFT = "L",
}

type Motion = {
  direction: Direction;
  steps: number;
};

type Input = {
  grid: Grid;
  head: Head;
  tail: Tail;
  motions: Motion[];
};

/**
 * It creates the maximum possible grid size
 */
function getGridSize(motions: Motion[]): { width: number; height: number } {
  // TODO: make grid extensible?
  // TODO: make it compute in memory only? no grid whatsoever,
  // just a list, or set even, of visited coordinates, and get the size of that

  let width = [];
  let height = [];

  motions.forEach((motion) => {
    switch (motion.direction) {
      case Direction.UP:
        height.push(motion.steps + 1);
        break;
      case Direction.RIGHT:
        width.push(motion.steps + 1);
        break;
    }
  });

  return { width: width.reduce(sumReducer), height: height.reduce(sumReducer) };
}

function parseGrid(motions: Motion[]): Grid {
  const { width, height } = getGridSize(motions);

  const grid = [];

  for (let index = 0; index < height; index++) {
    const row = DEFAULT.repeat(width).split("");
    grid.push(row);
  }

  return grid;
}

function parseHead(grid: Grid): Head {
  return { row: grid.length - 1, col: 0 };
}

function parseTail(grid: Grid): Tail {
  return { row: grid.length - 1, col: 0 };
}

function parseMotions(content: string): Motion[] {
  return content.split(JUMP_LINE).map((raw) => {
    const [direction, steps] = raw.split(SPACE);
    return { direction, steps: parseInt(steps) } as Motion;
  });
}

function parseInput(content: string): Input {
  const motions = parseMotions(content);
  const grid = parseGrid(motions);
  const head = parseHead(grid);
  const tail = parseTail(grid);

  return { grid, head, tail, motions };
}

function moveHead(head: Coordinates, direction: Direction) {
  switch (direction) {
    case Direction.UP:
      return head.row--;
    case Direction.RIGHT:
      return head.col++;
    case Direction.DOWN:
      return head.row--;
    case Direction.LEFT:
      return head.col--;
  }
}

type IsAdjacentProps = Omit<Input, "motions">;

function isAdjacent({ grid, head, tail }: IsAdjacentProps): boolean {
  // rows boundaries
  if (tail.row >= grid.length || tail.row < 0) {
    return false;
  }

  // cols boundaries
  if (tail.col >= grid[0].length || tail.col < 0) {
    return false;
  }

  const rowDifference =
    Math.max(head.row, tail.row) - Math.min(head.row, tail.row);
  const colDifference =
    Math.max(head.col, tail.col) - Math.min(head.col, tail.col);

  return rowDifference <= 1 && colDifference <= 1;
}

function getVariations(
  tail: Tail,
  direction: Direction
): {
  rowVariations: number[];
  colVariations: number[];
} {
  // vertical movement
  const top = tail.row - 1;
  const middle = tail.row;
  const bottom = tail.row + 1;

  // horizontal movement
  const left = tail.col - 1;
  const center = tail.col;
  const right = tail.col + 1;

  let rowVariations: number[], colVariations: number[];

  switch (direction) {
    case Direction.RIGHT:
      rowVariations = [middle, top, bottom];
      colVariations = [right];
      break;
    case Direction.LEFT:
      rowVariations = [middle, top, bottom];
      colVariations = [left];
      break;
    case Direction.UP:
      rowVariations = [top];
      colVariations = [center, left, right];
      break;
    case Direction.DOWN:
      rowVariations = [bottom];
      colVariations = [center, left, right];
      break;
  }

  return { rowVariations, colVariations };
}

type MoveTailProps = IsAdjacentProps & {
  direction: Direction;
};

function moveTail({ grid, head, tail, direction }: MoveTailProps) {
  const commonProps = { grid, head };
  grid[tail.row][tail.col] = VISITED;

  if (isAdjacent({ ...commonProps, tail })) return;

  const { rowVariations, colVariations } = getVariations(tail, direction);

  for (const row of rowVariations) {
    for (const col of colVariations) {
      if (!isAdjacent({ ...commonProps, tail: { row, col } })) continue;

      tail.row = row;
      tail.col = col;
      return;
    }
  }
}

type EvaluateStepProps = IsAdjacentProps & {
  motion: Motion;
};

function evaluateStep({
  grid,
  head,
  motion: { direction, steps },
  tail,
}: EvaluateStepProps): Grid {
  for (let step = 0; step < steps; step++) {
    moveHead(head, direction);
    moveTail({ grid, head, tail, direction });

    grid[tail.row][tail.col] = VISITED;
    displayGrid({ grid, head, tail }, `${direction}:${step + 1}/${steps}`);
  }

  return;
}

function displayGrid(
  { grid, head, tail }: IsAdjacentProps,
  ...labels: any[]
): void {
  if (isDebug()) {
    return;
  }

  let log: string[] = [];

  grid.forEach((row, rowIndex) => {
    const rowLog = [];
    row.forEach((col, colIndex) => {
      let value = col;

      if (head.row === rowIndex && head.col === colIndex) {
        value = "H";
      } else if (tail.row === rowIndex && tail.col === colIndex) {
        value = "T";
      }

      rowLog.push(value);
    });
    log.push(rowLog.join(" "));
  });

  logDebug(...labels, { head, tail });
  logDebug([log.join("\n"), ""].join("\n"));
}

function simulateSteps({ grid, head, tail, motions }: Input): Grid {
  motions.forEach((motion, index) => {
    console.log("Evaluating step", index + 1);

    const commonProps = { grid, head, tail };
    // displayGrid(commonProps, "Before set of motions", index + 1);
    evaluateStep({ ...commonProps, motion });
    displayGrid(commonProps, "After set of motions", index + 1);
  });

  return grid;
}

function countVisited(grid: Grid): number {
  let visited = 0;

  grid.forEach((row) =>
    row.forEach((col) => {
      if (col === VISITED) {
        visited++;
      }
    })
  );

  return visited;
}

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });
  setDebug(type === "example");

  const { grid, head, motions, tail } = parseInput(content);
  displayGrid({ grid, head, tail }, "Initial step");

  const simulatedGrid = simulateSteps({
    grid,
    head,
    motions,
    tail,
  });

  switch (star) {
    case "first":
      return countVisited(simulatedGrid);
    case "second":
      return simulatedGrid;
  }
}

// entrypoint
(() => {
  console.time(BENCHMARK_ID);

  const result = main({ star: "first", day: 9, type: "test" });
  console.log({ result });

  console.timeEnd(BENCHMARK_ID);
})();
