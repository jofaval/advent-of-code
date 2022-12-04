package core

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
)

func Cli() {
	if len(os.Args) < 3 {
		panic("Not enough arguments provided, \"go run main.go [run|create] [day]\"")
	} else if len(os.Args) < 3 {
		panic("Too many arguments provided, \"go run main.go [run|create] [day]\"")
	}

	var action = os.Args[1]

	if !Contains([]string{"run", "create"}, action) {
		panic("The provided action does not sastisfy the requirements, [run|create]")
	}

	var day = os.Args[2]
	parsedDay, err := strconv.Atoi(day)

	if err != nil {
		panic("The given day was not detected as a number")
	}

	switch action {
	case "run":
		runDay(parsedDay)
		return
	case "create":
		createDay(parsedDay)
		return
	}
}

func createDay(day int) {
	fmt.Println("Attempting to create day", day)

	workingDirectory, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	paddedDay := PadDay(day)
	templateFolder := filepath.Join(workingDirectory, "core", "template")
	dayFolder := filepath.Join(workingDirectory, "day-"+paddedDay)

	success := CopyFolder(templateFolder, dayFolder)
	if success {
		fmt.Println("Folder successfully created at:", dayFolder, "from:", templateFolder)
	} else {
		fmt.Println("Could not create the folder for day:", day)
		return
	}

	ReplaceContent(filepath.Join(dayFolder, "run.sh"), "$DAY", paddedDay)
	ReplaceContent(filepath.Join(dayFolder, "main.go"), "$DAY", strconv.Itoa(day))
}

func runDay(day int) {
	fmt.Println("Attempting to run day", day)
}
