# 2015

**\*** The first year Advent of Code officially started. **\***

## Contents

1. [Background](#background)
1. [Installation](#installation)
   1. [Using a Virtual Environment](#using-a-virtual-environment)
1. [CLI](#cli)
   1. [Structure](#structure)
   1. [Create a day](#create-a-day)
   1. [Run a day](#run-a-day)
1. [Package your python code](#package-your-python-code)
   1. [Install all the necessary packages](#install-all-the-necessary-packages)
   1. [Step by step](#step-by-step)

## Background

[Back to the contents](#contents)

I was feeling a little bit discouraged after some silly little mistakes, I decided to take it easy on myself and I do some old challenges to try my luck

Decided when tackling for the first time: [adventofcode.com/2022/day/9](https://adventofcode.com/2022/day/9)

## Installation

[Back to the contents](#contents)

The ideal would be that no package was required to be installed at all, even tho that's not usually the case.

For the installation of any packages required in this project, run the following command:

```bash
# windows version
python -m pip install -r requirements.txt
# linux version
pip3 install -r requirements.txt
```

And checkout how to generate the package build at [Step by step](#step-by-step).

### Using a Virtual Environment

[Back to the contents](#contents)

Initialize it

```bash
python -m venv aoc_2015_jofaval
```

Activate (use) your newly create venv:

```bash
source aoc_2015_jofaval/Scripts/activate
```

## CLI

[Back to the contents](#contents)

As I've done with [2022](https://github.com/jofaval/advent-of-code/tree/master/2022) and [2021](https://github.com/jofaval/advent-of-code/tree/master/2022) I wanted to create a CLI.

But python's packaging doesn't allow for the flexibility I was provided with in previous languages (Typescript and Golang)

### Structure

[Back to the contents](#contents)

_To be fully defined_

### Create a day

[Back to the contents](#contents)

This would be my proposal, it's still not finalized

```bash
python3 --action create --day 1
# or the shortcut version
python3 -a create -d 1
```

Until it's finally realized, the flow is to copy the [`__template__`](./__template__/) folder.
And replace `__CHANGE_DAY__` for the day you want (`1`, `2`, `3`, etc.)

### Run a day

[Back to the contents](#contents)

It's a "slower" version than other languages, because it dynamically imports the required module, as it computes it on runtime, it's that much slower.

```bash
python3 --action run --day 1
# or the shortcut version
python3 -a run -d 1
```

## Package your python code

[Back to the contents](#contents)

Official docs at: [https://packaging.python.org/en/latest/tutorials/packaging-projects/](https://packaging.python.org/en/latest/tutorials/packaging-projects/)

### Install all the necessary packages

[Back to the contents](#contents)

Refer to [Installation](#installation).

### Step by step

[Back to the contents](#contents)

This step by step "guide" assumes that you've already created the [pyproject.toml](./pyproject.toml) file.

This will be done in Windows (my current OS), but they provide the Linux guide by default.

1. Upgrade pip
   ```bash
   py -m pip install --upgrade pip
   ```
1. Make sure you have a [pyproject.toml](./pyproject.toml) file created
1. Upgrade the build package
   ```bash
   py -m pip install --upgrade build
   ```
1. Generate the distribution files
   ```bash
   py -m build
   ```
1. **_[Optional]_** Upgrade/install the `twine` package
   ```bash
   py -m pip install --upgrade twine
   ```
1. **_[Optional]_** And upload it to the registry
   ```bash
   py -m twine upload --repository testpypi dist/*
   ```
1. **_[Optional]_** Actually install your package
   ```bash
   py -m pip install --index-url https://test.pypi.org/simple/ --no-deps aoc_2015_jofaval
   ```
1. Profit!
