package engine

import (
	"context"

	"github.com/redis/go-redis/v9"
)

func MovePlayer(ctx context.Context, rdb *redis.Client, playerId string, dx, dy int) error {
	pipe := rdb.TxPipeline()
	pipe.HIncrBy(ctx, "player:"+playerId, "x", int64(dx))
	pipe.HIncrBy(ctx, "player:"+playerId, "y", int64(dy))
	_, err := pipe.Exec(ctx)
	return err
}
