package day$DAY

import (
	"reflect"

	"jofaval.advent-of-code/2021/core"
)

const (
	star  = core.FirstStar
	day   = $DAY
	input = core.ExampleInput
)

type Input struct {
}

func parseContent(content string) Input {
	return Input{}
}

func Main() int {
	content := core.ReadInput(core.AdventOfCodeProps{
		Star:  star,
		Day:   day,
		Input: input,
	})

	result := parseContent(content)
	println(reflect.TypeOf(result))

	switch star {
	case core.FirstStar:
		return 0
	case core.SecondStar:
		return 1
	}

	return -1
}
