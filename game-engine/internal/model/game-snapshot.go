package model

type GameSnapshot struct {
	Timestamp int64              `json:"timestamp"`
	Players   map[string]*Player `json:"players"`
}
