package core

import (
	"fmt"
	"os"
	"strconv"
)

func Cli() {
	if len(os.Args) < 3 {
		panic("Not enough arguments provided, \"go run main.go [run|create] [day]\"")
	}

	if !Contains([]string{"run", "create"}, os.Args[1]) {
		panic("The provided action does not sastisfy the requirements, [run|create]")
	}

	if _, err := strconv.Atoi(os.Args[2]); err != nil {
		panic("The given day was not detected as a number")
	}

	fmt.Println(os.Args[1])
}
