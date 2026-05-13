# 10. Data-Driven Decisions | 數據導向
## Project: MySQL 8.x Performance Infra (Sysbench Optimization)

### 🎭 STAR Story (English)

*   **Situation**: 
    Our production line automation service was migrating from SQLite to MySQL 8.x. The team assumed the new database would be faster "out of the box," but we had no hard data to prove it.
*   **Task**: 
    I needed to validate the performance and ensure the 5,000 RPM requirement was met without regressions.
*   **Action**: 
    I built a **sysbench-based stress testing framework** to generate objective data. The tests revealed a shocking **performance regression** in MySQL 8.x due to default thread management settings. Instead of guessing, I used the profiling data to tune `innodb_log_writer_threads` and locking logic. I ran randomized CRUD simulations until I found the optimal configuration.
*   **Result**: 
    Not only met the 5,000 RPM requirement but achieved **30% additional headroom**. We caught a major production bottleneck before it even reached the manufacturing line.
*   **Learning**: 
    Never trust assumptions or default settings in infrastructure. Objective, data-driven stress testing is the only way to ensure reliability at scale.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    我們的產線自動化服務正從 SQLite 遷移到 MySQL 8.x。團隊假設新資料庫「開箱即用」會更快，但我們沒有確切數據證明。
*   **任務 (Task)**: 
    我需要驗證性能，並確保滿足 5,000 RPM 的需求且沒有性能回歸。
*   **行動 (Action)**: 
    我建立了一個 **基於 sysbench 的壓力測試框架** 來產生客觀數據。測試發現 MySQL 8.x 因預設線程管理設定而出現令人驚訝的 **性能回歸**。我沒有瞎猜，而是利用分析數據來調優 `innodb_log_writer_threads` 與鎖邏輯。我執行了隨機 CRUD 模擬，直到找到最佳配置。
*   **結果 (Result)**: 
    不僅滿足了 5,000 RPM 的需求，還額外獲得了 **30% 的擴展空間**。我們在問題到達生產線之前就攔截了重大的性能瓶頸。
*   **反思 (Learning)**: 
    在基礎設施中，永遠不要相信假設或預設設定。客觀、數據驅動的壓力測試是確保規模化穩定性的唯一途徑。
