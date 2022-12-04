package core

import (
	"os"
	"path/filepath"
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

func GetWorkingDirectory() string {
	workingDirectory, err := os.Getwd()
	if err != nil {
		panic(err)
	}
	return workingDirectory
}

func getDataFilename(input int) string {
	dataFile := ""

	switch input {
	case ExampleInput:
		dataFile += "example"
	case TestInput:
		dataFile += "input"
	}

	dataFile += ".txt"

	return dataFile
}

func ReadInput(props AdventOfCodeProps) string {
	workingDirectory := GetWorkingDirectory()

	content, err := os.ReadFile(filepath.Join(workingDirectory, "day-"+PadDay(props.Day), "data", getDataFilename(props.Input)))

	if err != nil {
		panic(err)
	}

	return string(content)
}
