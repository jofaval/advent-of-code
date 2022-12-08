package day24

import (
	"fmt"
	"math"
	"strconv"
	"strings"

	"jofaval.advent-of-code/2021/core"
)

const (
	star  = core.FirstStar
	day   = 24
	input = core.TestInput

	InitAluValue int = 0
)

type Operations string

const (
	Input    Operations = "inp"
	Add      Operations = "add"
	Multiply Operations = "mul"
	Divide   Operations = "div"
	Modulo   Operations = "mod"
	Equal    Operations = "eql"
)

type Instruction struct {
	operation Operations
	first     string
	second    string
}

func createInstructionFromRaw(raw string) Instruction {
	instruction := Instruction{}

	for index, value := range strings.Split(raw, " ") {
		switch index {
		case 0:
			instruction.operation = Operations(value)
		case 1:
			instruction.first = value
		case 2:
			instruction.second = value
		}
	}

	return instruction
}

func parseContent(content string) []Instruction {
	instructions := []Instruction{}

	for _, raw := range strings.Split(content, "\n") {
		instructions = append(instructions, createInstructionFromRaw(raw))
	}

	return instructions
}

type Alu = map[string]int

func getAluValue(alu Alu, key string) int {
	value := InitAluValue

	if parsed, err := strconv.ParseInt(key, 10, 64); err == nil {
		value = int(parsed)
	} else {
		value = alu[key]
	}

	return value
}

func inputInstruction(alu Alu, ins Instruction) Alu {
	// hardcoded resolution
	alu[ins.first] = core.ParseInt(ins.second)
	return alu
}

func addInstruction(alu Alu, ins Instruction) Alu {
	first := getAluValue(alu, ins.first)
	second := getAluValue(alu, ins.second)

	result := first + second

	alu[ins.first] = result
	return alu
}

func multiplyInstruction(alu Alu, ins Instruction) Alu {
	first := getAluValue(alu, ins.first)
	second := getAluValue(alu, ins.second)

	result := first * second

	alu[ins.first] = result
	return alu
}

func divideInstruction(alu Alu, ins Instruction) Alu {
	first := getAluValue(alu, ins.first)
	second := getAluValue(alu, ins.second)

	if second == 0 {
		return alu
	}

	result := int(first / second)

	alu[ins.first] = result
	return alu
}

func moduloInstruction(alu Alu, ins Instruction) Alu {
	first := getAluValue(alu, ins.first)
	second := getAluValue(alu, ins.second)

	if first < 0 || second <= 0 {
		return alu
	}

	result := first % second

	alu[ins.first] = result
	return alu
}

func equalInstruction(alu Alu, ins Instruction) Alu {
	equal := getAluValue(alu, ins.first) == getAluValue(alu, ins.second)

	alu[ins.first] = 0
	if equal {
		alu[ins.first] = 1
	}

	return alu
}

func compute(alu Alu, ins Instruction) Alu {
	switch ins.operation {
	case Input:
		alu = inputInstruction(alu, ins)
	case Add:
		alu = addInstruction(alu, ins)
	case Multiply:
		alu = multiplyInstruction(alu, ins)
	case Divide:
		alu = divideInstruction(alu, ins)
	case Modulo:
		alu = moduloInstruction(alu, ins)
	case Equal:
		alu = equalInstruction(alu, ins)
	}

	return alu
}

func resolve(instructions []Instruction) Alu {
	alu := Alu{}

	// 1_234_567_890_123_4
	for inp := 0; inp >= 1_000_000_000_000_0; inp -= 10 {
		for _, instruction := range instructions {
			alu = compute(alu, instruction)
		}
	}

	return alu
}

func getLargestValidNumber(alu Alu) int {
	max := -int(math.MaxInt)

	for _, value := range alu {
		if value > max {
			max = value
		}
	}

	return max
}

func Main() int {
	content := core.ReadInput(core.AdventOfCodeProps{
		Star:  star,
		Day:   day,
		Input: input,
	})

	instructions := parseContent(content)
	fmt.Println(instructions)
	alu := resolve(instructions)
	fmt.Println(alu)

	switch star {
	case core.FirstStar:
		return getLargestValidNumber(alu)
	case core.SecondStar:
		return 1
	}

	return -1
}
