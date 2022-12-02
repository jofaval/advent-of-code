import { JUMP_LINE, MainProps, readInput, SPACE } from "../__core__";

const RoundResult = {
  Draw: 3,
  Loss: 0,
  Win: 6,
} as const;

enum EnemyOptions {
  Rock = "A",
  Paper = "B",
  Scissors = "C",
}

enum MyOptions {
  Rock = "X",
  Paper = "Y",
  Scissors = "Z",
}

const EnemyOptionsDictionary = {
  [EnemyOptions.Rock]: MyOptions.Rock,
  [EnemyOptions.Paper]: MyOptions.Paper,
  [EnemyOptions.Scissors]: MyOptions.Scissors,
} as const;

enum DesiredOutcome {
  Loss = "X",
  Draw = "Y",
  Win = "Z",
}

const WinGuide = {
  [EnemyOptions.Rock]: MyOptions.Paper,
  [EnemyOptions.Paper]: MyOptions.Scissors,
  [EnemyOptions.Scissors]: MyOptions.Rock,
} as const;

const LossGuide = {
  [EnemyOptions.Paper]: MyOptions.Rock,
  [EnemyOptions.Scissors]: MyOptions.Paper,
  [EnemyOptions.Rock]: MyOptions.Scissors,
} as const;

const BattleOptions = {
  [MyOptions.Rock]: 1,
  [MyOptions.Paper]: 2,
  [MyOptions.Scissors]: 3,
} as const;

type Battle = [EnemyOptions, MyOptions];

type Input = Battle[];

function parseInput(content: string): Input {
  const rawBattles = content.split(JUMP_LINE).filter(Boolean);

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

function withDesiredOutcome(rounds: Input): Input {
  return rounds.map(([elf, outcome]) => {
    let mine = "";

    switch (outcome as string as DesiredOutcome) {
      case DesiredOutcome.Draw:
        mine = EnemyOptionsDictionary[elf];
        break;

      case DesiredOutcome.Win:
        mine = WinGuide[elf];
        break;

      case DesiredOutcome.Loss:
        mine = LossGuide[elf];
        break;
    }

    return [elf, mine as MyOptions];
  });
}

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });
  let rounds = parseInput(content);

  if (star === "second") {
    rounds = withDesiredOutcome(rounds);
  }

  const points = getResults(rounds);

  switch (star) {
    case "first":
      return points;
    case "second":
      return points;
  }
}

// entrypoint
(() => {
  const result = main({ star: "second", day: 2, type: "test" });
  console.log({ result });
})();
