package day1

import (
	"math"
	"strings"

	"jofaval.advent-of-code/2021/core"
)

const (
	star  = core.FirstStar
	day   = 1
	input = core.TestInput
)

type Input = []int

func parseContent(content string) Input {
	numbers := []int{}
	for _, rawNumber := range strings.Split(content, "\n") {
		numbers = append(numbers, core.ParseInt(rawNumber))
	}
	return numbers
}

func numberOfIncreasingTimes(numbers []int, prevSize int) int {
	times := 0
	prev := math.MaxInt

	for _, current := range numbers {
		if current > prev {
			times++
		}
		prev = current
	}

	return times
}

func Main() int {
	content := core.ReadInput(core.AdventOfCodeProps{
		Star:  star,
		Day:   day,
		Input: input,
	})

	numbers := parseContent(content)

	prevSize := 0
	switch star {
	case core.FirstStar:
		prevSize = 1
	case core.SecondStar:
		prevSize = 3
	}

	return numberOfIncreasingTimes(numbers, prevSize)
}
