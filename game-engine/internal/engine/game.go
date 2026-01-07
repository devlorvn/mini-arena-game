package engine

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"

	"game-engine/internal/model"
	"game-engine/internal/util"
)

type GameEngine struct {
	redis    *redis.Client
	tickRate time.Duration
	rooms    map[string]*model.Room
}

func NewGameEngine(redisClient *redis.Client, tps int) *GameEngine {
	return &GameEngine{
		redis:    redisClient,
		tickRate: time.Second / time.Duration(tps),
		rooms:    make(map[string]*model.Room),
	}
}

func (g *GameEngine) Start(ctx context.Context) error {
	ticker := time.NewTicker(g.tickRate)
	defer ticker.Stop()
	tickCount := 0

	for {
		select {
		case <-ctx.Done():
			fmt.Println("game loop stopped")
			return nil
		case <-ticker.C:
			if err := g.tick(ctx); err != nil {
				fmt.Printf("Tick error: %v\n", err)
			}
			tickCount++
			if tickCount%60 == 0 {
				fmt.Printf("Tick count: %d\n", tickCount)
			}
		}
	}
}

func (g *GameEngine) tick(ctx context.Context) error {
	players, err := g.loadPlayers(ctx)
	if err != nil {
		return fmt.Errorf("Load players: %w", err)
	}

	// Update game state here

	// Save game snapshot
	if err := g.publishGameSnapshot(ctx, players); err != nil {
		return fmt.Errorf("Publish game snapshot: %w", err)
	}
	return nil
}

func (g *GameEngine) loadPlayers(ctx context.Context) (map[string]*model.Player, error) {
	players := make(map[string]*model.Player)

	keys, err := g.redis.Keys(ctx, "player:*").Result()
	if err != nil {
		return nil, err
	}

	for _, key := range keys {
		playerData, err := g.redis.HGetAll(ctx, key).Result()
		if err != nil {
			return nil, err
		}

		if len(playerData) == 0 {
			continue
		}

		player := &model.Player{
			ID: playerData["id"],
			X:  util.ParseFloat(playerData["x"]),
			Y:  util.ParseFloat(playerData["y"]),
			HP: util.ParseInt(playerData["hp"]),
		}
		players[player.ID] = player
	}
	return players, nil
}

func (g *GameEngine) publishGameSnapshot(ctx context.Context, players map[string]*model.Player) error {
	snapshot := &model.GameSnapshot{
		Timestamp: time.Now().UnixMilli(),
		Players:   players,
	}

	data, err := json.Marshal(snapshot)
	if err != nil {
		return err
	}

	return g.redis.Publish(ctx, "game:snapshots", data).Err()
}
