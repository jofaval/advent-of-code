package cli

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strconv"

	"github.com/fatih/color"
	"jofaval.advent-of-code/2021/core"
)

const (
	RunAction    = "run"
	CreateAction = "create"

	HardcodedDay = "$DAY"
)

func Cli() {
	options := "[" + RunAction + "|" + CreateAction + "]"

	if len(os.Args) < 3 {
		panic("Not enough arguments provided, \"go run main.go " + options + " [day]\"")
	} else if len(os.Args) > 3 {
		panic("Too many arguments provided, \"go run main.go " + options + " [day]\"")
	}

	action := os.Args[1]

	if !core.Contains([]string{RunAction, CreateAction}, action) {
		panic("The provided action does not sastisfy the requirements, " + options + "")
	}

	day := os.Args[2]
	parsedDay, err := strconv.Atoi(day)

	if err != nil {
		panic("The given day was not detected as a number")
	}

	workingDirectory := core.GetWorkingDirectory()

	switch action {
	case RunAction:
		runDay(workingDirectory, parsedDay)
		return
	case CreateAction:
		createDay(workingDirectory, parsedDay)
		return
	}
}

func createDay(workingDirectory string, day int) {
	fmt.Println("Attempting to create day", day)

	paddedDay := core.PadDay(day)
	templateFolder := filepath.Join(workingDirectory, "core", "template")
	dayFolder := filepath.Join(workingDirectory, "day-"+paddedDay)

	success := core.CopyFolder(templateFolder, dayFolder)
	if success {
		fmt.Println("Folder successfully created at:", dayFolder, "from:", templateFolder)
	} else {
		fmt.Println("Could not create the folder for day:", day)
		return
	}

	// in-day configuration
	core.ReplaceContent(filepath.Join(dayFolder, "run.sh"), HardcodedDay, paddedDay)
	core.ReplaceContent(filepath.Join(dayFolder, "main.go"), HardcodedDay, strconv.Itoa(day))

	// cli configuration
	cliDaysConfigFile := filepath.Join(workingDirectory, "cli", "days_config.go")

	// import
	core.ReplaceContent(
		cliDaysConfigFile,
		"	// day$DAY \"jofaval.advent-of-code/2021/day-$DAY\"",
		"	// day$DAY \"jofaval.advent-of-code/2021/day-$DAY\""+
			"\n"+"	day"+paddedDay+" \"jofaval.advent-of-code/2021/day-"+paddedDay+"\"",
	)

	// map configuration
	core.ReplaceContent(
		cliDaysConfigFile,
		"	// daysExecutors[$DAY] = day$DAY.Main",
		"	// daysExecutors[$DAY] = day$DAY.Main"+
			"\n"+"	daysExecutors["+paddedDay+"] = day"+paddedDay+".Main",
	)
}

func runDay(workingDirectory string, day int) {
	fmt.Println("Attempting to run day", day)

	dayFolder := filepath.Join(workingDirectory, core.GetDayFolderName(day))
	if _, err := os.Stat(dayFolder); errors.Is(err, os.ErrNotExist) {
		panic(err)
	}

	result := GetDayExecutorFor(day)()
	color.New(color.FgGreen).Add(color.Italic).Print("Result: ")
	color.New(color.FgYellow).Add(color.Bold).Println(result)
}
