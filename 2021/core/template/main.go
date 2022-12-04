package day$DAY

import (
	"jofaval.advent-of-code/2021/core"
)

func Main() int {
	result := 0
	content := core.ReadInput(core.AdventOfCodeProps{
		Star:  core.FirstStar,
		Day:   $DAY,
		Input: core.ExampleInput,
	})

	if content != "" {
		result = 1
	}

	return result
}
