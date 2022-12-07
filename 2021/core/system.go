package core

import (
	"fmt"
	"runtime"

	"github.com/otiai10/copy"
)

// wrapper over github.com/otiai10/copy
func CopyFolder(source string, destination string) bool {
	err := copy.Copy(source, destination)
	return err == nil
}

// bytes to kilo-bytes
func bToKb(b uint64) uint64 {
	return b / 1024
}

type AllocStats struct {
	Allocated      uint64
	TotalAllocated uint64
}

// Source: https://gist.github.com/j33ty/79e8b736141be19687f565ea4c6f4226
func GetMemoryUsage() AllocStats {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)

	// For info on each, see: https://golang.org/pkg/runtime/#MemStats
	return AllocStats{
		Allocated:      bToKb(m.Alloc),
		TotalAllocated: bToKb(m.TotalAlloc),
	}
}

func DisplayMemoryUsage(usage AllocStats) {
	fmt.Println("Allocated =", usage.Allocated, "KiB\t", "Total Allocated =", usage.TotalAllocated, "KiB")
}
