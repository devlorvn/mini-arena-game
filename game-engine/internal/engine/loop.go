package engine

import "time"

type GameLoop struct {
	TickRate time.Duration
	Update   func()
}

func (g *GameLoop) Start() {
	ticker := time.NewTicker(g.TickRate)

	for range ticker.C {
		g.Update()
	}
}
