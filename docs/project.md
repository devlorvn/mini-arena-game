# 🎮 Realtime Multiplayer Mini Game – Redis-centric Architecture

## 📌 Project Overview

Tôi đang xây dựng một **realtime multiplayer mini game** nhằm **học sâu Redis**, WebSocket và kiến trúc backend realtime (game server–like).

Mục tiêu không phải là game hoàn chỉnh, mà là:
- Hiểu **authoritative state**
- Thiết kế **stateless gateway**
- Chuẩn bị nền tảng cho **scalable realtime system**

---

## 🧱 Tech Stack

- **Gateway**: NestJS (WebSocket Gateway)
- **Game State Store**: Redis
- **Backend Logic (planned)**:
  - Redis Lua Script (atomic state mutation) **[CHƯA TRIỂN KHAI]**
  - Go (Gin) game loop server **[PLANNED]**
- **Frontend**: ReactJS (WebSocket client)

---

## 🎯 High-level Architecture

## Key Design Principles
- Client gửi input
- Gateway không giữ game state
- Redis là **single source of truth** 

## 🧠 Design Principles

- Gateway **KHÔNG** xử lý game logic
- Client **KHÔNG** được tin cậy
- Redis giữ state chuẩn
- Mọi game logic phải có khả năng chạy **atomic / deterministic**
- Ưu tiên đơn giản, đúng bản chất hệ thống realtime

## 🧩 Current Implementation (ĐÃ LÀM)

### 1️⃣ WebSocket Gateway (NestJS)

- Nhận input realtime từ client
- Mapping kết nối socket → player
- Broadcast snapshot về client
- Gateway hoàn toàn **stateless**

### 2️⃣ Session Management (In-memory)

> Session tồn tại cùng lifecycle của Gateway process

- `PlayerSessionService`
  - `socketId → playerId`
- `RoomSessionService`
  - `playerId → roomId`

❗ Session **không lưu Redis**  
❗ Redis chỉ dùng cho **game state**

---

### 3️⃣ Redis Game State (Authoritative)

Redis hiện lưu state player:

```redis
player:{playerId}
  x
  y
  hp
- State chỉ được mutate bởi backend

- Client không được phép chỉnh sửa trực tiếp

---

### 4️⃣ PlayerService (NestJS)

- createPlayer(playerId)

- move(playerId, dx, dy) ""Hiện tại đang dùng Redis commands rời rạc (HINCRBY)""
#### ⚠️ Known Limitations (HIỆN TẠI)

❌ Movement chưa atomic
❌ Có thể xảy ra race condition nếu spam input
❌ Chưa có authoritative game loop
❌ Snapshot broadcast chưa tách room rõ ràng

---

### 5 Planned Improvements (CHƯA LÀM)
- Redis Lua Script (Atomic State Mutation)

    - Move + clamp + collision trong 1 Redis command

    - Tránh race condition

    - Redis là authoritative engine

- Snapshot Distribution

    - Redis Pub/Sub hoặc Redis Streams

    - Snapshot theo roomId

    - Gateway subscribe và broadcast WebSocket

- Game Loop Server (Go)

    - Tick-based loop (30–60 TPS)

    - Input buffer

    - Authoritative logic tách khỏi Gateway

    - Redis dùng cho snapshot / persistence

- Anti-cheat & Rate Limit

    - Redis-based rate limit per player

    - Reject spam input

    - Validate movement

- Scalability

    - Multi Gateway instances

    - Redis single source of truth

    - Horizontal scaling without shared memory