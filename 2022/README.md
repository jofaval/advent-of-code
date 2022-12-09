# 2022

Done with Typescript at first

## Contents

1. [Installation/Setup](#installationsetup)
1. [Run a challenge](#run-a-challenge)
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
pnpm run watch:ts # or npm or yarn
```

## Run a challenge

[Back to contents](#contents)

You may want to directly execute a day, you can do so by executing the `run` script, yes, it's a redundant naming, sorry :/.

```bash
pnpm run run [Day] # or npm or yarn
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
1. [Day 6](./day-06/)
1. [Day 7](./day-07/)
1. [Day 8](./day-08/)
1. [Day 9](./day-09/)
<!-- Next day -->
