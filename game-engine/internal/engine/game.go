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

const (
	inputQueueKey = "game:input:queue"
	maxBatchSize  = 100
)

type GameEngine struct {
	redis       *redis.Client
	tickRate    time.Duration
	rooms       map[string]*model.Room
	activeRooms []string // Track active rooms
	tickCount   int64    // Track tick count
}

func NewGameEngine(redisClient *redis.Client, tps int) *GameEngine {
	return &GameEngine{
		redis:       redisClient,
		tickRate:    time.Second / time.Duration(tps),
		rooms:       make(map[string]*model.Room),
		activeRooms: []string{"lobby"}, // Start with lobby room
	}
}

func (g *GameEngine) Start(ctx context.Context) error {
	ticker := time.NewTicker(g.tickRate)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			fmt.Println("game loop stopped")
			return nil
		case <-ticker.C:
			if err := g.tick(ctx); err != nil {
				fmt.Printf("Tick error: %v\n", err)
			}
			g.tickCount++
			if g.tickCount%60 == 0 {
				fmt.Printf("Tick count: %d\n", g.tickCount)
			}
		}
	}
}

func (g *GameEngine) tick(ctx context.Context) error {
	// 1. Process inputs for all active rooms
	for _, roomId := range g.activeRooms {
		if err := g.ProcessPlayerInputsForRoom(ctx, roomId); err != nil {
			fmt.Printf("Input processing error for room %s: %v\n", roomId, err)
		}
	}

	// 2. Load players and publish snapshots for each room
	for _, roomId := range g.activeRooms {
		players, err := g.loadPlayersInRoom(ctx, roomId)
		if err != nil {
			fmt.Printf("Load players error for room %s: %v\n", roomId, err)
			continue
		}

		if err := g.publishGameSnapshot(ctx, roomId, players); err != nil {
			fmt.Printf("Publish snapshot error for room %s: %v\n", roomId, err)
		}
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

func (g *GameEngine) loadPlayersInRoom(ctx context.Context, roomId string) (map[string]*model.Player, error) {
	// Get player IDs in room
	playerIds, err := g.redis.SMembers(ctx, fmt.Sprintf("room:%s:players", roomId)).Result()
	if err != nil {
		return nil, err
	}

	players := make(map[string]*model.Player)

	// Load each player's data
	for _, playerId := range playerIds {
		playerData, err := g.redis.HGetAll(ctx, fmt.Sprintf("player:%s", playerId)).Result()
		if err != nil || len(playerData) == 0 {
			continue
		}

		player := &model.Player{
			ID: playerId,
			X:  util.ParseFloat(playerData["x"]),
			Y:  util.ParseFloat(playerData["y"]),
			HP: util.ParseInt(playerData["hp"]),
		}
		players[playerId] = player
	}

	return players, nil
}

func (g *GameEngine) publishGameSnapshot(ctx context.Context, roomId string, players map[string]*model.Player) error {
	snapshot := &model.GameSnapshot{
		RoomId:    roomId,
		Tick:      g.tickCount,
		Timestamp: time.Now().UnixMilli(),
		Players:   players,
	}

	data, err := json.Marshal(snapshot)
	if err != nil {
		return err
	}

	// Publish to room-specific channel
	channel := fmt.Sprintf("room:%s:snapshot", roomId)
	return g.redis.Publish(ctx, channel, data).Err()
}

func (g *GameEngine) ProcessPlayerInputsForRoom(ctx context.Context, roomId string) error {
	queueKey := fmt.Sprintf("game:input:%s", roomId)

	// Use RPOP (non-blocking) instead of BRPOP for game loop
	// Process up to 10 inputs per tick to avoid input lag
	for i := 0; i < 10; i++ {
		result, err := g.redis.RPop(ctx, queueKey).Result()
		if err != nil {
			// Queue is empty, return
			return nil
		}

		if err := g.processInput(ctx, result); err != nil {
			fmt.Printf("Error processing input: %v\n", err)
		}
	}

	return nil
}

func (g *GameEngine) processInput(ctx context.Context, inputData string) error {
	var input model.PlayerInput

	if err := json.Unmarshal([]byte(inputData), &input); err != nil {
		return fmt.Errorf("invalid input format: %w", err)
	}

	switch input.Action {
	case "move":
		return g.processMovement(ctx, &input)
	case "attack":
		return nil
	default:
		return fmt.Errorf("unknown action: %s", input.Action)
	}
}

func (g *GameEngine) processMovement(ctx context.Context, input *model.PlayerInput) error {
	playerKey := fmt.Sprintf("player:%s", input.PlayerId)

	currentPos, err := g.redis.HMGet(ctx, playerKey, "x", "y").Result()
	if err != nil {
		return fmt.Errorf("fetch player position: %w", err)
	}

	if currentPos[0] == nil || currentPos[1] == nil {
		return fmt.Errorf("player not found: %s", input.PlayerId)
	}

	currentX := util.ParseFloat(fmt.Sprintf("%v", currentPos[0]))
	currentY := util.ParseFloat(fmt.Sprintf("%v", currentPos[1]))

	dx := util.Clamp(input.Data.DX, -5, 5)
	dy := util.Clamp(input.Data.DY, -5, 5)

	newX := currentX + dx
	newY := currentY + dy

	if err := g.redis.HMSet(ctx, playerKey, map[string]interface{}{
		"x": newX,
		"y": newY,
	}).Err(); err != nil {
		return fmt.Errorf("failed to update player position: %w", err)
	}
	return nil
}
