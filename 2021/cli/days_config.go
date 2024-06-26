package cli

import (
	day01 "jofaval.advent-of-code/2021/day-01"
	day06 "jofaval.advent-of-code/2021/day-06"
	day11 "jofaval.advent-of-code/2021/day-11"
	day13 "jofaval.advent-of-code/2021/day-13"
	day15 "jofaval.advent-of-code/2021/day-15"
	day21 "jofaval.advent-of-code/2021/day-21"
	day24 "jofaval.advent-of-code/2021/day-24"
	// day$DAY "jofaval.advent-of-code/2021/day-$DAY"
)

func getDaysExecutors() map[int]func() int {
	daysExecutors := make(map[int]func() int)

	// Executors linking
	daysExecutors[01] = day01.Main
	daysExecutors[06] = day06.Main
	daysExecutors[11] = day11.Main
	daysExecutors[13] = day13.Main
	daysExecutors[15] = day15.Main
	daysExecutors[21] = day21.Main
	daysExecutors[24] = day24.Main
	// daysExecutors[$DAY] = day$DAY.Main

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
