package main

import (
	"fmt"
	"time"

	"jofaval.advent-of-code/2021/cli"
	"jofaval.advent-of-code/2021/core"
)

func main() {
	memoryUsageStart := core.GetMemoryUsage()
	start := time.Now()

	cli.Cli()

	fmt.Println(time.Since(start))

	memoryUsageEnd := core.GetMemoryUsage()
	core.DisplayMemoryUsage(core.AllocStats{
		TotalAllocated: memoryUsageEnd.TotalAllocated - memoryUsageStart.TotalAllocated,
		Allocated:      memoryUsageEnd.Allocated - memoryUsageStart.Allocated,
	})
}
