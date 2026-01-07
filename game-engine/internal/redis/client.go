package redis

import (
	"context"
	"os"

	"github.com/redis/go-redis/v9"
)

func NewClient() (*redis.Client, error) {
	redisHost := os.Getenv("REDIS_HOST")
	if redisHost == "" {
		redisHost = "localhost"
	}

	redisHostPort := os.Getenv("REDIS_PORT")
	if redisHostPort == "" {
		redisHostPort = "6379"
	}

	client := redis.NewClient(&redis.Options{
		Addr:     redisHost + ":" + redisHostPort,
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       0, // use default DB
	})

	ctx := context.Background()
	if err := client.Ping(ctx).Err(); err != nil {
		return nil, err
	}
	return client, nil
}
