package core

func SumArray(array []int) int {
	total := 0

	for _, element := range array {
		total += element
	}

	return total
}

func SumArrayUint(array []uint) uint {
	total := uint(0)

	for _, element := range array {
		total += element
	}

	return total
}
