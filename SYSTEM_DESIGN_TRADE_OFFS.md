# Google L4 / L5 System Design & Trade-offs (深度系統設計與架構攻防戰)

這份文件專為 **Google L4 (Software Engineer III) 與 L5 (Senior Software Engineer)** 級別的面試所設計。
在 L4/L5 的面試中，面試官不再只關心「你用了什麼技術」，他們更關心：
1.  **Ambiguity (模糊性)**：當需求不明確或資源受限時，你如何定義問題？
2.  **Trade-offs (取捨)**：為什麼選 A 不選 B？A 的致命缺點是什麼？你做了什麼冗餘設計 (Redundancy) 或妥協？
3.  **Scale & Bottlenecks (規模與瓶頸)**：當流量或資料量放大 10 倍、100 倍時，你的系統最先垮掉的地方在哪？
4.  **Extensibility (可擴充性)**：你的架構如何適應未來 3-5 年的改變？

---

## 🚀 核心專案深水區 (Deep Dives)

### 1. NVSSVT Enterprise Automation Platform (企業級自動化平台)
**面試維度：分散式系統、非同步任務排程、併發控制 (Concurrency)、系統解耦**

*   **[L4 深度題] 排程與鎖 (Task Queuing & Distributed Locks)**
    *   **Q:** 「這套系統管理了全球的 Jenkins Agents 和硬體 SUT。如果突然有 200 個工程師發起測試，但目前只有 50 台測試機，你的系統如何防止 Race Condition？如何保證優先順序？」
    *   **A (Trade-off & Design):** 不能讓 API 同步等待 (Synchronous blocking)。我導入了 **Message Broker (如 Redis Queue/RabbitMQ)** 來做非同步排程。API 接收請求後立即回傳 HTTP 202 (Accepted) 和 Job ID。針對硬體競爭，我使用了 **Distributed Lock (如 Redis Redlock)**，以 SUT 的 MAC 或 IP 作為 Key。
    *   **Trade-off:** 犧牲了使用者的「即時結果反饋」，換取系統的高吞吐量 (High Throughput) 與容錯能力。後續透過 WebSockets 解決了前端等待進度的問題。
*   **[L5 架構題] 服務隔離與單點故障 (Single Point of Failure, SPOF)**
    *   **Q:** 「如果你的 Go Orchestration Portal 掛了，所有的 Jenkins 測試就會停擺嗎？你的架構有 SPOF 嗎？如何做到 High Availability (高可用性)？」
    *   **A:** 這是從架構演進的角度來看。初期可能是單體架構 (Monolith)。為了晉升 L5，你需要展示你考慮到了 **Stateless Design (無狀態設計)**。將 Go Portal 進行容器化部署 (Containerization)，搭配 Load Balancer。所有狀態（誰在測什麼機器、測試跑了多久）都卸載 (Offload) 到外部持久化資料庫 (PostgreSQL) 或 Redis 中，這樣 Portal 節點掛了隨時可以重啟/擴展，不會重置測試狀態，原本實體機上的測試也會繼續跑 (No Orphaned Jobs)。
    *   **進階 Trade-off (狀態同步機制: Webhook vs Polling):**
        *   **Webhook (Event-Driven / Push):** 讓 Jenkins 跑完主動打回 Go Portal。雖然即時性高，但如果 Go Portal 剛好在那一分鐘重啟，Webhook 送達失敗，這筆測試就會永遠卡在 `RUNNING` 狀態 (Zombie State)。
        *   **Polling (Pull) + DB State:** 因此我選擇了定時 Polling 的設計。Go 的 Background Worker 會定時去掃 DB 裡標記為 `RUNNING` 的單子去問 Jenkins。這雖然增加了微小的 API Overhead，但它是 **Idempotent (具備冪等性)** 且 **高容錯 (Fault Tolerant)** 的。這賦予了系統極強的 **Self-Healing (自我修復)** 能力，徹底消滅了 Zombie Jobs。
    *   **Extensibility:** 採用 OpenAPI compliance，強制前後端與上下游服務合約化 (Contract-first)，方便未來抽換 Jenkins 引擎改用 GitLab Runner 或其他容器化任務 (Containerized Jobs)，而不需要重寫商業邏輯。

### 2. Offline-First Distributed System (Baby Tracker)
**面試維度：CAP 定理、Eventual Consistency、衝突解決 (Conflict Resolution)、行動端/雲端同步機制**

*   **[L4 深度題] 解決離線衝突 (Handling Offline Conflicts / Split-Brain)**
    *   **Q:** 「在 Offline-First 的設計中，多個家長可能在完全無網際網路的情況下，修改了同一筆餵奶紀錄。連線後，你如何保證這些『歷史』能正確合併而不會有資料遺失 (Data Loss)？」
    *   **A (Trade-off & Design):** 這是典型的 **CAP Theorem** 取捨，我們選擇了 **A (Availability) 和 P (Partition tolerance)**，犧牲了即時的 C (Consistency)，做成 **Eventual Consistency (最終一致性)**。
    *   **解決方案與 Trade-offs (Locking 策略):** 
        *   **Pessimistic Locking (悲觀鎖 - Redis)**: 初期可運用 Redis 分散式鎖，確保同時間只有一個 Request 能修改同一筆 `activity_id`。能 100% 避免髒讀 (Dirty Write)，防護力最強，這是最直覺的解法。
        *   **Optimistic Locking (樂觀鎖 - SQL Versioning)**: 但基於產品特性，育兒紀錄修改同一筆資料的機率極低 (Low Contention)，依賴 Redis 會增加 Latency 與 Infrastructure 維護成本 (殺雞用牛刀)。所以在資料庫層直接用 `UPDATE activities SET volume=150, version=3 WHERE id=123 AND version=2`。若晚一步的 Request 被擋下 (回傳 0 rows affected)，即代表發生 Version Conflict。
    *   **UX 權衡 (User Conflict Resolution vs. Auto-Merge):**
        *   **Manual Resolution**: 最安全的工程做法是發現衝突時跳窗讓使用者決定：「另一半剛剛也改了這筆紀錄，你要覆蓋嗎？」(類似 Git Merge 概念)。保證資料正確，但 **UX 摩擦力極大 (High Friction)**。
        *   **L4/L5 進階思路 (Auto-Merge)**: 由於我們前端採用了 **Column-level 的增量更新**，如果媽媽改了「奶量 (Volume)」，爸爸改了「備註 (Notes)」，後端發現雖然 Version 衝突但「變更欄位不重疊」時，Backend 可直接 **自動合併 (Auto-Merge)** 兩者，推進 Version 並直接回傳 Success。只有當兩人剛好都改了「奶量」時，才跳窗提示。如此便能極小化使用者干擾，並同時確保資料一致性。
*   **[L5 架構題] 規模化與同步效率 (Scaling Sync Architectures)**
    *   **Q:** 「Baby Tracker 現在有 2,000 筆資料，同步很快。如果一個帳號累積了三年，有 500,000 筆資料，每次連線時的 Sync Payload 會變得非常巨大，導致記憶體溢出或超時。你怎麼重新架構 Sync Engine？」
    *   **A:** 關鍵在於 **Delta Sync (差異化同步)** 與 **Batch Processing (批次處理)**。
    *   **實作細節:** 
        1.  **Server-side Clock (解決時鐘偏移)**: 絕對不依賴手機端的時間戳記來判斷 LWW。客戶端請求時帶上 `last_sync_timestamp` (由伺服器在前一次同步結束時核發)。伺服器以其自身的系統時間作為唯一真理，避免因使用者手動調時間導致的資料錯亂。
        2.  **Sync Chunking (分段同步)**: 當累積變更過多時，我會將 Payload 切分為每 50 筆一組。每組處理完畢後，後端會針對每一筆 ID 回傳個體的 `success/failure` 狀態。這確保了即便在網路極度不穩的情況下，也能實現 **「斷點續傳」**，不會因為最後一筆資料出錯就導致前 49 筆全部重跑。
        3.  **Tombstone Pattern**: 刪除資料時不直接移除，而是標記 `deleted_at` 戳記。這確保了離線多日的設備在同步時，能正確接收到「哪些資料該被移除」的指令。

### 3. Deterministic BIOS OCR Engine
**面試維度：演算法取捨、地端運算 (Edge Computing)、效能優化、可維護性**

*   **[L4/L5 深度題] 模型選擇與技術負債 (Model Selection vs. Maintenance)**
    *   **Q:** 「現在 Deep Learning (CNN, YOLO, Transformer) 這麼發達，為什麼你堅持使用傳統的 OpenCV Template Matching？這樣做在擴展到全新 UI 的伺服器時，不會變成巨大的技術負債嗎？」
    *   **A (Trade-off & Design):** 工程的本質是找尋成本最低的解法。**Business Requirements dictated the technical choice.** BIOS 的 UI 是高度靜態且 Pixelated (非標準字體渲染)。使用 OpenCV Template Matching 具有 **純粹的決定性 (100% Deterministic)**、無須昂貴且耗時的 Data Labeling、並且運算成本極低 (CPU < 10ms)。
    *   **L5 的思維 (解決技術負債):** 為了防範未來 UI 改變，我將架構拆分為「萃取引擎」與「模板庫」。我們開發了一套 **自動化模板擷取腳本 (Auto-Template Generator)**，每當有新的 Server 架構，只要跑一次 Baseline Script，就能半自動生成新的 Reference Image Set (Golden Samples)。用自動化彌補了演算法的泛化能力不足。

### 4. Jetson Orin BSP & Infrastructure (Zstd Optimization)
**面試維度：系統底層 I/O、頻寬成本優化、資料壓縮原理**

*   **[L4 深度題] 壓縮演算法的全局考量 (Global Impact of Algorithms)**
    *   **Q:** 「從 Gzip 換到 Zstd 雖然讓影像縮小 30%，但 Zstd 需要佔用記憶體來建立 Dictionary。在端點 (Edge) 設備進行 OTA 時，解壓縮過程會不會耗盡 Jetson 的 RAM？你是怎麼做決策的？」
    *   **A (Trade-off & Design):** 這是一個典型的 **Write-once, Read-many (寫入一次，讀取百萬次)** 的全域效能取捨。
    *   我分析過，CI Server 每做一次打包，這個 3.6GB 的 Image 會在工廠被重複下載和解壓上百次。因此，我刻意選擇了稍微高一點的 Zstd 壓縮等級 (增加了編譯伺服器約 5 分鐘的打包時間)。這換來的是每一台 Edge 設備省下 30% 頻寬下載時間、以及 Zstd 極快的解壓縮速度，整體產線 (UPH) 吞吐量有感提升。
    *   **硬體安全限界:** 為了不耗盡 Jetson 的 RAM，我透過硬體監控 (dstat/htop) 確認 Zstd 解壓縮在極限狀態下最多只消耗不到 250MB RAM，這在設備的安全容忍範圍內。

*   **[L5 架構題] 跨部門技術導入與所有權 (Ownership & Transparent Migration)**
    *   **Q:** 「修改最底層的打包腳本通常會遇到硬體或工廠 QA 部門的反彈。身為這套工具的 Owner，你是怎麼順暢推動這項改變的？」
    *   **A:** 公司賦予了我 **整個打包與刷機 Pipeline 的 Ownership**，但我知道改變 SOP 一定會遭遇阻力。
    *   **Transparent Migration (透明化轉換):** 我的策略是極度注重「向下相容性」。我把所有的 Zstd 壓縮與解壓縮邏輯、以及 Kernel Config 的改動，完全封裝在現有 Shell Scripts 的底層。
    *   對第一線 QA 和工廠工程師來說，他們敲下去的 CLI 指令完全沒變 (`./flash.sh`)，不需學習新工具，甚至根本感覺不到底層演算法換了，唯一的感受是「刷機變快了」。這種 **Zero-friction (無痛 / 零摩擦)** 的導入体验，是這個優化案能迅速在全站落地的核心原因。

### 5. Cross-Interface Consistency Validation Framework
**面試維度：軟體工程設計模式、程式碼解耦、可測試性 (Testability)**

*   **[L4/L5 深度題] Strategy Pattern 與模組化 (Design Patterns & Modularity)**
    *   **Q:** 「面對 3+ 種不同世代的 BMC (AST2500/2600)，你是如何設計這套 Python 框架，讓未來加入第 4 種或第 5 種全新的 BMC 架構時，不需要大規模重寫原始碼的？」
    *   **A:** 這題是在考 **Open-Closed Principle (開放封閉原則)**。
    *   **Design:** 我應用了 **Strategy Pattern**。定義了一個抽象的介面 (Interface/Abstract Base Class) `DataFetcher`，裡面包含 `get_component_info()` 這樣的方法。
    *   針對不同的 BMC，我實作不同的 Concrete Classes (如 `RedfishFetcher`, `SMBIOSFetcher`, `SeleniumScraperFetcher`)。
    *   核心驗證邏輯接收的是抽象層，只負責比對資料陣列。未來新增 BMC，只需實作一個新的 `Fetcher` Class 並註冊進 Factory，核心引擎不需更改任何一行 Code。這大幅降低了 Regression 造成的風險。

### 6. Unified Engineering Productivity Portal (Central Dashboard)
**面試維度：系統整合、通訊協定取捨、過度工程防禦、產品思維**

*   **[L4 深度題] 即時通訊協定的取捨 (WebSockets vs. HTTP Polling)**
    *   **Q:** 「要在一個 Dashboard 上顯示 100 台測試機的即時狀態 (Telemetry)，你為什麼不用 WebSockets 做全局廣播，而是選擇 HTTP Polling？這不是退步的做法嗎？」
    *   **A (Trade-off & Design):** 這是在防禦 **「過度工程 (Over-engineering)」**。
    *   **Requirements Gathering:** 工程師的痛點是「工具太多要一直切換視窗」，而看 SUT 狀態的需求是「知道目前跑到哪裡即可」，並不需要毫秒級別的即時性。
    *   **Hybrid Architecture (混合式架構):** 如果我們為 100 台機器建立全局的 WebSocket Broadcast，會導致 Go 後端必須維護大量的長連線狀態 (Stateful connections) 和 Goroutines，導致記憶體消耗激增（如果前端又沒寫好，還會有 Connection Leaks 的風險）。
    *   **決策:** 因此，我採用了 **HTTP Polling** (每 5-10 秒拉一次) 來抓取核心監控資料，這不僅實作極簡、無狀態 (Stateless) 好擴展，且完全足夠滿足需求。只有對於需要真正即時互動的功能 (如 **WebSSH** 敲指令)，才保留使用 **WebSocket** 的專用通道。以最低的維運成本，達成了最大的工程生產力提升。

### 7. Test-Driven Infrastructure as Code (Ansible)
**面試維度：IaC 冪等性防禦、CI/CD 沙盒測試、基礎設施可靠性 (SRE)**

*   **[L4 深度題] 破壞性操作與 Idempotency (冪等性) 架構**
    *   **Q:** 「Ansible 很容易透過 `apt` 或 `file` 模組達到基礎的冪等性，但如果是『重啟 Database』這類具備破壞性或服務中斷的操作，你的腳本如何保證工程師不會因為誤觸而導致全網 DB 重啟？」
    *   **A (Trade-off & Design):** 這是從「單純寫 Script」昇華到「SRE 防禦體系」的關鍵。
    *   除了依賴 Ansible 原生模組，針對高風險的服務控制，我強制團隊採用 **Handlers 搭配 Notify 機制**。只有當 Config File 的 Hash/MD5 真的發生改變 (Changed 狀態) 時，Notify 才會被送出並觸發重啟。這確保了即便腳本被連續執行 100 次，只要設定沒變，系統就會維持在 Zero Side-effects (零副作用) 的狀態。
    *   **進階防禦:** 配合 Principle of Least Privilege (最小權限原則)，Ansible 執行帳號不輕易給予全域 `sudo`，而是透過 `sudoers` 精準鎖定允許重啟的特定 Systemd Services。

*   **[L4/L5 進階題] Test-Driven Infrastructure 的落地實踐**
    *   **Q:** 「你提到了 Test-Driven。在你把這套 Ansible Role 推播到 Production 幾百台機器之前，你的 Pipeline 是怎麼證明這段 Code 是安全的？」
    *   **A:** 我導入了 **Molecule 搭配 Docker driver** 建立自動化沙盒。
    *   **實作細節:** 當有 Code Commit 時，CI Runner 會瞬間拉起乾淨的 CentOS/Ubuntu 容器 (完美模擬 Target VMs OS)，並在裡面執行 Ansible Role。
    *   **驗證 (Verification):** 執行完畢後，不只看 Ansible 是否 Return 0，我還整合了 **Testinfra (基於 Pytest)** 去從外部驗證：這台容器的特定 Port 是否有在 Listen？特定套件版本是不是對的？只有沙盒測試 100% Pass，才允許發佈。這徹底根絕了「這腳本在我機器上可以跑」的嚴重環境偏移危機。

### 8. Cross-Platform Business Intelligence Engine (Issue Analytics)
**面試維度：異質資料整合 (ETL)、效能優化、資料庫 Schema 設計 (Normalization vs. Denormalization)**

*   **[L4 深度題] 異質資料來源的清洗與整合 (Heterogeneous Data Integration)**
    *   **Q:** 「你的資料來源包含 Redmine (RDBMS)、Excel (Unstructured) 和 Project Boards。你是如何把這些格式完全不同的資料融合成統一格式的 KPI？」
    *   **A (Trade-off & Design):** 這是典型的 **Adapter / Transformer Pattern**。
    *   針對每個資料源，我實作了專屬的 **`Transformer`** 類別。它負責將髒資料過濾，並對照 (Map) 到我們定義的 **`Standard_Ticket` Target Schema**。
    *   **好處:** 實現了核心統計引擎與外部資料來源的 **解耦 (Decoupling)**。未來若增加 Jira 轉接器，只需新增一個 Transformer，現有的報表邏輯 100% 免疫回歸錯誤 (Regression)。

*   **[L5 架構題] 從幾秒到幾十毫秒的性能飛躍 (ETL & Sub-second Analytics)**
    *   **Q:** 「計算『卡關 7 天 (Unhealthy Rate)』需要剖析複雜的日誌 (Journal)。如果直接在 User Request 時跑 SQL 或 PHP 剖析，資料量大時一定會 OOM 或超時。你具體是怎麼優化的？」
    *   **A (Trade-off & Design):** 這是從「Runtime Calculation」到 **「Pre-calculation」** 的範示轉移。
    *   **Bottleneck:** 掃描上萬張票的 `journal` 欄位並用應用程式 `foreach` 運算會導致嚴重的 Memory 與 Latency 問題。
    *   **解決方案 (Summary Tables):** 我導入了背景 **ETL Worker (Cronjobs)**。腳本每晚/每小時執行一次，將複雜的 Duration 邏輯計算完畢後，寫入專門的 **聚合實體表 (Summary Tables / Materialized Views)**。
    *   **成果:** 前端 API 請求時只需執行極簡的 `SELECT count(*) FROM summary_table`。這將原本可能需要 5-10 秒的複雜報表，壓縮到 **毫秒級 (Sub-second)** 回應，完美支撐了高階主管的即時決策需求。

---

## 🏗️ L5 必備的 System Design 面試通用武器庫

在白板題或是高階架構面試時，背熟並靈活運用以下觀念：

1.  **資料庫選擇 (DB Choice):**
    *   **關聯式 (RDBMS / PostgreSQL):** 用於強一致性需求 (ACID)、資金交易、具有極高度關聯的實體模型。
    *   **NoSQL (MongoDB / DynamoDB):** 用於寫入吞吐量極高、Schema 可能頻繁變動、Event Logging、或是 Key-Value 結構 (Session Data)。
    *   **Time-Series DB (Prometheus/InfluxDB):** 面對大量感測器監控 (你的硬體狀態與 BMC 遙測數據)。你會如何儲存過去一年的 Server 溫度數據？

2.  **API Gateway & Load Balancing:**
    *   如果在 NVSSVT 平台前方擋一個 API Gateway，它可以處理：Authentication (OAuth), Rate Limiting (防止惡意腳本 DDoS 把測試機全佔滿), 和 Request Routing。

3.  **Idempotency (冪等性):**
    *   面試官最愛問：「如果因為網路延遲，導致使用者連續按了兩次『重置硬體』或『觸發測試』的按鈕怎麼辦？」
    *   **解答:** 使用 Idempotency Keys。前端在發送 POST 請求時帶上一個 UUID。後端在 Redis 或 DB 檢查這個 Key，如果在過去 24 小時內處理過，就直接回傳上次的成功結果，而不是再觸發一次。

4.  **發布策略 (Deployment Strategies):**
    *   **Blue-Green Deployment:** 給需要零停機的內部 Portal 升級使用。
    *   **Canary Release:** 將新版的韌體 (OTA) 或測試框架先開放給 5% 的內部機器，確認沒報錯再 roll out 到 100%。

## 💬 行為面試 (Behavioral / Googleyness) 核心精神

L5 以上非常看重這三點：
*   **Navigating Ambiguity:** 「請告訴我一個你接到的需求非常模糊，你是如何釐清並把它轉化為可用系統的故事？」 -> *用 Unified Portal 來說明，大家抱怨 Context Switch，你主動歸納出了 10 個核心痛點並收斂為單一 UI。*
*   **Influencing Without Authority:** 「你沒有主管頭銜，如何說服資深工程師照你的架構走？」 -> *用 Jetson BSP Zstd 專案。用具體的效能評測數據與成本試算 (Data-driven approach) 說服他們。*
*   **Engineering Excellence:** 主動發現流程中的痛點（如 GitLab CI/CD 中缺乏 Conventional Commits 導致的亂象），並主動制定規範與工具去解決它。
