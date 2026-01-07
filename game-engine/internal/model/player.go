package model

type Player struct {
	ID string  `json:"id"`
	X  float64 `json:"x"`
	Y  float64 `json:"y"`
	HP int     `json:"hp"`
}

type PlayerInput struct {
	PlayerId  string    `json:"playerId"`
	Action    string    `json:"action"`
	TimeStamp int64     `json:"timestamp"`
	Data      InputData `json:"data"`
}

type InputData struct {
	DX float64 `json:"dx,omitempty"`
	DY float64 `json:"dy,omitempty"`
}
