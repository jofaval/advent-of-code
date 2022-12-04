package conf

import (
	day11 "jofaval.advent-of-code/2021/day-11"
)

func getDaysExecutors() map[int]func() int {
	daysExecutors := make(map[int]func() int)
	daysExecutors[11] = day11.Main

	return daysExecutors
}

func defaultExecturoResponse() int {
	return -1
}

func GetDayExecutorFor(day int) func() int {
	executorsMap := getDaysExecutors()
	if val, ok := executorsMap[day]; ok {
		return val
	}

	return defaultExecturoResponse
}
