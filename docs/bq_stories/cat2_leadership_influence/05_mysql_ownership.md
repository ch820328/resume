# 05. Ownership | 主人翁精神
## Project: MySQL 8.x Migration (Validation & Risk Identification)

### 🎭 STAR Story (English)

*   **Situation**: 
    Our automation service (~5,000 RPM) was migrating from SQLite to MySQL 8.x to resolve database lock issues. I was responsible for the **Technical Validation** of this migration.
*   **Task**: 
    My primary mandate was to verify that the new MySQL setup wouldn't suffer from the same locking bottlenecks under high concurrency.
*   **Action**: 
    I chose **sysbench** to build a high-fidelity stress test suite. While my initial focus was checking for DB locks, I decided to proactively monitor the **Latency and Response Time statistics** during the test runs. As the tests progressed, I identified a significant **Performance Regression** in the default MySQL 8.x configuration—the system wasn't "locking," but it was becoming unacceptably slow. I documented these latency spikes with hard data and **flagged this critical risk** to the infrastructure team before the scheduled go-live.
*   **Result**: 
    My data-driven escalation allowed the infra team to intervene early and tune the InnoDB internal threads. By identifying this performance gap during the testing phase, I prevented a potential production degradation, ensuring the migration eventually launched with a **30% performance headroom**.
*   **Learning**: 
    Ownership as a Validation Engineer means **looking beyond the primary objective**. By monitoring "unrequested" metrics like Latency, I was able to identify a systemic risk that would have otherwise crippled the production line.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    我們的自動化服務（約 5,000 RPM）當時正從 SQLite 遷移至 MySQL 8.x，以解決資料庫鎖定問題。我負責這項遷移任務的 **技術驗證 (Validation)**。
*   **任務 (Task)**: 
    我的首要授權是驗證新的 MySQL 設定在高併發下不會再遭受同樣的鎖定瓶頸。
*   **行動 (Action)**: 
    我選擇使用 **sysbench** 建立了一套高仿真的壓力測試套件。雖然我最初的焦點是檢查資料庫鎖定，但我決定在測試執行期間主動監控 **延遲 (Latency) 與響應時間的統計數據**。隨著測試進行，我發現 MySQL 8.x 的預設配置存在嚴重的 **性能回歸**——系統雖然沒有「鎖死」，但變得慢到無法接受。我用確鑿的數據記錄了這些延遲峰值，並在預定上線前將這一 **關鍵風險通報 (Flag)** 給了基礎設施團隊。
*   **結果 (Result)**: 
    我的數據驅動預警讓基礎設施團隊得以提早介入並調優 InnoDB 內部線程。透過在測試階段識別出這個性能缺口，我防止了潛在的生產環境性能惡化，確保了遷移最終在擁有 **30% 性能餘裕** 的情況下成功上線。
*   **反思 (Learning)**: 
    身為驗證工程師的主人翁精神體現在 **「超越主要目標的視野」**。透過監控像「延遲」這樣非要求的指標，我得以識別出一個若不處理將會癱瘓生產線的系統性風險。

---

### ❓ 模擬問答 (Possible Q&A)

1.  **問：「既然你的任務是檢查 Lock，為什麼你會決定去關注 Latency？」(Analytical Thinking)**
    *   **🇺🇸 English**: "In a high-RPM manufacturing environment, Latency is just as lethal as a Lock. A slow database can cause timeouts in the automation controllers, leading to production stops. I felt it was my responsibility to ensure the *total quality* of the migration, not just the absence of a specific error."
    *   **🇹🇼 中文**: 「在高轉速的製造環境中，延遲與鎖死同樣致命。緩慢的資料庫會導致自動化控制器逾時，進而造成停產。我覺得我有責任確保遷移的 *整體品質*，而不僅僅是確認某個特定錯誤是否消失。」

2.  **問：「當你發現性能回歸並通報給其他團隊時，你如何確保你的發現受到重視？」(Influence & Communication)**
    *   **🇺🇸 English**: "I presented **Quantifiable Evidence**. Instead of saying 'it feels slow,' I provided sysbench reports showing the P95 latency distribution and correlated them with InnoDB log wait metrics. By providing a clear, data-backed risk assessment, I made it easy for the infrastructure team to prioritize the fix."
    *   **🇹🇼 中文**: 「我展示了 **可量化的證據**。我沒有只說『感覺變慢了』，而是提供了顯示 P95 延遲分佈的 sysbench 報告，並將其與 InnoDB 日誌等待指標進行關聯。透過提供清晰且有數據支持的風險評估，我讓基礎設施團隊能輕易地將這項修復列為優先任務。」
