package day11

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/fatih/color"
	"jofaval.advent-of-code/2021/core"
)

const (
	star  = core.SecondStar
	day   = 11
	input = core.TestInput

	PreFlashingNumber = 9
	RecentlyFlashed   = 0
	NotPlaced         = -1

	Size = 10
)

type Octopus = int

type Row = [Size]Octopus

type Grid = [Size]Row

func parseContent(content string) Grid {
	rows := Grid{}

	for rowIndex, row := range strings.Split(content, "\n") {
		newRow := Row{}

		for cellIndex, cell := range strings.Split(row, "") {
			converted, err := strconv.Atoi(cell)
			if err != nil {
				panic(err)
			}
			newRow[cellIndex] = converted
		}

		rows[rowIndex] = newRow
	}

	return rows
}

type MapGridCallabe = func(col int, rowIndex int, colIndex int) int

func mapGrid(grid Grid, callable MapGridCallabe) Grid {
	for rowIndex, row := range grid {
		for colIndex, col := range row {
			result := callable(col, rowIndex, colIndex)
			if result == NotPlaced {
				continue
			}

			grid[rowIndex][colIndex] = result
		}
	}

	return grid
}

func incrementGrid(grid Grid) Grid {
	return mapGrid(grid, func(col int, rowIndex int, colIndex int) int {
		return col + 1
	})
}

func incrementAndCheckFlash(grid Grid, x int, y int) Grid {
	if grid[x][y] == RecentlyFlashed {
		return grid
	}

	grid[x][y] = grid[x][y] + 1
	if grid[x][y] > PreFlashingNumber {
		grid = flash(grid, x, y)
	}

	return grid
}

func flash(grid Grid, x int, y int) Grid {
	grid[x][y] = RecentlyFlashed

	// top row
	if x > 0 {
		if y > 0 {
			grid = incrementAndCheckFlash(grid, x-1, y-1)
		}
		grid = incrementAndCheckFlash(grid, x-1, y)
		if y < len(grid[0])-1 {
			grid = incrementAndCheckFlash(grid, x-1, y+1)
		}
	}

	// middle row
	if y > 0 {
		grid = incrementAndCheckFlash(grid, x, y-1)
	}
	if y < len(grid[0])-1 {
		grid = incrementAndCheckFlash(grid, x, y+1)
	}

	// bottom row
	if x < len(grid)-1 {
		if y > 0 {
			grid = incrementAndCheckFlash(grid, x+1, y-1)
		}
		grid = incrementAndCheckFlash(grid, x+1, y)
		if y < len(grid[0])-1 {
			grid = incrementAndCheckFlash(grid, x+1, y+1)
		}
	}

	return grid
}

func checkFlashGrid(grid Grid) Grid {
	for x := 0; x < Size; x++ {
		for y := 0; y < Size; y++ {
			if grid[x][y] > PreFlashingNumber {
				grid = flash(grid, x, y)
			}
		}
	}

	return grid
}

func countFlashes(grid Grid) (int, bool) {
	flashes := 0
	synchronized := true

	mapGrid(grid, func(col, rowIndex, colIndex int) int {
		hasFlashed := col == RecentlyFlashed
		synchronized = synchronized && hasFlashed
		if hasFlashed {
			flashes++
		}
		return col
	})

	return flashes, synchronized
}

func evolve(grid Grid, steps int, stopWhenSynchronized bool) (int, int) {
	flashes := 0
	newFlashes := 0
	synchronizedStep := 0
	areSynchronized := false

	if stopWhenSynchronized {
		steps = 1_000_000
	}

	for stepIndex := 0; stepIndex < steps; stepIndex++ {
		grid = incrementGrid(grid)
		grid = checkFlashGrid(grid)
		newFlashes, areSynchronized = countFlashes(grid)
		flashes += newFlashes

		if stopWhenSynchronized && areSynchronized {
			synchronizedStep = stepIndex + 1
			break
		}

		// Uncomment for the step-by-step tracing
		// displayLabel("After step", strconv.Itoa(stepIndex+1)+":")
		// displayGrid(grid)
	}

	return flashes, synchronizedStep
}

func displayLabel(labels ...any) {
	fmt.Println()
	fmt.Println(labels...)
	fmt.Println()
}

func displayCol(col int) {
	if col == RecentlyFlashed {
		color.New(color.FgGreen).Add(color.Bold).Print(col)
	} else {
		fmt.Print(col)
	}

	fmt.Print(" ")
}

func displayGrid(grid Grid) {
	fmt.Println()
	for _, row := range grid {
		for _, col := range row {
			displayCol(col)
		}
		fmt.Println()
	}
	fmt.Println()
}

func Main() int {
	content := core.ReadInput(core.AdventOfCodeProps{
		Star:  star,
		Day:   day,
		Input: input,
	})

	grid := parseContent(content)

	// Uncomment for the step-by-step tracing
	// displayLabel("Initially, before any step")
	// displayGrid(grid)

	steps := 100

	flashes, synchronized := evolve(grid, steps, star == core.SecondStar)

	switch star {
	case core.FirstStar:
		return flashes
	case core.SecondStar:
		return synchronized
	}

	return -1
}
