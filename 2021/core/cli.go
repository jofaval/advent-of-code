package core

import (
	"fmt"
	"os"
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
}

func runDay(day int) {
	fmt.Println("Attempting to run day", day)
}
