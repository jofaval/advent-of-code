package main

import (
	"fmt"
	"time"

	"jofaval.advent-of-code/2021/cli"
)

func main() {
	start := time.Now()

	cli.Cli()

	fmt.Println(time.Since(start))
}
