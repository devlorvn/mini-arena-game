package engine

import (
	"context"
	"encoding/json"

	"github.com/redis/go-redis/v9"
)

func PublishRoomSnapshot(ctx context.Context, rdb *redis.Client, roomId string, players map[string]map[string]string) error {
	payload, _ := json.Marshal(players)

	return rdb.Publish(ctx, "room:"+roomId, payload).Err()
}
