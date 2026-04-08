# Interview Guide: Unified Engineering Productivity Portal

## 🎤 Elevator Pitch (1-Minute)
*   **🇺🇸 English:** "I proactively identified a systemic cognitive-load problem in our hardware validation team—engineers were context-switching between 10+ separate SSH terminals, CLI tools, and project management platforms. I stepped up and architected a Unified Portal in Go and Angular, consolidating WebSSH, real-time SUT monitoring, hardware utility wrappers, and multi-source issue aggregation into a single interface. Without any formal mandate, I reduced setup time by 40% and enabled junior engineers to perform advanced validation tasks that previously required senior expertise."
*   **🇹🇼 中文:** 「我主動識別了一個系統性的認知負擔問題：工程師在驗證硬體時，需要頻繁切換超過 10 個工具之間——SSH 終端、IPMI 工具、Redfish CLI、以及多個任務追蹤系統。我主動提案並架構了以 Go 和 Angular 開發的統一門戶，將 WebSSH、即時硬體監控、工具封裝，以及多源問題聚合整併在單一介面中。在沒有任何正式授命的情況下，我讓測試設置時間縮短了 40%。」

## 🚀 Google L4/L5 Behavioral & Architecture Deep Dive

### [L4/L5 Behavioral] Proactive Tool-building & Tooling Democratization (主動建構 & 工具民主化)
*   **❓ Question:** "Tell me about a time you proactively improved your team's efficiency without being asked."
*   **🇺🇸 English Response:**
    *   **Context:** Senior engineers held critical hardware knowledge in their heads: exact `ipmitool` commands, Redfish paths, and debugging sequences. Junior engineers were blocked, always needing to ask for help.
    *   **Action:** I recognized that knowledge locked in people's heads is an organizational liability. I encapsulated all common hardware operations into reliable UI abstractions—one-click BMC power controls, pre-filled Redfish diagnostic forms, and an aggregated KPI dashboard.
    *   **Impact:** I democratized engineering capability. Junior engineers could now debug hardware issues independently, freeing seniors to focus on higher-leverage work.
*   **🇹🇼 中文回應:**
    *   **情境:** 資深工程師把關鍵的硬體操作知識和一長串的 CLI 指令參數鎖在自己腦海裡。新進工程師完全依賴前輩，一有問題就要問人。
    *   **行動:** 我意識到知識鎖在個人腦中是組織的負債。我把所有常用的硬體操作封裝成可靠的 UI 抽象層：一鍵 BMC 電源控制、預填的 Redfish 診斷表單、以及彙整所有資源的 KPI 儀表板。
    *   **影響:** 我實現了工程能力的民主化。新進工程師可以獨立除錯，資深工程師得以專注在更高槓桿的工作上。

### [L4 Architecture] Real-time WebSSH Concurrency (即時 WebSSH 高併發設計)
*   **❓ Question:** "How do you handle concurrent WebSSH sessions in Go if 20 engineers all connect to the same SUT simultaneously? How do you prevent file descriptor exhaustion?"
*   **🇺🇸 English Defense:**
    *   "Each WebSocket connection triggers a **Goroutine** and a corresponding SSH channel to the SUT. I implemented strict connection pooling with a hard upper limit per SUT."
    *   "For lifecycle management: the backend emits a **Heartbeat Ping** to the WebSocket client every 30s. If the client doesn't pong (e.g., laptop asleep), the Goroutine terminates and cleans up the SSH channel immediately."
    *   "This guarantees no zombie SSH sessions accumulate, preventing file descriptor leaks."
*   **🇹🇼 中文防禦:**
    *   「每個 WebSocket 連線觸發一個 **Goroutine** 並開啟一個對 SUT 的 SSH 通道。我實作了嚴格的連線池，並限制每台機台的上限連線數。」
    *   「對於生命週期管理：後端每 30 秒向 WebSocket 客戶端發送 **Heartbeat Ping**。如果客戶端沒有回應 Pong（例如筆電休眠），Goroutine 立即終止並清理 SSH 通道。」
    *   「這確保了不會有殭屍 SSH 連線積累，防止 File Descriptor 洩漏。」

### [L5 Architecture] Polyglot API Aggregation & Cascade Failures (異質 API 聚合與雪崩預防)
*   **❓ Question:** "If Redmine goes down, does your entire Portal hang? How do you prevent cascading failures from third-party API dependencies?"
*   **🇺🇸 English Defense:**
    *   "**Resilience Pattern:** The Portal never queries Redmine on demand. An asynchronous ETL background worker periodically fetches, cleans, and writes aggregated data into our own PostgreSQL (a Materialized View). The Portal always queries our fast local DB."
    *   "A **Circuit Breaker** wraps each external API call. After X timeouts, the circuit 'opens', immediately returning the last cached snapshot and showing a degraded UI banner ('Redmine data may be outdated')."
    *   "**Trade-off:** We sacrifice real-time freshness for availability and performance."
*   **🇹🇼 中文防禦:**
    *   「**韌性模式:** Portal 永遠不直接對 Redmine 即時發 Query。一個非同步 ETL Worker 定期抓取、清洗並將聚合資料存入我們自己的 PostgreSQL (Materialized View)。Portal 只對我們自己的本地 DB 發 Query，極速響應。」
    *   「每個外部 API 呼叫都被 **Circuit Breaker (斷路器)** 環繞。連續超時 X 次後，斷路器打開，立即回傳最後一份快取快照，並在 UI 顯示降級警告。」
    *   「**取捨:** 我們用資料的即時性交換了系統的可用性與效能。」
