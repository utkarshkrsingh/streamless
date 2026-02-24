# Streamless: Sync Control, Not Content

Streamless is a synchronized video playback service that enables multiple users to watch videos together without streaming or uploading any media.

Each participant plays the video locally on their own machine. Playback synchronization is achieved by exchanging control and timing events over persistent WebSocket connections. A single host maintains authoritative control over playback state to ensure deterministic synchronization across all clients.

---

## Key Features

- Local video playback on each client
- Real-time playback synchronization via WebSockets
- Host-authoritative control model
- No video streaming or media uploads
- Low bandwidth usage (control messages only)
- Privacy-preserving architecture
- Designed for low-latency and LAN/WAN environments

---

## Architecture Overview

Streamless uses a client–server model with persistent WebSocket connections.

- The **host** acts as the authoritative source of playback state
- **Clients** follow host-issued control and timing events
- The **server** relays synchronization messages without accessing media data

### Synchronized Events

The system synchronizes the following events:

- Playback state changes (play, pause, stop)
- Playback timestamps
- Explicit resynchronization requests
- Client join and state catch-up

---

## Communication Protocol

All synchronization messages are transmitted over WebSocket connections.

Example event types:
- `PLAY`
- `PAUSE`
- `STOP`
- `SEEK`
- `RESYNC`
- `STATE_SYNC`

Messages contain minimal metadata such as timestamps and playback offsets to reduce network overhead.

---

## Tech Stack

- Backend: Go
- Frontend: React
- Transport: WebSocket
- Architecture: Event-driven, host-authoritative

---

## Use Cases

- Group video viewing without centralized streaming
- Remote collaboration using local media files
- Educational and training environments
- Bandwidth-constrained or privacy-sensitive scenarios

---
