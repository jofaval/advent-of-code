package cli

import (
	day11 "jofaval.advent-of-code/2021/day-11"
	// day$DAY "jofaval.advent-of-code/2021/day-$DAY"
)

func getDaysExecutors() map[int]func() int {
	daysExecutors := make(map[int]func() int)

	// Executors linking
	// daysExecutors[$DAY] = day$DAY.Main
	daysExecutors[11] = day11.Main

	return daysExecutors
}

func defaultExecutorResponse() int {
	return -1
}

func GetDayExecutorFor(day int) func() int {
	executorsMap := getDaysExecutors()
	if executor, ok := executorsMap[day]; ok {
		return executor
	}

	return defaultExecutorResponse
}
