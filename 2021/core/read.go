package core

import (
	"os"
	"path/filepath"
	"strings"
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

func GetDayFolderName(day int) string {
	return "day-" + PadDay(day)
}

func sanitizeContent(content []byte) string {
	contentAsString := string(content)
	sanitizedContent := strings.TrimRight(contentAsString, "\n ")
	sanitizedContent = strings.ReplaceAll(sanitizedContent, "\r", "")

	return sanitizedContent
}

func ReadInput(props AdventOfCodeProps) string {
	workingDirectory := GetWorkingDirectory()

	inputFilename := getDataFilename(props.Input)
	dataPath := filepath.Join(workingDirectory, GetDayFolderName(props.Day), "data", inputFilename)
	content, err := os.ReadFile(dataPath)

	if err != nil {
		panic(err)
	}

	sanitizedContent := sanitizeContent(content)
	if len(sanitizedContent) <= 0 {
		panic("The contents of \"" + dataPath + "\" are empty. Make sure \"" + inputFilename + "\" has content.")
	}

	return sanitizedContent
}
