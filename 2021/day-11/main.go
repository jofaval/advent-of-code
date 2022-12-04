package day11

import (
	"jofaval.advent-of-code/2021/core"
)

func Main() int {
	result := 0
	content := core.Read(core.AdventOfCodeProps{
		Star:  core.FirstStar,
		Day:   11,
		Input: core.ExampleInput,
	})

	if content != "" {
		result = 1
	}

	return result
}
