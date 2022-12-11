# 2016

## Contents

1. [Setup and configuration](#setup-and-configuration)
1. [Create a day](#create-a-day)
1. [Run a day](#run-a-day)
1. [Structure](#structure)

## Setup and configuration

[Back to contents](#contents)

I'll do my best not to install or depend on any vendors.

As for my configuration:

- PHP == 7.3.14

## Create a day

[Back to contents](#contents)

From the root of the year (.../advent-of-code/2016):

```bash
php elves make 1
```

## Run a day

[Back to contents](#contents)

From the root of the year (.../advent-of-code/2016):

```bash
php elves run 1
```

## Structure

[Back to contents](#contents)

- day-01, the folder for each day
  - data, a folder for the input data
    - input.txt, the real, personalized data
    - test.txt, the example data
  - main.php, main flow of execution
  - README.md, explanation of the challenge
  - require.php, all of the required imports
  - run.sh, an utility script for execution
