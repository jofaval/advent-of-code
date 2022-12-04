# 2021

This was the year I initialize heard from Advent of Code, recomended by a great friend of mine, I started with Javascript, my approach all messy (structure-wise).

This time around I'm using Golang.

## Contents

1. [Execute the challenges](#execute-the-challenges)
1. [CLI - Create a day](#cli---create-a-day)
1. [Structure](#structure)
1. [CLI - Run a challenge(day)](#cli---run-a-challengeday)

## Execute the challenges

[Back to contents](#contents)

You'll need to install Golang, which you can do at their [official website](https://go.dev/dl/).

## CLI - Create a day

[Back to contents](#contents)

From the root of this year (../2021):

```bash
go run main.go create [day number]
```

It will generate everything you may need, except the executor linking.

### Link the execution

1. Go to [`./cli/days_config.go`](./cli/days_config.go)
1. Import the day package
1. Manually add the following line

```go
// ./cli/days_config.go

10	// Executors linking
11	daysExecutors[DAY_NUMBER] = dayDAY_NUMBER.Main
```

## Structure

[Back to contents](#contents)

- day-[Number], one folder per day/pack of challenges
  - data, a folder to contain all the data per day
    - example.txt, a given set of data to play around
    - input.txt, the real, personalized input data, exclusive for submission
  - main.go, the entrypoint to the challenge resolution
  - run.sh, an execution utility
  - README.md, the set of instructions and answers

## CLI - Run a challenge(day)

[Back to contents](#contents)

Same as the create CLI, you must be at the root of this year (../2021):

```bash
go run main.go run [day number]
```
