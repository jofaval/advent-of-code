package day12

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/fatih/color"
	"jofaval.advent-of-code/2021/core"
)

const (
	star  = core.SecondStar
	day   = 13
	input = core.TestInput

	Empty = 0
	Dot   = 1
)

type CoordinateEnum string

const (
	HorizontalFolding CoordinateEnum = "x"
	VerticalFolding   CoordinateEnum = "y"
)

type Fold struct {
	coordinate CoordinateEnum
	amount     int
}

type Coordinate struct {
	x int
	y int
}

type Input struct {
	coordinates []Coordinate
	folds       []Fold
}

type Paper = [][]int

func parseCoordinates(raw string) []Coordinate {
	coordinates := []Coordinate{}

	for _, rawCoordinate := range strings.Split(raw, "\n") {
		splitted := strings.Split(rawCoordinate, ",")

		x, err := strconv.Atoi(splitted[1])
		if err != nil {
			panic(err)
		}

		y, err := strconv.Atoi(splitted[0])
		if err != nil {
			panic(err)
		}

		coordinates = append(coordinates, Coordinate{
			x: x,
			y: y,
		})
	}

	return coordinates
}

func parseFolds(raw string) []Fold {
	folds := []Fold{}

	for _, rawFold := range strings.Split(raw, "\n") {
		components := strings.Split(rawFold, " ")
		equation := components[len(components)-1]
		splittedEquation := strings.Split(equation, "=")

		coordinate := splittedEquation[0]
		amount, err := strconv.Atoi(splittedEquation[1])
		if err != nil {
			panic(err)
		}

		folds = append(folds, Fold{
			coordinate: CoordinateEnum(coordinate),
			amount:     amount,
		})
	}

	return folds
}

func parseContent(content string) Input {
	splittedContent := strings.Split(content, "\n\n")

	coordinates := parseCoordinates(splittedContent[0])
	folds := parseFolds(splittedContent[1])

	return Input{
		coordinates: coordinates,
		folds:       folds,
	}
}

func getPaperSize(coordinates []Coordinate) (int, int) {
	maxWidth, maxHeight := 0, 0

	for _, coordinate := range coordinates {
		if coordinate.x > maxWidth {
			maxWidth = coordinate.x
		}

		if coordinate.y > maxHeight {
			maxHeight = coordinate.y
		}
	}

	return maxWidth, maxHeight
}

func generatePaper(coordinates []Coordinate) Paper {
	maxWidth, maxHeight := getPaperSize(coordinates)
	paper := [][]int{}

	for x := 0; x <= maxWidth; x++ {
		row := []int{}
		for y := 0; y <= maxHeight; y++ {
			row = append(row, Empty)
		}
		paper = append(paper, row)
	}

	for _, coordinate := range coordinates {
		paper[coordinate.x][coordinate.y] = Dot
	}

	if maxHeight%2 == 0 {
		paper = preppendVertically(paper)
	}

	if maxWidth%2 == 0 {
		paper = preppendHorizontally(paper)
	}

	return paper
}

func preppendVertically(paper Paper) Paper {
	line := []int{}
	for _, row := range paper {
		if len(line) <= 0 {
			for rowIndex := 0; rowIndex < len(row); rowIndex++ {
				line = append(line, Empty)
			}
		}
	}
	paper = append(paper, line)
	return paper
}

func preppendHorizontally(paper Paper) Paper {
	for rowIndex, row := range paper {
		paper[rowIndex] = append(row, Empty)
	}
	return paper
}

func foldHorizontally(paper Paper, fold Fold) Paper {
	for x := 0; x < len(paper); x++ {
		for y := 0; y < fold.amount; y++ {
			if paper[x][y] == Dot {
				continue
			}

			mirroredPoint := paper[x][fold.amount+(fold.amount-y)]
			if mirroredPoint == Empty {
				continue
			}

			paper[x][y] = mirroredPoint
		}
	}

	for rowIndex := 0; rowIndex < len(paper); rowIndex++ {
		paper[rowIndex] = paper[rowIndex][:fold.amount]
	}

	return paper
}

func foldVertically(paper Paper, fold Fold) Paper {
	for x := 0; x < fold.amount; x++ {
		for y := 0; y < len(paper[0]); y++ {
			if paper[x][y] == Dot {
				continue
			}

			mirroredPoint := paper[fold.amount+(fold.amount-x)][y]
			if mirroredPoint == Empty {
				continue
			}

			paper[x][y] = mirroredPoint
		}
	}

	return paper[:fold.amount]
}

func foldPaper(paper Paper, fold Fold) Paper {
	switch fold.coordinate {
	case HorizontalFolding:
		paper = foldHorizontally(paper, fold)
	case VerticalFolding:
		paper = foldVertically(paper, fold)
	}

	return paper
}

func fullyFoldPaper(paper Paper, folds []Fold) Paper {
	for _, fold := range folds {
		paper = foldPaper(paper, fold)
	}

	return paper
}

func getTotalDots(paper Paper) int {
	visibleDots := 0

	for _, row := range paper {
		for _, col := range row {
			if col == Dot {
				visibleDots++
			}
		}
	}

	return visibleDots
}

func displayCell(coordinate int) {
	switch coordinate {
	case Empty:
		color.New(color.FgHiBlue).Add(color.Bold).Print(".")
	case Dot:
		color.New(color.FgYellow).Add(color.Bold).Print("#")
	}
}

func displayPaper(paper Paper) {
	fmt.Println()
	for _, row := range paper {
		for _, col := range row {
			displayCell(col)
			fmt.Print(" ")
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

	result := parseContent(content)
	paper := generatePaper(result.coordinates)

	// Don't use on the real input for optimal speed
	if input != core.TestInput {
		displayPaper(paper)
	}

	switch star {
	case core.FirstStar:
		paper = foldPaper(paper, result.folds[0])
	case core.SecondStar:
		paper = fullyFoldPaper(paper, result.folds)
	}

	displayPaper(paper)

	return getTotalDots(paper)
}
