# NVSSVT Automation Portal - Architecture Documentation

## Project Overview

**Tool Name**: NVSSVT Portal  
**Stack**: Go (Backend), Vue.js (Frontend), Docker (Deployment)  
**Users**: QA Testers (Consumers), Automation Engineers (Admins)  
**Purpose**: Centralized orchestration for NVIDIA System Software Validation Toolkit

---

## System Architecture

### High-Level Design

```mermaid
graph TD
    User[QA Tester] -->|HTTPS| Nginx[Nginx Proxy]
    Admin[Admin User] -->|HTTPS| Nginx
    
    subgraph "Docker Compose Service"
        Nginx --> Frontend[Vue.js SPA]
        Nginx --> Backend[Go API Server]
        
    subgraph "Orchestration Logic"
        Backend -->|REST API| Jenkins[Jenkins Server]
        Jenkins -->|SSH| TestHost[NVSSVT Host Machine]
        TestHost -->|Run| NVSSVT_CLI[NVSSVT Client]
    end
    
    ExternalApp[Other Services] -->|REST API| Backend
```

### Component Breakdown

#### 1. Frontend (Vue.js)
- **Framework**: Vue 3 + Vite
- **UI Library**: PrimeVue / Element Plus (Assumed based on screenshot table style)
- **Key Views**:
  - **Dashboard**: Real-time status of all running tests.
  - **Submit Page**: Dynamic form generated from `config.json`. Allows selection of Test Plans (L0/L1/R1).
  - **Admin Panel**: Upload new tool binaries, update default JSON configurations.
  - **Report View**: Parse raw NVSSVT logs into human-readable tables.

#### 2. Backend (Go)
- **Framework**: Gin or Echo (High performance HTTP router)
- **Core Modules**:
  - **Job Queue**: Manages concurrent test executions to prevent resource contention.
  - **Config Manager**: Hot-reloads validation rules without server restart.
  - **Log Streamer**: Websocket-based real-time log tailing to frontend.
  - **CLI Wrapper**: Safely constructs complex NVSSVT command strings from API payloads.

#### 3. Containerization (Docker)
- **Why Docker?** Ensures the execution environment (Python dependencies, distinct NVSSVT versions) is identical dev-vs-prod.
- **Volume Mounts**: Persists logs and uploaded binaries outside the container.
- **Multi-Stage Build**: Keeps the final image size small (Go binary + compiled static assets).

---

## Key Features & Implementation

### 1. Unified Submission Interface
**Problem**: NVSSVT CLI has 50+ flags. Testers often forgot `--config` or used wrong paths.
**Solution**:
- UI provides dropdowns for valid options only.
- Validation logic in frontend prevents submitting conflicting parameters.
- Backend constructs the canonical command: 
  ```bash
  nvssvt-client -c /data/config/golden_config.json -t [TestPlan] --log /data/logs/[ID]
  ```

### 2. Admin Configuration Management
**Problem**: Distributed teams used different versions of the `validation_rules.json`, leading to "it works on my machine" issues.
**Solution**:
- **Single Source of Truth**: The Portal hosts the master config.
- **Hot Update**: Admins upload a new JSON config via UI. The backend immediately applies it to all new jobs. No manual file copying required on tester laptops.

### 3. Real-Time Monitoring
- **Implementation**:
  - Backend spawns CLI process with `os/exec`.
  - Captures `stdout/stderr` pipes.
  - Broadcasts output via **WebSocket** or Server-Sent Events (SSE) to the specific user's browser.
### 3. Remote Execution & Jenkins Integration
- **Flow**: Portal does NOT run tests locally. It acts as a control plane.
- **Trigger**: Backend sends a payload to Jenkins (via its REST API) containing Test Plan, SUT IP, and Config details.
- **Why?**: Leverage existing Jenkins scalable worker nodes (NVSSVT Hosts) located physically near the SUTs.

### 4. Open API Architecture
- **Design**: API-First approach. The Vue frontend is just one consumer.
- **Integration**: Other internal tools (e.g., Firmware Build Service) can auto-submit validation jobs post-build via:
  ```http
  POST /api/v1/submit
  { "sut_ip": "10.0.1.5", "test_plan": "L1_Basic" }
  ```

---

## Technical Challenges & Solutions

### Challenge 1: Long-Running Process Management
**Issue**: NVSSVT tests can take hours. HTTP requests timeout after seconds.
**Solution**:
- **Asynchronous Architecture**: The API returns `202 Accepted` and a `Job ID` immediately.
- **Goroutines**: The actual test runs in a managed Goroutine.
- **State Persistence**: Job status (Running/Passed/Failed) is tracked in a thread-safe map or lightweight DB (SQLite/BoltDB).

### Challenge 2: Tool Versioning
**Issue**: Different projects require different NVSSVT versions.
**Solution**:
- **Docker Volume Strategy**: Tools are stored in `/mnt/tools/[version]`.
- UI allows selecting "Tool Version". Backend sets `$PATH` or invokes the specific binary path dynamically.

---

## Deployment
```yaml
version: '3'
services:
  nvssvt-portal:
    image: nvssvt-portal:latest
    ports:
      - "8080:80"
    volumes:
      - ./logs:/app/logs
      - ./config:/app/config
      - ./tools:/app/tools
    restart: always
```

---

## Future Roadmap
- LDAP/SSO Integration for user tracking.
- Scheduler for nightly regression runs.
- Integration with JIRA to auto-file bugs on failure.
