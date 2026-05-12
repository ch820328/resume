# BQ Story: Baby Tracker & The Distributed Sync Lock (Dive Deep / Ownership)

This story demonstrates expertise in distributed systems, data consistency, and low-level performance optimization.

---

## 🎭 STAR Story (English)

*   **Situation / Task**: 
    In our multi-user "Baby Tracker" app, we faced a critical **Data Consistency** issue. When family members simultaneously updated the same record (e.g., logging a baby's temperature or feeding time from two different phones), the system suffered from **Race Conditions**, leading to "Lost Updates" or "Data Drift."
*   **Action**:
    *   **Inner Monologue**: *"I realized that a simple 'Last Write Wins' strategy was unacceptable for health-related data. It felt irresponsible to leave data integrity to chance. I told myself: 'I must implement a deterministic locking mechanism on the server, even if it increases complexity.'"*
    *   **Deep Dive (Distributed Locking)**: I architected a **Hierarchical Locking system** using Redis. To ensure the "Check-and-Set" operation was atomic, I wrote custom **Redis Lua Scripts**. This guaranteed that the lock acquisition process was indivisible, preventing any intermediate race conditions at the storage layer.
    *   **Hierarchical Model**: I implemented a Root/Leaf model where the system acquires a Shared Lock on the Family ID (Root) before obtaining an Exclusive Lock on the specific record (Leaf). I also added an **Exponential Backoff** retry mechanism to handle lock contention gracefully.
    *   **Performance Awareness**: On the client-side, I utilized **WatermelonDB's JSI (JavaScript Interface)** to bypass the React Native bridge, improving data processing speed by 2-3x on legacy Android devices.
*   **Result**:
    Achieved **100% data consistency** under high-concurrency stress tests (simulating 1000+ simultaneous syncs via Artillery). The system remained responsive even on low-end devices during heavy synchronization.
*   **Future Pacing**: 
    *"This obsession with data integrity and atomicity is a mindset I will bring to Google's infrastructure, ensuring that our large-scale distributed systems remain consistent under even the most extreme edge cases."*

---

## 🎭 STAR Story (中文)

*   **S/T (情境/任務)**: 
    在多用戶共用的 Baby Tracker App 中，我們面臨嚴重的 **數據一致性** 問題。當家人同時在不同手機上更新同一條紀錄（例如：同時記錄體溫或餵奶時間）時，系統會發生 **Race Condition (競爭狀態)**，導致「最後寫入者獲勝」造成的數據遺失或數據漂移。
*   **Action (行動)**:
    *   **內心獨白**: 「我意識到對於健康相關的數據，簡單的『最後寫入者獲勝』策略是不可接受的。這對數據完整性來說非常不負責任。我告訴自己：『我必須在服務端建立一個確定的鎖定機制，即使這會增加系統複雜度。』」
    *   **深入挖掘 (分散式鎖)**: 我設計了一套基於 Redis 的 **階層式鎖定系統 (Hierarchical Locking)**。為了確保『檢查並設定 (Check-and-Set)』操作的原子性，我親自編寫了 **Redis Lua 腳本**。這保證了獲取鎖的過程是不可分割的，防止了存儲層的任何中間競爭狀態。
    *   **階層模型**: 我實作了 Root/Leaf 模型，在取得特定紀錄（Leaf）的排他鎖前，系統會先對家庭 ID（Root）取得共享鎖。我還加入了 **指數加權退避 (Exponential Backoff)** 重試機制，優雅地處理鎖競爭。
    *   **效能意識**: 在客戶端，我利用 **WatermelonDB 的 JSI 技術** 繞過 React Native Bridge，在舊款 Android 設備上將數據處理速度提升了 2-3 倍。
*   **Result (結果)**:
    在模擬 1000+ 同步請求的高併發壓力測試（使用 Artillery）下，達成了 **100% 的數據一致性**。即便在大量同步期間，低階設備依然能保持流暢響應。
*   **未來投射**: 
    「這種對數據完整性與原子性的執著，是我會帶進 Google 基礎設施建設的思維，確保我們的大規模分散式系統在最極端的邊界條件下依然能保持一致性。」

---

## 📚 Technical Glossary (技術名詞)

*   **🇺🇸 Lost Update / 🇹🇼 遺失更新**: A problem where two transactions update the same data, and the second one overwrites the first one without considering its changes.
*   **🇺🇸 Race Condition / 🇹🇼 競爭狀態**: A situation where the timing of events affects the final outcome, often leading to unpredictable results.
*   **🇺🇸 Lua Script (Redis) / 🇹🇼 Lua 腳本**: A scripting language used inside Redis to execute multiple commands as a single atomic operation.
*   **🇺🇸 Hierarchical Locking / 🇹🇼 階層式鎖定**: A locking strategy that manages locks at different levels of a hierarchy to balance concurrency and integrity.
*   **🇺🇸 JSI (JavaScript Interface) / 🇹🇼 JS 介面**: A high-performance bridge in React Native for direct communication between JS and native C++ code.
