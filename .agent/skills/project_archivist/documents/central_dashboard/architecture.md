# Central Management Dashboard - Architecture Documentation

## Project Overview

**Tool Name**: Central Dashboard (Internal Dev Portal)
**Stack**: Go (Backend), Angular (Frontend), xterm.js (Web Terminal)
**Goal**: Reduce context switching by consolidating fragmentation CLI/Web tools into a single developer cockpit.

---

## 2. Key Modules & Implementation

### A. Web SSH Terminal
- **Technique**: Uses `xterm.js` on frontend + WebSocket on backend.
- **Components**:
  - **SSH Client (Go)**: `golang.org/x/crypto/ssh` packages dials the target server.
  - **WS Proxy**: Pipes `stdin/stdout` between the WebSocket connection and the SSH Session.
  - **Resize Handling**: Listens for window resize events to send `SIGWINCH` signals to the PTY.

### B. Hardware Utilities (IPMI/Redfish)
- **Problem**: Sending raw IPMI commands (`ipmitool raw 0x30 0x15...`) is error-prone.
- **Solution**:
  - **GUI Wrapper**: Replaces hex codes with Dropdowns/Buttons (e.g., "Get System Info", "Reset BMC").
  - **Redfish Client**: A Go-based HTTP client that authenticates and queries Redfish endpoints, parsing complex JSON responses into clean UI cards.
  - **SAA Support**: Wraps proprietary SAA (System Availability Agent) tools for rapid diagnosis.

### C. Issue Aggregator
- **Integration**: Connects to **Redmine** and **PostgreSQL** (Project Board).
- **Feature**:
  - Fetches issues assigned to the logged-in user.
  - Displays status, priority, and due dates in a unified table.
  - Allows "Quick Status Update" directly from the dashboard without navigating to slow Redmine pages.

### D. File Manager & Validation Monitor
- **File Manager**: SFTP-based browser. allow drag-and-drop upload/download to the server.
- **Log Monitor**: Tails Docker container logs via Docker API and streams them to the UI via Server-Sent Events (SSE).

---

## 3. System Design

```mermaid
graph TD
    Browser[User Browser]
    
    subgraph "Go Backend Service"
        Router[Gin Router]
        WSHandler[WebSocket Handler]
        IPMIWrapper[IPMI/Redfish Executor]
        IssueAgg[Issue Fetcher]
    end
    
    subgraph "External Targets"
        TargetServer[Target Linux Server]
        BMC[Server BMC (Redfish/IPMI)]
        Redmine[Redmine API]
        Postgres[Project DB]
    end
    
    Browser -->|HTTP/REST| Router
    Browser -->|WebSocket| WSHandler
    
    WSHandler -->|SSH Connection| TargetServer
    Router -->|SFTP| TargetServer
    IPMIWrapper -->|UDP/HTTPS| BMC
    IssueAgg -->|REST| Redmine
    IssueAgg -->|SQL| Postgres
```

---

## 4. Technical Challenges

### Challenge: Handling Interactive SSH via WebSocket
- **Issue**: Latency and specific terminal control sequences (colors, cursors) must be preserved.
- **Fix**: Implemented a binary stream protocol over WebSocket to minimize overhead. Used `pty` (pseudo-terminal) libraries in Go to ensure the shell behaves exactly like a native terminal.

### Challenge: Unified Auth
- **Issue**: Each tool (Redmine, target server, BMC) requires different credentials.
- **Fix**: Implemented a **Credential Vault** (encrypted at rest). Users unlock the vault once with a master password, and the dashboard auto-injects credentials into backend calls.

---

## 5. Deployment
- Single Go binary + Embedded Static Assets (Vue build).
- Can be run as a systemd service or Docker container.
