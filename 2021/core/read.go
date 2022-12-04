package core

import (
	"fmt"
	"os"
)

const (
	Example = iota
	Test    = iota
)

type AdventOfCodeProps struct {
	star  string
	day   int
	input int
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
