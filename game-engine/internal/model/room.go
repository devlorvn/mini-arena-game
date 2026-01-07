package model

type Room struct {
	Id      string
	Players map[string]*Player
}
