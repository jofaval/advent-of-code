package core

import (
	"fmt"
	"os"
)

const (
	ExampleInput = iota
	TestInput    = iota
	FirstStar    = iota
	SecondStar   = iota
)

type AdventOfCodeProps struct {
	Star  int
	Day   int
	Input int
}

func Read(props AdventOfCodeProps) string {
	var content = ""

	dat, err := os.ReadFile("/tmp/dat")

	if err != nil {
		panic(err)
	}

	fmt.Print(string(dat))

	return content
}
