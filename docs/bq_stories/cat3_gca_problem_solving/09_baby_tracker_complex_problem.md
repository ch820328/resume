# 09. Complex Problem Solving | 解決複雜問題 (Variant 2)
## Project: Baby Tracker (Distributed Sync & Atomicity)

### 🎭 STAR Story (English)

*   **Situation**: 
    In our multi-user Baby Tracker app, we encountered a classic distributed systems problem: **Race Conditions**. When two parents updated a baby's temperature or feeding time simultaneously from different devices, one update would overwrite the other, leading to potentially dangerous data drift in a health-related app.
*   **Task**: 
    Ensure 100% data atomicity and consistency across distributed clients without significantly increasing latency.
*   **Action**: 
    I solved this by implementing a **Hierarchical Locking Strategy** using Redis. To ensure the "Check-and-Set" operation was truly atomic, I wrote custom **Redis Lua Scripts** to execute the lock acquisition logic entirely within the database engine. I also implemented a **Root/Leaf locking model** where a family-level lock is acquired before modifying individual records. On the client-side, I optimized the sync engine using **WatermelonDB's JSI bridge** to ensure that local updates remained snappy even during high-concurrency server syncs.
*   **Result**: 
    Achieved **100% data consistency** in high-concurrency stress tests (1,000+ simultaneous syncs). Zero reported data loss incidents since deployment.
*   **Learning**: 
    Complex problems in distributed systems often require moving logic closer to the data (like Lua scripts in Redis) to guarantee atomicity. The key is to balance strict consistency with the performance expectations of the end-user.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    在我們的多用戶 Baby Tracker App 中，我們遇到了一個經典的分散式系統問題：**競爭狀態 (Race Condition)**。當兩位家長同時在不同設備上更新寶寶的體溫或餵奶時間時，其中一個更新會覆蓋另一個，這對於健康相關的 App 來說，可能導致危險的數據漂移。
*   **任務 (Task)**: 
    在不顯著增加延遲的情況下，確保跨分散式客戶端的 100% 數據原子性與一致性。
*   **行動 (Action)**: 
    我透過實作一套基於 Redis 的 **「階層式鎖定策略 (Hierarchical Locking)」** 來解決這個問題。為了確保「檢查並設定 (Check-and-Set)」操作是真正的原子性，我編寫了自定義的 **Redis Lua 腳本**，讓鎖定邏輯完全在資料庫引擎內執行。我還實作了 **Root/Leaf 鎖定模型**，在修改單條紀錄前先取得家庭級別的鎖。在客戶端，我利用 **WatermelonDB 的 JSI 橋接技術** 優化了同步引擎，確保即使在高併發同步時，本地更新依然流暢。
*   **結果 (Result)**: 
    在模擬 1,000+ 同時同步的高併發壓測下，達成了 **100% 的數據一致性**。自部署以來，未發生任何數據遺失事件。
*   **反思 (Learning)**: 
    分散式系統中的複雜問題通常需要將邏輯移到更靠近數據的地方（如 Redis 中的 Lua 腳本）來保證原子性。關鍵在於在嚴格的一致性與最終用戶的性能預期之間取得平衡。
