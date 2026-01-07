package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"game-engine/internal/engine"
	"game-engine/internal/redis"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	// Initialize Redis client
	redis, err := redis.NewClient()
	if err != nil {
		fmt.Println("Failed to connect to Redis:", err)
		os.Exit(1)
	}

	fmt.Println("Redis connected:", redis.Ping(ctx).Err() == nil)

	// Initialize game engine
	gameEngine := engine.NewGameEngine(redis, 60)
	fmt.Println("Game engine initialized")

	// Handle graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// Start game loop in a separate goroutine
	go func() {
		fmt.Println("Starting game loop")
		if err := gameEngine.Start(ctx); err != nil {
			fmt.Println("Game engine error:", err)
			cancel()
		}
	}()

	// Wait for termination signal
	<-sigChan
	fmt.Println("Shutting down gracefully...")
	cancel()
	time.Sleep(1 * time.Second) // Give some time for cleanup
	fmt.Println("✓ Shutdown complete")
}
