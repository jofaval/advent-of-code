package day6

import (
	"fmt"
	"strconv"
	"strings"

	"jofaval.advent-of-code/2021/core"
)

const (
	star  = core.SecondStar
	day   = 6
	input = core.TestInput

	RebornsAt  int = 0
	RespawnsAt int = 6
	NewbornAt  int = 8
)

// [day] -> number of lanternfishes per day
type Lanternfishes = map[int]int

func parseContent(content string) Lanternfishes {
	fishes := Lanternfishes{}

	for _, fish := range strings.Split(content, ",") {
		day := core.ParseInt(fish)
		fishes[day]++
	}

	if _, ok := fishes[7]; !ok {
		fishes[7] = 0
	}

	if _, ok := fishes[8]; !ok {
		fishes[8] = 0
	}

	return fishes
}

func evolve(fishes Lanternfishes) Lanternfishes {
	temp := fishes[0]

	for day := 0; day <= NewbornAt; day++ {
		fishes[day] = fishes[(day + 1)]
	}

	// the birth effect
	fishes[RespawnsAt] += temp
	fishes[NewbornAt] = temp

	return fishes
}

func countFishes(fishes Lanternfishes) int {
	total := 0

	for _, numberOfFishes := range fishes {
		total += numberOfFishes
	}

	return total
}

func displaySimulation(fishes Lanternfishes, day int) string {
	total := countFishes(fishes)
	log := fmt.Sprintf("After %02s (total=%3d):", strconv.Itoa((day + 1)), total)

	for key := 0; key <= NewbornAt; key++ {
		fish := fishes[key]
		if fish <= 0 {
			fish = 0
		}
		log += fmt.Sprintf("| %d:%3d ", key, fish)
	}

	log += strings.Repeat("\n", 1)

	return log
}

func simulateEvolution(fishes Lanternfishes, totalDays int) int {
	// initial day
	log := displaySimulation(fishes, -1)

	for day := 0; day < totalDays; day++ {
		fishes = evolve(fishes)
		log += displaySimulation(fishes, day)
	}

	// Use for debuggin purposes, or viz, if you want
	// but it will get messier exponentially
	// fmt.Println(log)

	return countFishes(fishes)
}

func Main() int {
	content := core.ReadInput(core.AdventOfCodeProps{
		Star:  star,
		Day:   day,
		Input: input,
	})

	fishes := parseContent(content)

	days := 0
	switch star {
	case core.FirstStar:
		days = 80
		// days = 18
	case core.SecondStar:
		days = 256
	}

	return simulateEvolution(fishes, days)
}
