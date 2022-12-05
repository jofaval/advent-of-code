# 2022

Done with Typescript at first

## Contents

1. [Installation/Setup](#installationsetup)
1. [Create from template](#create-from-template)
1. [Structure](#structure)
1. [Challenges](#challenges)

## Installation/Setup

[Back to contents](#contents)

```bash
pnpm install # or npm or yarn
```

If you decide to run this project, you'll be needing to build typescript.
I'm running the following command on a parallel terminal:

```bash
pnpm run watch:ts
```

## Create from template

[Back to contents](#contents)

It's a very basic script, with barely no type validation whatsoever

```bash
pnpm run create [Day]
```

Example:

```bash
pnpm run create 2
```

Will generate the [day-02](./day-02/) folder

## Structure

[Back to contents](#contents)

All files should follow the following structure:

- day-[Number of the day]
  - main.ts (optional, but recomended)
  - first, _to complete the first start_
    - example-input.txt, _provided by the challenge_
    - input.txt, _required to submit the challenge_
  - second, _after completing the first start_
    - example-input.txt, _provided by the challenge_
    - input.txt, _required to submit the challenge_

## Challenges

[Back to contents](#contents)

1. [Day 1](./day-01/)
1. [Day 2](./day-02/)
1. [Day 3](./day-03/)
1. [Day 4](./day-04/)
1. [Day 5](./day-05/)
<!-- Next day -->
