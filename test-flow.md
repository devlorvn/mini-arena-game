# 🧪 Test Flow - Phase 2

## 1. Start Redis
```bash
docker run -d -p 6379:6379 redis:7-alpine
# Or
redis-server
```

## 2. Start Game Engine
```bash
cd game-engine
go run cmd/server/main.go
```

**Expected output:**
```
Redis connected: true
Game engine initialized
Starting game loop
Tick count: 60
Tick count: 120
...
```

## 3. Start Gateway
```bash
cd game-gateway
npm run start:dev
```

**Expected output:**
```
✓ Redis connected
Redis subscribed: room:*:snapshot
[Nest] WebSocketsController subscribed to "join_room"
[Nest] WebSocketsController subscribed to "input"
```

## 4. Test với Redis CLI

### Create a player and join room
```bash
# Terminal 1 - Subscribe to snapshots
redis-cli SUBSCRIBE room:lobby:snapshot

# Terminal 2 - Create player manually
redis-cli HSET player:test1 x 100 y 100 hp 100

# Add player to room
redis-cli SADD room:lobby:players test1

# Push movement input
redis-cli LPUSH game:input:lobby '{"playerId":"test1","action":"move","timestamp":1234567890,"data":{"dx":5,"dy":3}}'

# Check queue length
redis-cli LLEN game:input:lobby

# Check player position after a few ticks
redis-cli HGETALL player:test1
# Should see x=105, y=103
```

## 5. Test với WebSocket Client

Create `test-client.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Game Test Client</title>
    <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
</head>
<body>
    <h1>Game Test Client</h1>
    <div id="status">Disconnected</div>
    <div id="playerId"></div>
    <button onclick="joinRoom()">Join Lobby</button>
    <button onclick="move(5, 0)">Move Right</button>
    <button onclick="move(-5, 0)">Move Left</button>
    <button onclick="move(0, 5)">Move Down</button>
    <button onclick="move(0, -5)">Move Up</button>
    <pre id="snapshot"></pre>

    <script>
        const socket = io('http://localhost:3456');
        let playerId = null;

        socket.on('connect', () => {
            document.getElementById('status').innerText = 'Connected';
        });

        socket.on('connected', (data) => {
            playerId = data.playerId;
            document.getElementById('playerId').innerText = `Player ID: ${playerId}`;
        });

        socket.on('player_created', (data) => {
            console.log('Player created:', data);
        });

        socket.on('game:snapshot', (snapshot) => {
            document.getElementById('snapshot').innerText = JSON.stringify(snapshot, null, 2);
        });

        function joinRoom() {
            socket.emit('join_room', { roomId: 'lobby' });
        }

        function move(dx, dy) {
            socket.emit('input', { dx, dy });
        }
    </script>
</body>
</html>
```

Open in browser and test!

## Expected Flow:

```
Client → emit('join_room')
    ↓
Gateway → Create player in Redis
    ↓
Gateway → Add to room:lobby:players
    ↓
Gateway → Bind sessions
    ↓
Client ← emit('player_created')
    ↓
Client → emit('input', {dx: 5, dy: 0})
    ↓
Gateway → LPUSH game:input:lobby
    ↓
Game Engine → BRPOP game:input:lobby
    ↓
Game Engine → Process movement
    ↓
Game Engine → Update player position in Redis
    ↓
Game Engine → Publish to room:lobby:snapshot
    ↓
Gateway RedisSubscriber → Receive snapshot
    ↓
Gateway → Broadcast to Socket.IO room
    ↓
Client ← receive('game:snapshot')
```

## Debug Commands

```bash
# Monitor all Redis commands
redis-cli MONITOR

# Check all keys
redis-cli KEYS *

# Check queue length
redis-cli LLEN game:input:lobby

# Check room members
redis-cli SMEMBERS room:lobby:players

# Check player data
redis-cli HGETALL player:xxx

# Subscribe to snapshots
redis-cli SUBSCRIBE room:lobby:snapshot
```

## Success Criteria ✅

- [ ] Game Engine logs "Tick count" every second
- [ ] Gateway logs "Redis subscribed: room:*:snapshot"
- [ ] Client can join room and receive player_created event
- [ ] Client can send move commands
- [ ] Game Engine processes inputs (check Redis MONITOR)
- [ ] Client receives game:snapshot updates
- [ ] Player position updates correctly in Redis
