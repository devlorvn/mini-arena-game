package model

type GameSnapshot struct {
	RoomId    string             `json:"roomId"`
	Tick      int64              `json:"tick"`
	Timestamp int64              `json:"timestamp"`
	Players   map[string]*Player `json:"players"`
}
