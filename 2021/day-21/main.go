package day21

import (
	"fmt"
	"strings"

	"jofaval.advent-of-code/2021/core"
)

const (
	star  = core.FirstStar
	day   = 21
	input = core.TestInput

	RollsPerPlayer             uint = 3
	MinDeterministicDiceAmount uint = 1
	MaxDeterministicDiceAmount uint = 100

	MinStep         uint = 1
	MaxForwardSteps uint = 10

	WinningScore uint = 1_000
)

type Player struct {
	playerId uint8
	position uint
	score    uint
}

type Input = []Player

func parseContent(content string) Input {
	players := Input{}

	for _, line := range strings.Split(content, "\n") {
		splttedLine := strings.Split(line, " ")
		players = append(players, Player{
			position: uint(core.ParseInt(splttedLine[len(splttedLine)-1])),
			score:    0,
			playerId: uint8(core.ParseInt(splttedLine[1])),
		})
	}

	return players
}

func rollDeterministicDice(startingPoint uint) (uint, []uint) {
	rolls := []uint{}

	for index := uint(0); index < RollsPerPlayer; index++ {
		rolls = append(rolls, startingPoint)
		startingPoint++

		if startingPoint > MaxDeterministicDiceAmount {
			startingPoint = MinDeterministicDiceAmount
		}
	}

	return startingPoint, rolls
}

func didSomePlayerWin(players []Player) bool {
	for _, player := range players {
		if player.score >= WinningScore {
			return true
		}
	}

	return false
}

func getPlayerPosition(current uint, amount uint) uint {
	for step := int(amount); step > 0; step-- {
		current++
		if current > MaxForwardSteps {
			current = MinStep
		}
	}

	return current
}

func getPlayerScore(player Player, newPosition uint) uint {
	return player.score + newPosition
}

type PlayResult struct {
	won  Player
	lost Player
}

func getPlayResult(players []Player) PlayResult {
	result := PlayResult{}

	for _, player := range players {
		if player.score >= WinningScore {
			result.won = player
		} else {
			result.lost = player
		}
	}

	return result
}

func displayRound(players []Player, roundIndex int) {
	fmt.Println("Round", (roundIndex), "players:", players)
}

func play(players []Player) uint {
	deterministicDice := MinDeterministicDiceAmount
	rolls := []uint{}
	timesDiceWasRolled, roundIndex := uint(0), 0
	didSomeoneWin := false

	for !didSomeoneWin {
		roundIndex++
		// displayRound(players, roundIndex)

		for playerIndex, player := range players {
			deterministicDice, rolls = rollDeterministicDice(deterministicDice)
			timesDiceWasRolled++

			position := getPlayerPosition(player.position, core.SumArrayUint(rolls))

			players[playerIndex].score = getPlayerScore(player, position)
			players[playerIndex].position = position

			if didSomePlayerWin(players) {
				didSomeoneWin = true
				break
			}
		}
	}

	result := getPlayResult(players)
	return result.lost.score * (timesDiceWasRolled * RollsPerPlayer)
}

func Main() int {
	content := core.ReadInput(core.AdventOfCodeProps{
		Star:  star,
		Day:   day,
		Input: input,
	})

	players := parseContent(content)
	result := play(players)

	switch star {
	case core.FirstStar:
		return int(result)
	case core.SecondStar:
		return 1
	}

	return -1
}
