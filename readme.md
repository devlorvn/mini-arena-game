# Realtime Multiplayer Mini Arena

A real-time multiplayer mini game built to explore **Redis as an authoritative state store** and **WebSocket-based communication at scale**, using **NestJS**, **Go (Gin)**, and **ReactJS**.

This project focuses on **system design, real-time consistency, scalability, and performance**, rather than complex game mechanics or graphics.

---

## 🎯 Project Goals

- Understand real-time system design using WebSockets
- Use Redis as a **single source of truth**, not just a cache
- Design an **authoritative server** to ensure consistency and prevent cheating
- Explore horizontal scalability with Redis Pub/Sub
- Practice polyglot backend architecture (Node.js + Go)

---

## 🧩 Overview

The system is intentionally split into multiple components, each with a clear responsibility:

- **ReactJS (Client)**  
  Renders the game state and sends user input in real time.

- **NestJS (Realtime Gateway)**  
  Acts as the WebSocket gateway, managing connections, rooms, validation, and event broadcasting.

- **Go + Gin (Game Engine)**  
  Handles performance-critical logic such as the game loop, movement processing, collision detection, and combat resolution.

- **Redis**  
  Serves as the authoritative in-memory data store and pub/sub backbone for real-time synchronization.

The architecture prioritizes **low latency**, **clear separation of concerns**, and **horizontal scalability**.

---

## 🏗️ System Architecture


### Key Design Principles

- Clients only send **input commands**, never raw state
- The server is the **single authority** over game state
- Redis is shared across services to ensure consistency
- Real-time events are propagated via Redis Pub/Sub

---

## 🔄 Data & State Management

Redis is used as the **authoritative state store**, not as a cache.

### Data Modeling

| Key Pattern | Redis Type | Purpose |
|------------|------------|--------|
| `player:{id}` | HASH | Player state (position, HP, etc.) |
| `room:{id}:players` | SET | Players in a room |
| `leaderboard` | ZSET | Player rankings |
| `attack:{playerId}` | STRING | Rate limiting |
| `room:{id}` | PUB/SUB | Realtime broadcasts |

### Why Redis?

- In-memory speed
- Atomic operations
- Built-in TTL for cleanup
- Native Pub/Sub for real-time fan-out

---

## 🔁 Realtime Flow (High Level)

1. Client connects via WebSocket
2. Player joins a room
3. Client sends input (e.g. move left, attack)
4. Server validates input
5. Game engine updates state in Redis
6. State updates are broadcast to all players in the room

---

## 🛠️ Tech Stack

### Frontend
- ReactJS
- Socket.IO Client

### Backend
- NestJS (WebSocket Gateway)
- Go (Gin Framework – Game Engine)

### Infrastructure
- Redis
- Docker / Docker Compose (Swarm-ready)

---

## ⭐ Technical Highlights

- Redis used as an **authoritative state store**
- Authoritative server model to prevent cheating
- Event-driven real-time architecture
- Horizontal scaling via Redis Pub/Sub
- Clear separation between control plane (NestJS) and data plane (Go)

---

## 🚀 Future Improvements

- Multi-room matchmaking
- Snapshot compression for large rooms
- Client-side prediction & reconciliation
- Redis Lua scripts for complex atomic updates
- Observability (metrics, tracing)

---

## 📌 Disclaimer

This project is designed as a **learning-focused system design exercise**.  
Visuals and gameplay are intentionally kept simple to prioritize backend engineering concepts.

---

## 📄 License