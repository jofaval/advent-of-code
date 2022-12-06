package day15

import (
	"fmt"
	"strings"

	"github.com/fatih/color"
	"jofaval.advent-of-code/2021/core"
)

const (
	star  = core.FirstStar
	day   = 15
	input = core.ExampleInput
)

type RiskLevel = int

type Cave = [][]RiskLevel

type Input = Cave

type Coordinates struct {
	x    int
	y    int
	risk RiskLevel
}

type Risks = []Coordinates

func parseContent(content string) Input {
	cave := Cave{}

	for _, rawRow := range strings.Split(content, "\n") {
		row := []RiskLevel{}
		for _, rawRiskLevel := range strings.Split(rawRow, "") {
			riskLevel := core.ParseInt(rawRiskLevel)
			row = append(row, riskLevel)
		}
		cave = append(cave, row)
	}

	return cave
}

func getToDestination(cave Cave) Risks {
	risks := Risks{}
	width, height := len(cave[0]), len(cave)
	x, y := 0, 0

	for x < (width-1) || y < (height-1) {
		isWidthAtLimit := x+1 < width
		isHeightAtLimit := y+1 < height
		if isWidthAtLimit && isHeightAtLimit {
			if cave[x][y+1] < cave[x+1][y] {
				y++
			} else {
				x++
			}
		} else if isWidthAtLimit {
			x++
		} else if isHeightAtLimit {
			x++
		}

		risks = append(risks, Coordinates{
			x:    x,
			y:    y,
			risk: cave[x][y],
		})
	}

	return risks
}

func calculateTotalRisk(risks Risks) int {
	totalRisk := 0

	for _, coordinate := range risks {
		totalRisk += coordinate.risk
	}

	return totalRisk
}

func wasCoordinateSelected(risks Risks, x int, y int) bool {
	for _, coordinate := range risks {
		if coordinate.x == x && coordinate.y == y {
			return true
		}
	}

	return false
}

func displayRiskLevel(risks Risks, x int, y int, col int) {
	if wasCoordinateSelected(risks, x, y) {
		color.New(color.FgYellow).Add(color.Bold).Print(col)
	} else {
		color.New(color.FgHiMagenta).Print(col)
	}
	fmt.Print(" ")
}

func displayCave(cave Cave, risks Risks) {
	fmt.Println()
	for x, row := range cave {
		for y, col := range row {
			displayRiskLevel(risks, x, y, col)
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

	cave := parseContent(content)
	displayCave(cave, Risks{})

	risks := getToDestination(cave)
	displayCave(cave, risks)
	totalRisk := calculateTotalRisk(risks)

	switch star {
	case core.FirstStar:
		return totalRisk
	case core.SecondStar:
		return 1
	}

	return -1
}
