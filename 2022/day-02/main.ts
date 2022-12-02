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

const WinningGuide = {
  [EnemyOptions.Rock]: MyOptions.Paper,
  [EnemyOptions.Paper]: MyOptions.Scissors,
  [EnemyOptions.Scissors]: MyOptions.Rock,
} as const;

const LossingGuide = {
  [EnemyOptions.Paper]: MyOptions.Rock,
  [EnemyOptions.Scissors]: MyOptions.Paper,
  [EnemyOptions.Rock]: MyOptions.Scissors,
} as const;

const BattleOptionsPoints = {
  [MyOptions.Rock]: 1,
  [MyOptions.Paper]: 2,
  [MyOptions.Scissors]: 3,
} as const;

const DesiredOutcomeDictMapping = {
  [DesiredOutcome.Draw]: EnemyOptionsDictionary,
  [DesiredOutcome.Win]: WinningGuide,
  [DesiredOutcome.Loss]: LossingGuide,
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

  if (EnemyOptionsDictionary[elf] === mine) {
    return RoundResult.Draw;
  }

  if (WinningGuide[elf] === mine) {
    return RoundResult.Win;
  }

  return RoundResult.Loss;
}

function getBattleOptionPoints([, mine]: Battle): number {
  return BattleOptionsPoints[mine];
}

function getResults(rounds: Input): number {
  return rounds
    .map((battle) => getBattleOptionPoints(battle) + getBattleResult(battle))
    .reduce((prev, acc) => prev + acc, 0);
}

function withDesiredOutcome(rounds: Input): Input {
  return rounds.map(([elf, outcome]) => {
    return [elf, DesiredOutcomeDictMapping[outcome][elf]];
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
