# Google 面試深度準備指南：Software Engineer, Web Platforms for Smart Manufacturing

這份指南已經全面擴充，為你提供「**可以直接當作教科書與面試擬答準備**」的深度細節。請將這些技術細節與你的專案（Unified Portal, Baby Tracker, OpenClaw）緊密結合。

---

## 1. 前端開發深水區 (Angular & Web Platforms)

在智慧製造平台中，前端通常是一個包含「超大型資料表 (Data Tables)」、「即時機台監控儀表板 (Real-time Dashboards)」的複雜系統。

### 1.1 效能優化：應付萬筆機台數據的渲染
*   **Change Detection (變更檢測) 與 `OnPush`**：
    *   **概念**：Angular 預設會在任何非同步事件（點擊、HTTP 回應、Timer）發生時，檢查整個 Component Tree。如果儀表板上有上千台機器，這會造成嚴重的卡頓。
    *   **深度解法**：設定 `changeDetection: ChangeDetectionStrategy.OnPush`。這樣只有在 `@Input` 的 `Reference` (記憶體位址) 改變，或是在該 Component 內觸發事件時，才會進行重繪。這要求你必須使用 **Immutable Data Structures**（例如用 `map` 或 `filter` 產生新陣列，而不是直接 `push`）。
*   **`TrackBy` Function**：
    *   **概念**：在使用 `*ngFor` 渲染龐大列表時，如果資料更新，預設會把整個 DOM 砍掉重練。
    *   **深度解法**：實作 `trackBy` 方法（例如用機台的 `id` 作為 key）。這樣 Angular 在比較新舊陣列時，就知道只要更新變動的那個 DOM 節點，大幅降低 CPU 計算與記憶體消耗。
```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-smart-factory-dashboard',
  templateUrl: './smart-factory-dashboard.component.html',
  // 🔥 【防線一】合理做法的第一步：直接宣告啟動 OnPush，拒絕盲目全樹檢查
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class SmartFactoryDashboardComponent {
  // 假設這是我們的大型機台 Table 陣列
  machines = [
    { id: 1, name: 'ATE_Station_A', temp: 40, status: 'Running' },
    { id: 2, name: 'ATE_Station_B', temp: 39, status: 'Running' },
    { id: 3, name: 'ATE_Station_C', temp: 40, status: 'Running' }
  ];

  // 🔥 【防線二】當後端 WebSocket 傳來「3號機台溫度變為 45 度」的即時訊號時：
  updateMachineDataFromServer(incomingId: number, newTemp: number) {
    
    // 用 map 產生全新陣列外殼（更換外殼記憶體位址），一秒鐘驚醒 OnPush 秘書
    this.machines = this.machines.map(m => {
      if (m.id === incomingId) {
        // 找到 3 號 Key！倒出舊內容，精準覆蓋 temp，產生部分更新的 Row 新物件
        return { ...m, temp: newTemp }; 
      }
      // 1 號和 2 號不及格，原封不動搬過去，記憶體位址 100% 沿用
      return m; 
    });
  }

  // 🔥 【防線三】合理做法的靈魂：實作 TrackBy 認人機制
  // 告訴 Angular：外殼變了沒關係，請用機台的 id 作為唯一標籤去對帳！
  trackByMachineId(index: number, machine: any): number {
    return machine.id; 
  }
}

<tr *ngFor="let machine of machines; trackBy: trackByMachineId">
  <td>{{ machine.id }}</td>
  <td>{{ machine.name }}</td>
  <td [class.alert]="machine.temp > 42">{{ machine.temp }}°C</td>
  <td>{{ machine.status }}</td>
</tr>
```

*   **Virtual Scrolling (虛擬滾動)**：
    *   遇到幾十萬筆 Log，即便用 `OnPush` 瀏覽器也會崩潰。必須引入 Angular CDK 的 `ScrollingModule`，畫面上只渲染使用者目前看到的 20~30 筆 DOM 節點，滾動時動態替換內容。
```typescript
<div class="log-container">
  <h2>全球產線歷史測試日誌 (ATE High-Throughput Logs)</h2>

  <cdk-virtual-scroll-viewport itemSize="50" class="log-viewport">
    
    <div *cdkVirtualFor="let log of logDataset; trackBy: trackByLogId" class="log-row">
      <span class="log-id">[{ { log.id } }]</span>
      <span class="log-time">{ { log.timestamp } }</span>
      <span class="log-level" [ngClass]="log.level">{ { log.level } }</span>
      <span class="log-msg">{ { log.message } }</span>
    </div>

  </cdk-virtual-scroll-viewport>
</div>
```

### 1.2 RxJS：複雜資料流與非同步處理
面試一定會考 RxJS 的 High-order Mapping Operators，你必須能精準說出使用情境：
*   **`switchMap` (取消前一個)**：
    *   *情境*：使用者在「機台代碼搜尋框」連續輸入。每打一個字就發一個 API 請求，如果前一個請求還沒回來，`switchMap` 會自動 `abort` 掉前一個請求，確保畫面只顯示最後一次輸入的結果，避免 Race Condition。
*   **`mergeMap` (併發執行，不保證順序)**：
    *   *情境*：你需要同時發送請求去拿 10 台機器的獨立 Log，不需要管誰先回來，只要全部拿到就好。
*   **`concatMap` (排隊執行，嚴格保證順序)**：
    *   *情境*：傳送連續的硬體控制指令（如：先斷電 -> 再重啟）。必須等前一個 HTTP Request 成功，才能發下一個。
*   **`exhaustMap` (忽略新的，直到當前完成)**：
    *   *情境*：防止連點（Double-click）。操作員按下「緊急停機」按鈕，在 API 回應前，無論再按幾次都忽略，防止送出重複指令。

### 1.3 即時數據處理 (WebSockets vs SSE)
*   **Server-Sent Events (SSE)**：單向通訊（Server -> Client），基於 HTTP。非常適合用來做「機台狀態廣播（如溫度、CPU使用率）」，因為輕量且原生支援自動重連。
*   **WebSockets**：雙向通訊。如果需要實現「WebSSH 遠端連線終端機」來 Debug 機台（如你的 Unified Portal 專案），就必須使用 WebSocket，因為你需要頻繁雙向傳遞按鍵與終端機畫面。

---

## 2. 後端架構與分散式系統設計 (System Design)

在 Google 面試中，這部分是區分 Engineer 與 Senior Engineer 的關鍵。工廠的特點是：**數據量極大 (High Throughput)、網路可能不穩、容錯要求高**。

### 2.1 系統架構演進：從感測器到 Dashboard
你需要能畫出/口述以下的資料流架構：
1.  **Edge / IoT Gateway**：機台感測器資料先透過 MQTT 傳給廠區的 Edge Server。
2.  **Message Queue (Kafka / PubSub)**：Edge Server 不直接呼叫 Backend API，而是把資料打進 Kafka。這樣即使後端掛掉或在升級，資料也不會遺失（Decoupling & Buffering）。
3.  **Stream Processing (Go / Python)**：後端從 Queue 消耗資料，進行資料清洗（例如過濾掉不合理的負數溫度）。
4.  **Database**：
    *   *Time-Series DB (Prometheus / InfluxDB)*：存溫濕度、電壓等時間序列數據。
    *   *Relational DB (PostgreSQL)*：存機台元數據 (Metadata)、操作員權限。
5.  **Web Backend (gRPC / GraphQL / REST)**：提供 API 讓 Angular 前端拉取資料。

### 2.2 gRPC vs REST
JD 點名了 "RPC backend services"。
*   **為什麼在微服務/內部網路愛用 gRPC？**
    *   **Protocol Buffers (Protobuf)**：以二進制編碼，Payload 比 JSON 小非常多，序列化/反序列化速度極快。這對每秒上萬筆感測器資料的傳輸至關重要。
    *   **HTTP/2**：支援 Multiplexing (單一 TCP 連線同時處理多個請求)，解決了 HTTP/1.1 的 Head-of-line blocking。且支援 Server Streaming，非常適合推送信號。
*   **面試說法**：「在我的架構中，內部微服務溝通與硬體資料收集我會設計為 gRPC，以降低延遲與頻寬；而對外開放給 Web 前端的介面，如果前端團隊較熟悉 REST 或有 GraphQL 需求，我會建立一個 API Gateway 做轉換。」

### 2.3 併發控制與分散式鎖 (Concurrency & Distributed Locks)
這是你履歷的亮點（Baby Tracker），面試極大機率深挖：
*   **問題場景**：A 與 B 兩個工程師同時在 Dashboard 上對同一台機器按下「套用更新配置」。如果沒有鎖，最後機台的狀態可能壞死。
*   **解法 1：Optimistic Locking (樂觀鎖 - Database Level)**：
    *   給資料表加一個 `version` 欄位。A 先讀到 `version=1`，B 也讀到 `version=1`。A 更新時 `UPDATE ... SET version=2 WHERE id=x AND version=1`，成功。B 更新時找不到 `version=1` 的資料，拋出 `OptimisticLockError`，提示畫面資料已舊，請重整。適合「讀多寫少」的場景。
*   **解法 2：Distributed Lock (Redis Redlock)**：
    *   執行長時間的硬體操作（例如刷 BIOS 需要 3 分鐘），不可能用樂觀鎖。A 開始刷機時，向 Redis 寫入 `SET lock:machine_1 "A_UUID" NX EX 300` (NX=不存在才寫入，EX=5分鐘自動過期防死鎖)。B 點擊時，發現 Redis 有鎖，直接回傳「機台正由 A 操作中」。
*   **Idempotency (冪等性)**：工廠 Wi-Fi 常斷線，如果前端發起「開始測試」後斷線沒收到 Response，前端重試會不會導致跑了兩次測試？在 API Header 帶入 `Idempotency-Key (UUID)`，後端用 Redis 檢查這個 Key 是否執行過，確保系統狀態一致。

---

## 3. AI / LLM 整合與實務應用 (AI & Data Analysis)

不要把重點放在如何 train 模型，而是如何用現成的 LLM API 解決工程/自動化痛點。

### 3.1 RAG 架構實戰 (用於錯誤日誌診斷)
面試官：「如果機台噴出一長串 Hex 錯誤碼跟 Log，你如何利用 LLM 幫助除錯？」
*   **Step 1: 知識庫建立 (Ingestion)**：將過去 10 年的硬體維修手冊、QA 報告，透過 Text Embedding Model (如 `text-embedding-gecko`) 轉為向量 (Vectors)，存入 Vector DB。
*   **Step 2: 關聯檢索 (Retrieval)**：當錯誤 Log 產生時，系統先抓取 Log 關鍵字，到 Vector DB 進行相似度搜尋 (Cosine Similarity)，找出歷史上最相似的 3 份維修報告。
*   **Step 3: 增強生成 (Generation)**：組裝 Prompt 送給 Gemini：「你是一個高階除錯工程師。這是目前的錯誤 Log：[Log]，這是參考資料：[3份報告]。請給出最可能的根本原因與 3 個具體排查步驟。」
*   **你的優勢**：這完全就是你 **OpenClaw Log Matrix** 的架構，可以直接當作經歷背書。

### 3.2 結構化輸出與 Function Calling
*   **問題**：LLM 喜歡講廢話（"好的，根據您的要求..."），這沒辦法寫進資料庫或串接後續程式。
*   **解法**：使用 LLM 的 Function Calling 或 JSON Mode 功能。在 Prompt 強制規定：`Output strictly in JSON format: {"error_category": "Hardware|Network|Software", "severity": 1-5, "suggested_action": "str"}`。這樣後端拿到回傳值就可以直接存進 DB 或觸發自動化工單系統。

### 3.3 傳統分析 vs LLM
*   **Anomaly Detection (異常檢測)**：不要殺雞用牛刀。機台溫度過高，應該用基本的 Threshold (閥值) 或統計學 (Z-Score，判斷是否偏離標準差) 搭配 Prometheus 告警。只有在「複雜的系統性崩潰（多系統同時異常）」時，才將時間區段內的 Log 送給 LLM 做語義分析。

---

## 4. 領域知識：智慧製造 (Smart Manufacturing)

即使是考軟體工程，懂這些術語能證明你能和 Domain Expert (工廠經理、硬體工程師) 對話。

*   **Edge Computing (邊緣運算)**：為什麼工廠不把所有資料直接丟給 Google Cloud 處理？
    1.  **延遲 (Latency)**：機器手臂防撞機制需要毫秒級反應，不能等雲端 round-trip。
    2.  **頻寬 (Bandwidth)**：高頻感測器一秒幾萬筆數據，必須在 Edge 端進行 Downsampling (降採樣) 或 Aggregation (聚合)，只把「異常片段」或「每分鐘平均值」傳上雲。
    3.  **安全性/離線能力**：就算外網斷線，工廠內的產線依然要能依靠 Edge 伺服器維持運作。
*   **OOB (Out-of-Band) vs In-Band**：
    *   *In-Band*：透過作業系統 (SSH/Agent) 拿資料。缺點是當 OS 死機 (Kernel Panic)，你就完全失去控制。
    *   *Out-of-Band*：透過獨立的晶片 (BMC) 與協定 (如 Redfish / IPMI)。即使主機板關機，只要有插電，你就能從遠端讀取溫度、強制重啟硬體。這在自動化基礎設施中非常重要。
*   **OEE (Overall Equipment Effectiveness, 設備綜合效率)**：
    *   公式：`OEE = Availability (可用率) × Performance (效能) × Quality (良率)`。你的軟體如果能自動偵測問題並減少 Downtime，就是提升了 Availability。

---

## 5. 行為面試與系統除錯 (Behavioral & Troubleshooting)

針對 HR 提到的 "daily issues/problems solving"。

### 5.1 如何回答「請分享一個你解過最困難的 Bug」？
*   **架構你的回答 (STAR 加上除錯思維)**：
    1.  **現象 (Situation)**：Production 環境不定時 Crash，沒有明顯錯誤日誌，每週發生一次。
    2.  **推理 (Task/Action)**：
        *   第一步：加上更多的 Observability (可觀測性)，在關鍵路徑補齊 Logging 和 Metrics。
        *   第二步：查看 Grafana 監控，發現 Crash 前 CPU 沒飆高，但 Memory 呈階梯狀上升。
        *   第三步：認定是 Memory Leak。拉取 Heap Dump 進行分析 (如 Python 的 `tracemalloc` 或 Node.js 的 Chrome DevTools Profiler)。
        *   第四步：發現是某個 RxJS Subscription 忘記取消，或是 WebSocket 連線斷開後沒有清掉對應的物件參考。
    3.  **結果 (Result)**：修復後，記憶體曲線從階梯狀變成平穩的鋸齒狀。學到的教訓是：建立 CI Pipeline 中的靜態程式碼分析 (Linter) 防堵這類失誤。

### 5.2 Ownership (當責)
*   不要只說你「寫了這個功能」。
*   說你「發現了 QA 團隊每天花 2 小時在手動比對資料（背景），主動提出可以用 XXX 架構解決（提案），串接了前後端（執行），最終替團隊省下 80% 的工時，並推廣成為部門標準（結果）」。這完全符合你的 `NVSSVT Enterprise Automation Platform` 的經歷。

---

## 🚀 週末實戰學習計畫 (Actionable Weekend Study Plan)

為了把上述概念內化，建議你在這個週末執行以下「小而美」的實作練習：

### [任務 1] 徹底搞懂 Angular 效能瓶頸
*   **Action**：在 StackBlitz 開一個新的 Angular 專案，寫一個 `*ngFor` 迴圈渲染 10,000 筆假機台資料（包含 ID、狀態、溫度）。
*   **Goal**：
    1. 寫一個 `setInterval` 每秒隨機更新其中 5 台機器的溫度。
    2. 觀察預設狀態下瀏覽器的卡頓情形。
    3. 加入 `trackBy` 函數。
    4. 將 Component 改為 `ChangeDetectionStrategy.OnPush`，並使用 Immutable array 操作來更新那 5 筆資料。體驗效能的巨大差異。

### [任務 2] RxJS 實戰肌肉記憶
*   **Action**：寫一個簡單的搜尋框 (Input) 與一個按鈕 (Button)。
*   **Goal**：
    1. 實作搜尋框：使用 `fromEvent` 監聽鍵盤輸入，串接 `debounceTime(300)` -> `distinctUntilChanged()` -> `switchMap(發送模擬的 HTTP 請求)`。
    2. 實作按鈕：使用 `fromEvent` 監聽點擊，串接 `exhaustMap(發送模擬的 HTTP 請求，設定 delay 2 秒)`。狂點按鈕，觀察 `exhaustMap` 是如何完美防連點的。

### [任務 3] 分散式鎖 (Distributed Lock) 白板推演
*   **Action**：不一定要寫 Code，但要在紙上畫出 **Redis Redlock** 的演算法流程。
*   **Goal**：
    1. 寫下假代碼 (Pseudocode)：`SET key value NX PX 30000`。
    2. 推演極端狀況：如果 A 拿到鎖，但執行太久導致鎖過期，B 此時拿到鎖，A 執行完後去刪除鎖，會不會不小心刪到 B 的鎖？
    3. 記住解法：解鎖時必須用 Lua script 檢查 `value` 是否還是 A 的 UUID，確認是自己的才能刪除。

### [任務 4] gRPC 初體驗
*   **Action**：用 Python 或 Go 寫一個最簡單的 gRPC Server 與 Client。
*   **Goal**：
    1. 撰寫一個 `.proto` 檔案，定義 `MachineStatus` Message 與一個 `GetStatus` RPC Service。
    2. 嘗試編譯出 stub 程式碼，並讓 Client 成功呼叫 Server。
    3. 感受 Protobuf 強型別與 JSON 的差異。



```
【誕生】 
   │
   ├── 1. constructor()           (類別初始化，此時 DOM 尚未存在)
   │
   ├── 2. ngOnChanges()           (🚀 只要有 @Input 資料綁定進來，此站最先點火)
   ├── 3. ngOnInit()              (🚀 元件基本商業邏輯初始化完成，最常用的主戰場)
   ├── 4. ngDoCheck()             (手動髒檢查對帳，高頻觸發，少用)
   │
   ├── 5. ngAfterContentInit()    (外部投影內容 <ng-content> 塞入元件內部完畢)
   ├── 6. ngAfterContentChecked() (外部投影內容對帳檢查完畢)
   │
   ▼
【DOM 觀測站 (你問的 ngAfterViewInit 就在這)】
   │
   ├── 7. ngAfterViewInit()       (🚀 關鍵：元件自己的 HTML 畫面與子組件全部渲染繪製完畢)
   └── 8. ngAfterViewChecked()    (元件自己的 HTML 畫面與子組件對帳檢查完畢)
   │
   ▼
【頻繁變更迴圈】 (只要畫面上任何 @Input 改變，或非同步事件觸發，會重複跑 2 -> 4 -> 6 -> 8 站)
   │
   ▼
【銷毀】
   └── 9. ngOnDestroy()           (🚀 離開頁面清場：解綁 RxJS 訂閱、清除監聽器，防止記憶體洩漏)
   ```