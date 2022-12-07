package day1

import (
	"strings"

	"jofaval.advent-of-code/2021/core"
)

const (
	star  = core.SecondStar
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

func isVectorIncreasing(prev []int, current []int, minSize int) bool {
	if len(prev) < minSize || len(current) < minSize {
		return false
	}

	return core.SumArray(prev) < core.SumArray(current)
}

func appendNumberToVector(vector []int, number int, maxSize int) []int {
	vector = append(vector, number)
	if len(vector) > maxSize {
		vector = vector[1:]
	}
	return vector
}

func numberOfIncreasingTimes(numbers []int, comparisonSize int) int {
	times := 0
	prev, current := []int{}, []int{}

	for _, number := range numbers {
		current = appendNumberToVector(current, number, comparisonSize)

		increases := isVectorIncreasing(prev, current, comparisonSize)
		if increases {
			times++
		}

		prev = appendNumberToVector(prev, number, comparisonSize)
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

	comparisonSize := 0
	switch star {
	case core.FirstStar:
		comparisonSize = 1
	case core.SecondStar:
		comparisonSize = 3
	}

	return numberOfIncreasingTimes(numbers, comparisonSize)
}
