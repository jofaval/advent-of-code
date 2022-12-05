package day11

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/fatih/color"
	"jofaval.advent-of-code/2021/core"
)

const (
	star  = core.FirstStar
	day   = 11
	input = core.ExampleInput

	PreFlashingNumber = 9
	RecentlyFlashed   = 0
	NotPlaced         = -1
)

type Octopus = int

type Row = [10]Octopus

type Grid = [10]Row

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

func doesGridHaveOctopusesReadyToFlash(grid Grid) bool {
	hasFlashesReady := false
	mapGrid(grid, func(col int, rowIndex int, colIndex int) int {
		hasFlashesReady = hasFlashesReady || col > PreFlashingNumber
		return col
	})

	return hasFlashesReady
}

func incrementGrid(grid Grid) Grid {
	return mapGrid(grid, func(col int, rowIndex int, colIndex int) int {
		return col + 1
	})
}

func setFlashAsRecentlyFlashed(grid Grid) Grid {
	return mapGrid(grid, func(col int, rowIndex int, colIndex int) int {
		if col > PreFlashingNumber {
			return RecentlyFlashed
		}

		return col
	})
}

func flashEffect(grid Grid, x int, y int) Grid {
	if grid[x][y] == RecentlyFlashed {
		return grid
	}

	grid[x][y] = grid[x][y] + 1

	return grid
}

func flash(grid Grid, x int, y int) Grid {
	// top row
	if x > 0 && y > 0 {
		grid = flashEffect(grid, x-1, y-1)
	}
	if x > 0 {
		grid = flashEffect(grid, x-1, y)
	}
	if x > 0 && y < len(grid[0])-1 {
		grid = flashEffect(grid, x-1, y+1)
	}

	// middle row
	if y > 0 {
		grid = flashEffect(grid, x, y-1)
	}
	grid[x][y] = RecentlyFlashed
	if y < len(grid[0])-1 {
		grid = flashEffect(grid, x, y+1)
	}

	// bottom row
	if x < len(grid)-1 && y > 0 {
		grid = flashEffect(grid, x+1, y-1)
	}
	if x < len(grid)-1 {
		grid = flashEffect(grid, x+1, y)
	}
	if x < len(grid)-1 && y < len(grid[0])-1 {
		grid = flashEffect(grid, x+1, y+1)
	}

	return grid
}

func flashIfPossible(grid Grid, firstPass bool) (Grid, int) {
	flashes := 0

	for x, row := range grid {
		for y, col := range row {
			if !firstPass && col <= PreFlashingNumber {
				continue
			} else if firstPass && col < PreFlashingNumber {
				continue
			}

			grid = flash(grid, x, y)
			flashes++
		}
	}

	return grid, flashes
}

func countFlashes(grid Grid, days int) int {
	flashes := 0
	newFlashes := 0

	for dayIndex := 0; dayIndex < days; dayIndex++ {
		grid, newFlashes = flashIfPossible(grid, true)
		grid = incrementGrid(grid)
		grid, newFlashes = flashIfPossible(grid, false)

		// while-loop
		for doesGridHaveOctopusesReadyToFlash(grid) {
			grid, newFlashes = flashIfPossible(grid, false)
			flashes += newFlashes
			grid = setFlashAsRecentlyFlashed(grid)
		}

		displayLabel("After step", strconv.Itoa(dayIndex+1)+":")
		displayGrid(grid)
	}

	return flashes
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

	displayLabel("Initially, before any step")
	displayGrid(grid)

	days := 0
	switch star {
	case core.FirstStar:
		// days = 100
		days = 2
		// days = 1
	case core.SecondStar:
		days = 1
	}

	totalFlashes := countFlashes(grid, days)

	switch star {
	case core.FirstStar:
		return totalFlashes
	case core.SecondStar:
		return 1
	}

	return -1
}
