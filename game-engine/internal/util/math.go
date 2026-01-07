package util

import (
	"fmt"
)

// Helper functions
func ParseFloat(s string) float64 {
	var f float64
	fmt.Sscanf(s, "%f", &f)
	return f
}

func ParseInt(s string) int {
	var i int
	fmt.Sscanf(s, "%d", &i)
	return i
}

// Helper: clamp value between min and max
func Clamp(value, min, max float64) float64 {
	if value < min {
		return min
	}
	if value > max {
		return max
	}
	return value
}
