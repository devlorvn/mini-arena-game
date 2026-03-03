# 🎮 Project Roadmap - Redis Multiplayer Game

**Ngày bắt đầu dự án:** March 3, 2026  
**Status:** 🟢 In Progress

---

## 📊 Tổng quan tiến độ

| Phase | Status | Start Date | End Date | Progress |
|-------|--------|------------|----------|----------|
| Phase 0 - Foundation | ✅ Completed | Mar 1, 2026 | Mar 3, 2026 | 100% |
| Phase 1 - Critical Fixes | 🔵 Planned | Mar 4, 2026 | Mar 8, 2026 | 0% |
| Phase 2 - Core Gameplay | 🔵 Planned | Mar 9, 2026 | Mar 15, 2026 | 0% |
| Phase 3 - Advanced Features | 🔵 Planned | Mar 16, 2026 | Mar 22, 2026 | 0% |

**Legend:**
- ✅ Completed
- 🟢 In Progress
- 🔵 Planned
- ⏸️ On Hold
- ❌ Cancelled

---

## Phase 0: Foundation ✅ (Completed)

**Duration:** Mar 1, 2026 → Mar 3, 2026  
**Status:** ✅ Completed

### Objectives
Xây dựng core architecture và basic movement system

### Tasks

| Task | Status | Start | End | Notes |
|------|--------|-------|-----|-------|
| Setup project structure | ✅ | Mar 1 | Mar 1 | Go + NestJS + React |
| Redis integration | ✅ | Mar 1 | Mar 1 | Redis client + Pub/Sub |
| WebSocket Gateway (NestJS) | ✅ | Mar 1 | Mar 2 | Socket.IO setup |
| Game Engine (Go) | ✅ | Mar 2 | Mar 2 | 60 TPS game loop |
| Basic movement system | ✅ | Mar 2 | Mar 3 | Input queue → State update |
| Game client UI | ✅ | Mar 2 | Mar 3 | Canvas rendering |
| Room system | ✅ | Mar 3 | Mar 3 | Join/leave rooms |
| Session management | ✅ | Mar 3 | Mar 3 | Socket ↔ Player mapping |

### Deliverables
- ✅ Players can join room and move around
- ✅ Real-time position sync across clients
- ✅ Basic UI with canvas rendering

---

## Phase 1: Critical Foundation Fixes 🔵 (Planned)

**Duration:** Mar 4, 2026 → Mar 8, 2026  
**Status:** 🔵 Planned

### Objectives
Fix critical issues để đảm bảo hệ thống stable và chống cheat

### Tasks

| Task | Priority | Start | End | Status | Assigned | Notes |
|------|----------|-------|-----|--------|----------|-------|
| **1.1 Map Boundaries & World Config** | 🔴 Critical | Mar 4 | Mar 5 | 🔵 Planned | - | |
| - Define map config struct (Go) | 🔴 | Mar 4 AM | Mar 4 AM | 🔵 | - | Size, spawn points |
| - Add boundary clamping in processMovement | 🔴 | Mar 4 AM | Mar 4 PM | 🔵 | - | Min/max X,Y validation |
| - Test boundary edge cases | 🔴 | Mar 4 PM | Mar 5 AM | 🔵 | - | Corner spawns, spam |
| - Update client canvas boundaries | 🟡 | Mar 5 AM | Mar 5 PM | 🔵 | - | Visual map borders |
| **1.2 Enhanced Input Validation** | 🟠 High | Mar 6 | Mar 6 | 🔵 Planned | - | |
| - Validate dx/dy limits in Gateway | 🟠 | Mar 6 AM | Mar 6 PM | 🔵 | - | Max speed check |
| - Add input sanitization | 🟡 | Mar 6 PM | Mar 6 PM | 🔵 | - | Type validation |
| **1.3 Input Rate Limiting (Gateway)** | 🟠 High | Mar 7 | Mar 8 | 🔵 Planned | - | |
| - Implement in-memory rate limiter | 🟠 | Mar 7 AM | Mar 7 PM | 🔵 | - | Map: playerId → lastInputTime |
| - Add rate limit logic in Gateway | 🟠 | Mar 7 PM | Mar 8 AM | 🔵 | - | Max 30 inputs/sec |
| - Client feedback on rate limit | 🟢 | Mar 8 AM | Mar 8 PM | 🔵 | - | Warning notification |
| **1.4 Tick Processing Optimization** | 🟢 Normal | Mar 8 | Mar 8 | 🔵 Planned | - | |
| - Benchmark current tick performance | 🟢 | Mar 8 AM | Mar 8 PM | 🔵 | - | Profile with 50+ players |
| - Optimize batch input processing | 🟢 | Mar 8 PM | Mar 8 PM | 🔵 | - | Adjust maxBatchSize |

### Deliverables
- ✅ Players cannot go outside map boundaries
- ✅ Movement speed limits enforced
- ✅ Input spam prevention (max 30 inputs/sec)
- ✅ Tick loop stable with 50+ concurrent players

### Success Criteria
- [ ] Players clamp at (0,0) to (1000,1000) boundaries
- [ ] No input accepted faster than 30/sec per player
- [ ] 60 TPS maintained with 50+ players moving
- [ ] No state corruption when spam testing

---

## Phase 2: Core Gameplay Features 🔵 (Planned)

**Duration:** Mar 9, 2026 → Mar 15, 2026  
**Status:** 🔵 Planned

### Objectives
Thêm combat system và game mechanics cơ bản

### Tasks

| Task | Priority | Start | End | Status | Notes |
|------|----------|-------|-----|--------|-------|
| **2.1 Combat System** | 🔴 Critical | Mar 9 | Mar 11 | 🔵 Planned | |
| - Design combat mechanics | 🟡 | Mar 9 AM | Mar 9 AM | 🔵 | Attack range, damage |
| - Implement attack action in Lua | 🔴 | Mar 9 AM | Mar 9 PM | 🔵 | Atomic attack logic |
| - Add attack cooldown system | 🟠 | Mar 9 PM | Mar 10 AM | 🔵 | 1 second cooldown |
| - Damage calculation + HP update | 🔴 | Mar 10 AM | Mar 10 PM | 🔵 | Apply damage atomically |
| - Add attack animation to client | 🟢 | Mar 11 AM | Mar 11 PM | 🔵 | Visual feedback |
| **2.2 Respawn Mechanism** | 🟠 High | Mar 12 | Mar 13 | 🔵 Planned | |
| - Implement death detection | 🟠 | Mar 12 AM | Mar 12 PM | 🔵 | HP <= 0 |
| - Random spawn point logic | 🟡 | Mar 12 PM | Mar 12 PM | 🔵 | Safe spawn locations |
| - Respawn timer system | 🟡 | Mar 12 PM | Mar 13 AM | 🔵 | 3 second delay |
| - Update client UI for death/respawn | 🟢 | Mar 13 AM | Mar 13 PM | 🔵 | Death screen |
| **2.3 HP System Enhancement** | 🟢 Normal | Mar 14 | Mar 15 | 🔵 Planned | |
| - HP regeneration over time | 🟢 | Mar 14 AM | Mar 14 PM | 🔵 | 1 HP/second |
| - Add damage feedback effect | 🟢 | Mar 14 PM | Mar 15 AM | 🔵 | Screen shake/flash |
| - HP bar improvements | 🟢 | Mar 15 AM | Mar 15 PM | 🔵 | Better visualization |

### Deliverables
- ✅ Players can attack each other
- ✅ Damage calculation working correctly
- ✅ Players respawn after death
- ✅ HP regeneration system active
- ✅ Visual feedback for combat actions

### Success Criteria
- [ ] Attack only hits players in range
- [ ] Damage calculation is deterministic
- [ ] Dead players respawn correctly
- [ ] HP regeneration works without race conditions

---

## Phase 3: Advanced Features 🔵 (Planned)

**Duration:** Mar 16, 2026 → Mar 22, 2026  
**Status:** 🔵 Planned

### Objectives
Polish game với advanced features và scalability improvements

### Tasks

| Task | Priority | Start | End | Status | Notes |
|------|----------|-------|-----|--------|-------|
| **3.1 Leaderboard System** | 🟠 High | Mar 16 | Mar 17 | 🔵 Planned | |
| - Design leaderboard schema | 🟡 | Mar 16 AM | Mar 16 AM | 🔵 | Redis ZSET |
| - Track kills/deaths/score | 🟠 | Mar 16 AM | Mar 16 PM | 🔵 | Update on events |
| - Implement ranking logic | 🟠 | Mar 16 PM | Mar 17 AM | 🔵 | Top 10 players |
| - Add leaderboard UI component | 🟢 | Mar 17 AM | Mar 17 PM | 🔵 | Side panel |
| **3.2 Multiple Rooms System** | 🟠 High | Mar 18 | Mar 19 | 🔵 Planned | |
| - Room creation/deletion API | 🟠 | Mar 18 AM | Mar 18 PM | 🔵 | Dynamic rooms |
| - Room list & browsing UI | 🟡 | Mar 18 PM | Mar 19 AM | 🔵 | Room selector |
| - Room capacity limits | 🟡 | Mar 19 AM | Mar 19 AM | 🔵 | Max players/room |
| - Testing multiple rooms | 🟢 | Mar 19 PM | Mar 19 PM | 🔵 | Isolation test |
| **3.3 Reconnection Handling** | 🟡 Medium | Mar 20 | Mar 21 | 🔵 Planned | |
| - Session persistence in Redis | 🟡 | Mar 20 AM | Mar 20 PM | 🔵 | TTL sessions |
| - Resume state after disconnect | 🟡 | Mar 20 PM | Mar 21 AM | 🔵 | Restore position |
| - Graceful disconnect handling | 🟡 | Mar 21 AM | Mar 21 PM | 🔵 | Cleanup logic |
| **3.4 Performance Testing** | 🟢 Normal | Mar 22 | Mar 22 | 🔵 Planned | |
| - Load test với 100+ players | 🟢 | Mar 22 AM | Mar 22 PM | 🔵 | Measure TPS impact |
| - Optimize bottlenecks | 🟢 | Mar 22 PM | Mar 22 PM | 🔵 | Profile & fix |

### Deliverables
- ✅ Leaderboard with top players
- ✅ Multiple rooms support
- ✅ Reconnection works seamlessly
- ✅ System tested with 100+ concurrent players

### Success Criteria
- [ ] Leaderboard updates in real-time
- [ ] Players can switch rooms freely
- [ ] Disconnected players can resume game
- [ ] System maintains 60 TPS with 100+ players

---

## 🎯 Future Enhancements (Backlog)

### Performance & Scalability
- [ ] Horizontal scaling với multiple Gateway instances
- [ ] Load balancing strategy
- [ ] Redis Cluster setup
- [ ] Connection pooling optimization

### Gameplay Features
- [ ] Power-ups system
- [ ] Different player classes
- [ ] Team mode
- [ ] Map obstacles/decorations
- [ ] Sound effects

### DevOps
- [ ] Docker production setup
- [ ] CI/CD pipeline
- [ ] Monitoring & metrics (Prometheus/Grafana)
- [ ] Logging aggregation
- [ ] Auto-scaling rules

### Testing
- [ ] Unit tests (Go + NestJS)
- [ ] Integration tests
- [ ] Load testing automation
- [ ] End-to-end tests

---

## 📝 Update Log

| Date | Phase | Update |
|------|-------|--------|
| Mar 3, 2026 | Phase 0 | ✅ Foundation completed - Movement system working |
| Mar 3, 2026 | Planning | 📋 Created project roadmap |

---

## 🔧 Quick Reference

### Current Focus
- **Phase:** Phase 1 - Critical Foundation Fixes
- **Next Milestone:** Atomic Movement với Lua Script
- **Blockers:** None

### Key Metrics
- Lines of Code: ~2000 (estimated)
- Test Coverage: 0% (to be added)
- Performance: 60 TPS stable
- Max Concurrent Players Tested: 5

### Team Notes
- Làm việc một mình
- Timezone: UTC+7
- Working hours: Flexible

---

**Last Updated:** March 3, 2026  
**Next Review:** March 8, 2026 (End of Phase 1)
