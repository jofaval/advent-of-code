import { JUMP_LINE, MainProps, readInput, SPACE } from "../__core__";

const RoundResult = {
  Draw: 3,
  Loss: 0,
  Win: 6,
} as const;

enum MyOptions {
  Rock = "X",
  Paper = "Y",
  Scissors = "Z",
}

enum EnemyOptions {
  Rock = "A",
  Paper = "B",
  Scissors = "C",
}

const BattleOptions = {
  [MyOptions.Rock]: 1,
  [MyOptions.Paper]: 2,
  [MyOptions.Scissors]: 3,
} as const;

type Battle = [EnemyOptions, MyOptions];

type Input = Battle[];

function parseInput(content: string): Input {
  const rawBattles = content.split(JUMP_LINE);

  return rawBattles.map(
    (rawBattle) => rawBattle.split(SPACE).map((option) => option) as Battle
  );
}

function getBattleResult(battle: Battle): number {
  const [elf, mine] = battle;

  if ((elf as string) === (mine as string)) {
    return RoundResult.Draw;
  }

  switch (elf) {
    case EnemyOptions.Paper:
      switch (mine) {
        case MyOptions.Scissors:
          return RoundResult.Win;
        case MyOptions.Rock:
          return RoundResult.Loss;
        case MyOptions.Paper:
          return RoundResult.Draw;
      }
    case EnemyOptions.Rock:
      switch (mine) {
        case MyOptions.Paper:
          return RoundResult.Win;
        case MyOptions.Scissors:
          return RoundResult.Loss;
        case MyOptions.Rock:
          return RoundResult.Draw;
      }
    case EnemyOptions.Scissors:
      switch (mine) {
        case MyOptions.Rock:
          return RoundResult.Win;
        case MyOptions.Paper:
          return RoundResult.Loss;
        case MyOptions.Scissors:
          return RoundResult.Draw;
      }
  }
}

function getBattleOptionPoints([, mine]: Battle): number {
  return BattleOptions[mine];
}

function getResults(rounds: Input): number {
  return rounds
    .map((battle) => getBattleOptionPoints(battle) + getBattleResult(battle))
    .reduce((prev, acc) => prev + acc, 0);
}

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });
  const parsed = parseInput(content);

  const points = getResults(parsed);

  switch (star) {
    case "first":
      return points;
    case "second":
      return points;
  }
}

// entrypoint
(() => {
  const result = main({ star: "first", day: 2, type: "test" });
  console.log({ result });
})();
