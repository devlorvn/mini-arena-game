package server

import (
	"fmt"
	"time"

	"game-engine/internal/engine"
	"game-engine/internal/redis"
)

func main() {
	redis.NewClient()
	fmt.Println("Game engine started")

	loop := engine.GameLoop{
		TickRate: 50 * time.Millisecond,
		Update: func() {
			// Game update logic here
			fmt.Println("Game tick")
		},
	}
	loop.Start()
}
