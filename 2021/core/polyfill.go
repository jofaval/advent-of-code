package core

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"strconv"
)

// Attempts to find a needle (subelement) in a haystack (array of elements).
//
// Not type-safe
func Contains[T comparable](haystack []T, needle any) bool {
	for _, value := range haystack {
		if value == needle {
			return true
		}
	}

	return false
}

func PadNumberWithZeros(number int, amount int) string {
	return fmt.Sprintf("%0"+strconv.Itoa(amount)+"d", number)
}

func PadDay(day int) string {
	return PadNumberWithZeros(day, 2)
}

func ReplaceContent(filename string, candidate string, replacement string) bool {
	input, err := ioutil.ReadFile(filename)
	if err != nil {
		panic(err)
	}

	output := bytes.Replace(input, []byte(candidate), []byte(replacement), -1)
	if err = ioutil.WriteFile(filename, output, 0666); err != nil {
		panic(err)
	}

	return true
}
