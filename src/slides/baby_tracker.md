# Interview Guide: Offline-First Distributed System (Baby Tracker)

## 🎤 Elevator Pitch (1-Minute)
*   **🇺🇸 English:** "As the sole architect and engineer, I designed and shipped a production-grade distributed sync engine for a cross-platform caregiving app. The core challenge was multi-device concurrent writes in an offline-first environment. I built a Hierarchical Redis Smart Lock system (Root/Leaf scope), a Redis SETNX Idempotency Middleware to eliminate duplicate writes from network retries, version-based optimistic locking with per-row version columns inside ACID-guaranteed Prisma transactions, and an Elastic Batching pull service to prevent timestamp-boundary data loss. Post-commit, a WebSocket service invalidates cross-device caches in real time. All major design decisions are documented in 5 production ADRs."
*   **🇹🇼 中文:** 「我以唯一的架構師兼工程師身份，設計並交付了一套生產環境等級的分散式同步引擎。核心挑戰是 Offline-First 環境下的多裝置併發寫入。我構建了分層的 Redis Smart Lock 系統（Family Root 鎖 / Baby Leaf 鎖）、防範網路重試重複寫入的 Redis SETNX 冪等性中間件、基於每列版本號的樂觀鎖定包裹在 Prisma ACID 交易中、以及防止時間戳邊界資料遺失的 Elastic Batching 拉取服務。交易提交後，WebSocket 服務即時讓各裝置的快取失效。所有重大設計決定記錄在 5 個生產等級的 ADR 文件中。」

## 🚀 Google L4/L5 Behavioral & Architecture Deep Dive

### [L4/L5 Behavioral] Full Ownership of a Distributed System (從零到生產的完整擁有權)
*   **❓ Question:** "Tell me about the most complex technical system you've designed and owned end-to-end."
*   **🇺🇸 English Response:**
    *   **Context:** I needed a sync engine that felt instant to the user (Offline-First), yet was provably correct—no data loss, no silent overwrites of healthcare data—across concurrent multi-device writes.
    *   **Action (Ownership):** I wrote all 5 ADRs first, formally evaluating Redlock vs Hybrid Locking, LWW vs CRDT vs Optimistic Locking, and WatermelonDB vs raw SQLite. I then implemented each layer: idempotency middleware, hierarchical locks, optimistic locking inside atomic DB transactions, elastic batching in pull, and WebSocket cache invalidation.
    *   **Impact:** Zero data corruption in production. Sub-50ms UI response. The system works correctly under double-retry, concurrent multi-device, and offline-to-online transition scenarios.
*   **🇹🇼 中文回應:**
    *   **情境:** 我需要一個讓用戶感受瞬間（Offline-First），同時在技術上可以被證明正確的同步引擎——不能有資料遺失，不能靜默覆蓋健康紀錄——而且必須應對多裝置的高併發寫入。
    *   **行動 (完整擁有):** 我先寫完所有 5 個 ADR，系統性評估了 Redlock vs Hybrid Lock、LWW vs CRDT vs Optimistic Lock、WatermelonDB vs 裸 SQLite。再逐層實作：冪等性中間件、分層鎖、在 ACID 交易內的樂觀鎖、Elastic Batching Pull、以及 WebSocket 快取失效。
    *   **影響:** 生產環境零資料毀損。UI 感受低於 50ms。系統在雙重重試、多裝置併發、以及離線轉線上的各種情境下均正確運作。

### [L4 Architecture] Hierarchical Lock Design — Root vs. Leaf (分層鎖設計的取捨)
*   **❓ Question:** "You implemented a Root/Leaf hierarchical locking system. Why not always lock at the Family (Root) level? What's the trade-off?"
*   **🇺🇸 English Defense:**
    *   "**Trade-off:** A single root lock is simple but creates an unnecessary serialization bottleneck for independent operations."
    *   "If two caregivers from the same family update different babies simultaneously, a Root lock would force one to wait even though they're touching completely separate data. A Leaf lock per `baby_id` allows true parallelism."
    *   "The Smart Lock Middleware inspects the incoming payload's table keys. Root-scope tables (e.g., `profile_family`, `food_categories`) require a Root lock. Baby-scoped-only payloads targeting exactly one `baby_id` use a cheaper Leaf lock. Mixed-baby payloads default to Root to prevent deadlocks."
*   **🇹🇼 中文防禦:**
    *   「**取捨:** 統一 Root 鎖簡單，但對獨立操作製造了不必要的序列化瓶頸。」
    *   「若兩個照護者同時更新同家庭不同寶寶的紀錄，Root 鎖會讓其中一個白等。Baby Leaf 鎖允許真正的並行。」
    *   「Smart Lock 中間件檢查 Payload 的 Table 鍵。Root 範圍的表需要 Root 鎖；只涉及 Baby 範圍且只有單一 `baby_id` 的 Payload 用 Leaf 鎖；混合 Baby 的 Payload 預設 Root 鎖防止死鎖。」

### [L4 Architecture] Elastic Batching — The Timestamp Boundary Problem (時間戳邊界問題)
*   **❓ Question:** "You built an 'Elastic Batching' mechanism in the pull service. What is the timestamp-boundary data loss problem and how does your design solve it?"
*   **🇺🇸 English Defense:**
    *   "**Problem:** The pull query uses `updatedAt > lastPulledAt`. If the batch limit is 1000 and many records were inserted simultaneously at timestamp `T`, the 1001st record—also at `T`—is silently cut off. The next pull advances the cursor past `T`, permanently losing that record."
    *   "**Solution:** When a batch hits the limit, `extendBatch` checks if the last record's `updatedAt` has a 'collision'—records at the exact same timestamp that were sliced off. It fetches them explicitly using `id NOT IN` the already-returned set. This guarantees atom-correct batches regardless of write bursts."
*   **🇹🇼 中文防禦:**
    *   「**問題:** Pull 查詢使用 `updatedAt > lastPulledAt`。若批次上限 1000 筆，而同一時間戳 `T` 有多筆被創建，第 1001 筆被默默截斷。下次 Pull 游標推進超過 `T`，那筆資料就永久消失了。」
    *   「**解法:** 批次達到上限時，`extendBatch` 函式檢查最後一筆的 `updatedAt` 是否有『碰撞』紀錄。它用 `id NOT IN` 明確撈取那些被截斷的剩餘記錄。無論寫入突增，每個批次都被保證完整且原子正確。」

### [L5 Architecture] Idempotency Middleware — Atomic Lock-then-Cache Pattern (冪等性的原子設計)
*   **❓ Question:** "Your idempotency middleware uses Redis SETNX. What if two identical requests arrive simultaneously? Isn't there a race condition where both could find the result key missing and both proceed?"
*   **🇺🇸 English Defense:**
    *   "This is exactly why I used **SETNX as an Atomic Mutex**, not a simple cache check."
    *   "Step 1: Both requests attempt `SET lockKey 'processing' EX 60 NX`. Redis guarantees only one succeeds atomically."
    *   "Step 2: The loser immediately checks the result cache. If present, replay it. If not, return HTTP 429—the request is in-flight."
    *   "Step 3: The winner writes the final response to `resultKey` (setex, 24h TTL) and deletes the lock key when finished."
    *   "**Fail-closed:** If Redis is down, I return HTTP 503. I cannot guarantee idempotency, so I refuse to allow potentially duplicate writes."
*   **🇹🇼 中文防禦:**
    *   「這正是我用 **SETNX 作為原子互斥鎖** 而非普通快取鍵的原因。」
    *   「步驟一：兩個請求都嘗試 `SET lockKey 'processing' EX 60 NX`。Redis 原子性保證只有一個成功。」
    *   「步驟二：失敗方立即嘗試讀取結果快取。有則重播；無則回傳 HTTP 429。」
    *   「步驟三：勝出方完成後，將最終回應寫入 `resultKey`（setex，24h TTL）並刪除鎖的 Key。」
    *   「**Fail-Close 設計:** Redis 掉線回傳 HTTP 503，拒絕請求。無法保證冪等性時，我拒絕允許潛在的重複寫入。」
