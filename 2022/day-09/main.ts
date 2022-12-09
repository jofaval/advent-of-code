import {
  BENCHMARK_ID,
  JUMP_LINE,
  MainProps,
  readInput,
  SPACE,
} from "../__core__";

type Coordinates = {
  row: number;
  col: number;
};

type Tail = Coordinates;

type Head = Coordinates;

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
  visited: Set<string>;
  head: Head;
  tail: Tail;
  motions: Motion[];
};

// TODO: make grid extensible?
// TODO: make it compute in memory only? no grid whatsoever,
// just a list, or set even, of visited coordinates, and get the size of that

function parseMotions(content: string): Motion[] {
  return content.split(JUMP_LINE).map((raw) => {
    const [direction, steps] = raw.split(SPACE);
    return { direction, steps: parseInt(steps) } as Motion;
  });
}

function parseInput(content: string): Input {
  const motions = parseMotions(content);
  const visited = new Set<string>();
  const head = { row: 0, col: 0 };
  const tail = { row: 0, col: 0 };

  return { visited, head, tail, motions };
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

type IsAdjacentProps = Omit<Input, "motions" | "visited">;

function isAdjacent({ head, tail }: IsAdjacentProps): boolean {
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

function moveTail({ head, tail, direction }: MoveTailProps) {
  const commonProps = { head };

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

function serializeTail(tail: Tail): string {
  return [tail.row, tail.col].join();
}

type EvaluateStepProps = IsAdjacentProps &
  Pick<Input, "visited"> & {
    motion: Motion;
  };

function evaluateStep({
  visited,
  head,
  motion: { direction, steps },
  tail,
}: EvaluateStepProps): void {
  for (let step = 0; step < steps; step++) {
    moveHead(head, direction);
    moveTail({ head, tail, direction });
    visited.add(serializeTail(tail));
  }
}

function simulateSteps({ visited, head, tail, motions }: Input): number {
  // starting position
  visited.add(serializeTail(tail));

  motions.forEach((motion) => {
    const commonProps = { visited, head, tail };
    evaluateStep({ ...commonProps, motion });
  });

  return visited.size;
}

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });

  const { visited, head, motions, tail } = parseInput(content);

  const visitedPositions = simulateSteps({
    visited,
    head,
    motions,
    tail,
  });

  switch (star) {
    case "first":
      return visitedPositions;
    case "second":
      return visitedPositions;
  }
}

// entrypoint
(() => {
  console.time(BENCHMARK_ID);

  const result = main({ star: "first", day: 9, type: "test" });
  console.log({ result });

  console.timeEnd(BENCHMARK_ID);
})();
