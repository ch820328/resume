# Central Dashboard - Interview Guide

## STAR Questions

### Q1: "What problem does this dashboard solve?"
**Situation**:
Our engineers were losing hours daily switching between SSH terminals, file transfer tools (FileZilla), Redmine for issue tracking, and various CLI tools for hardware management (IPMI, SAA).
**Task**:
Consolidate these fragmented workflows into a single "Pilot Cockpit" to reduce context switching and lower the entry barrier for junior engineers.
**Action**:
I built a Go+Angular dashboard that integrates a Web SSH client, a GUI for raw IPMI/Redfish commands, and an issue tracker aggregator.
**Result**:
Consolidated 10+ tools into one view. Reduced debugging setup time by 40% (no need to open 5 different apps) and enabled non-experts to perform complex hardware resets via simple UI buttons.

### Q2: "How did you implement the Web SSH Terminal?"
**Action**:
I used `xterm.js` on the frontend for rendering and established a WebSocket connection to the Go backend.
- **Backend**: The Go server acts as a proxy using the `ssh` and `pty` libraries. It spawns a pseudo-terminal on the target machine and pipes the stdin/stdout streams to the WebSocket.
- **Protocol**: I handled window resize events (sending SIGWINCH to the PTY) to ensure text wrapping works correctly when the browser window is resized.
- **Security**: SSH credentials are passed securely and only held in memory for the session duration.

### Q3: "Explain the Issue Aggregation feature."
**Situation**:
We had issues scattered across Redmine (bugs) and an internal Project Board (features).
**Action**:
I wrote an aggregator module in Go that queries both APIs concurrently (using Goroutines). It normalizes the data into a unified structure and presents a sorted "My Tasks" list.
**Result**:
Engineers stopped missing tickets because they "forgot to check the other board." It provided a single source of truth for daily priorities.

### Q4: "How does the Validation Monitor work?"
**Action**:
The dashboard connects to our Validation Hosts via Docker API. It lists running test containers and streams their logs via Server-Sent Events (SSE). This allows developers to watch a test run in real-time without needing to SSH into the host and run `docker logs -f`.

---

## Key Tech
- **WebSockets**: For low-latency SSH terminal streaming.
- **Go Goroutines**: For parallel fetching of issues and status from multiple servers.
- **IPMI/Redfish**: Protocol level implementation for hardware control.
- **Docker API**: For container monitoring.
