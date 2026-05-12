# BQ Story: MySQL 8.x Optimization & Production Line Reliability (Performance / High Standards)

這張投影片展現了對系統性性能衰退的診斷能力，以及在關鍵生產環境中維持資料庫穩定性的經驗。

---

## 🎭 STAR Story (English)

*   **Situation / Task**: 
    Our production line automation service (approx. 5,000 RPM) was plagued by **SQLite File Lock collisions**, causing write failures and manufacturing delays. I was tasked with developing an automated stress-testing framework to reproduce these resource conflicts. Crucially, during the subsequent migration to **MySQL 8.x**, this same framework proactively identified a significant **performance regression** in the new database version before it reached production.
*   **Action**:
    *   **Inner Monologue**: *"I realized that fixing the SQLite lock issue was just the first step. To ensure a smooth migration to MySQL, we needed a 'Performance Safety Net.' I decided to build a generic sysbench-based framework that could validate any backend under our specific multi-source, randomized load."*
    *   **Stress Testing & Discovery**: I implemented a randomized CRUD simulation using **sysbench**. While validating the MySQL 8.x upgrade, the tool flagged that the new version was performing slower than expected due to default thread management and redo log settings.
    *   **Optimization**: I leveraged the test data to tune MySQL 8.x's `innodb_log_writer_threads` and locking logic, resolving both the original concurrency issue and the new version's performance bottleneck.
*   **Result**:
    *   Eliminated all write collision-induced locks, restoring 24/7 stability to the production line.
    *   Recovered throughput performance to meet the 5,000 RPM requirement with **30% additional headroom** for future scaling.
    *   Established a new version-upgrade validation standard for the department.
*   **Learning (Future Pacing)**: 
    *"This experience reinforced the importance of 'Stress-First' validation for infrastructure upgrades. At Google, where system scale is massive, my ability to use data-driven stress testing to preemptively catch performance regressions will ensure that our global services remain resilient during version migrations."*

---

## 🎭 STAR Story (中文)

*   **S/T (情境/任務)**: 
    *   **核心問題**: 
    1.  **初期問題**: 產線自動化服務使用 SQLite，在高併發（5,000 RPM）下頻繁觸發 **File Lock (SQLite_Busy)**，導致寫入失敗。
    2.  **二次問題**: 為了擴展性遷移至 MySQL 8.x 時，透過壓測工具抓出 **性能回歸 (Performance Regression)**。
*   **測試目標**: 建立自動化壓測框架，先解決 SQLite 鎖死問題，再驗證並優化 MySQL 升級後的性能。為了確保遷移到 MySQL 過程順利，我們需要一個『性能安全網』。我決定建立一個基於 sysbench 的通用框架，用來驗證任何後端在我們特定的多來源、隨機負載下的表現。」
    *   **壓測與發現**: 我利用 **sysbench** 實作了隨機 CRUD 模擬。在驗證 MySQL 8.x 升級時，工具發現新版本因預設的線程管理與 Redo Log 設定，表現不如預期。
    *   **優化方案**: 我利用測試數據調優了 MySQL 8.x 的 `innodb_log_writer_threads` 與鎖邏輯，同時解決了原始的併發衝突與新版本的性能瓶頸。
*   **Result (結果)**:
    *   徹底消除了所有由寫入碰撞引起的鎖死，恢復了產線 24/7 的穩定運作。
    *   恢復並提升了吞吐量，不僅滿足 5,000 RPM 的需求，還預留了 **30% 的擴展空間**。
    *   為部門建立了一套新的版本升級驗證標準。
*   **Learning (未來投射)**: 
    「這次經驗強化了『壓力測試先行』在基礎設施升級中的重要性。在 Google 這種規模的系統中，我利用數據驅動的壓測來預先捕捉性能回歸的能力，將能確保全球服務在版本遷移期間保持強韌與穩定。」
