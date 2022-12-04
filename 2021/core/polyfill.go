package core

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
