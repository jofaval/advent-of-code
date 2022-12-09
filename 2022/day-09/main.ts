import {
  BENCHMARK_ID,
  logger,
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

function absoluteDifference(...numbers: number[]): number {
  const abs = numbers.map(Math.abs);
  return Math.max(...abs) - Math.min(...abs);
}

type IsAdjacentResponse = {
  adjacent: boolean;
  difference: number;
};

function isAdjacent({ head, tail }: IsAdjacentProps): IsAdjacentResponse {
  const rowDifference = absoluteDifference(head.row, tail.row);
  const colDifference = absoluteDifference(head.col, tail.col);

  return {
    adjacent: rowDifference <= 1 && colDifference <= 1,
    difference: rowDifference + colDifference,
  };
}

type GetVariationsResponse = {
  rows: number[];
  cols: number[];
};

function getVariations(
  tail: Tail,
  direction: Direction
): GetVariationsResponse {
  // vertical movement
  const top = tail.row - 1;
  const middle = tail.row;
  const bottom = tail.row + 1;

  // horizontal movement
  const left = tail.col - 1;
  const center = tail.col;
  const right = tail.col + 1;

  switch (direction) {
    case Direction.RIGHT:
      return { rows: [middle, top, bottom], cols: [right] };
    case Direction.LEFT:
      return { rows: [middle, top, bottom], cols: [left] };
    case Direction.UP:
      return { rows: [top], cols: [center, left, right] };
    case Direction.DOWN:
      return { rows: [bottom], cols: [center, left, right] };
  }
}

type MoveTailProps = IsAdjacentProps & {
  direction: Direction;
};

function moveTail({ head, tail, direction }: MoveTailProps) {
  if (isAdjacent({ head, tail }).adjacent) return;

  const { rows, cols } = getVariations(tail, direction);

  const lowest = { difference: Infinity, coordinates: { ...tail } };

  for (const row of rows) {
    for (const col of cols) {
      const { adjacent, difference } = isAdjacent({ head, tail: { row, col } });

      if (!adjacent || difference > lowest.difference) continue;

      lowest.coordinates = { row, col };
      lowest.difference = difference;
    }
  }

  tail.row = lowest.coordinates.row;
  tail.col = lowest.coordinates.col;
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
  console.log({ motion: { direction, steps }, head, tail });

  for (let step = 0; step < steps; step++) {
    moveHead(head, direction);
    moveTail({ head, tail, direction });
    console.log({ motion: { direction, step }, head, tail });

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

  const totalVisitedPositions = simulateSteps({
    visited,
    head,
    motions,
    tail,
  });

  switch (star) {
    case "first":
      return totalVisitedPositions;
    case "second":
      return totalVisitedPositions;
  }
}

// entrypoint
(() => {
  console.time(BENCHMARK_ID);
  const { empty, reset, clear } = logger();

  const result = main({ star: "first", day: 9, type: "example" });
  clear();
  console.log({ result });

  reset();
  console.timeEnd(BENCHMARK_ID);
  empty();
})();
