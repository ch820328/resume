# Technical Audit: MySQL 8.x High-Concurrency Stress Testing & Optimization

這份文件總結了針對產線自動化服務（Production Line Automation）在資料庫升級後遇到的性能瓶頸，所進行的壓力測試與優化分析。

---

## 1. 背景與挑戰 (Context & Challenges)

*   **系統環境**: 負責產線自動化紀錄的服務，吞吐量約為 5,000 RPM (Requests Per Minute)。
*   **技術變動**: 資料庫從 MySQL 5.x 升級至 8.x。
*   **核心問題**: 
    1.  **初期問題**: 產線自動化服務使用 SQLite，在高併發（5,000 RPM）下頻繁觸發 **File Lock (SQLite_Busy)**，導致寫入失敗。
    2.  **二次問題**: 為了擴展性遷移至 MySQL 8.x 時，透過壓測工具抓出 **性能回歸 (Performance Regression)**。
*   **測試目標**: 建立自動化壓測框架，先解決 SQLite 鎖死問題，再驗證並優化 MySQL 升級後的性能。

---

## 2. 測試設計 (Stress Test Design)

### A. 高仿真負載模擬 (High-Fidelity Simulation)
*   **工具**: 使用 `sysbench` 配合自定義 **LUA 腳本**。
*   **模式**: 模擬多個產線節點同時發起隨機 CRUD 請求，重點在於 `UPDATE` 與 `INSERT` 的碰撞測試。
*   **參數**: 設置超過 128-256 個併發線程，以模擬極限負載下的資料庫行為。

### B. 關鍵指標分析 (Key Metrics)
*   **Latency (95th/99th percentile)**: 觀察升級前後的延遲分佈。
*   **Deadlocks per Second**: 監控 `InnoDB` 的鎖爭用情況。
*   **I/O Bound vs CPU Bound**: 區分瓶頸是來自於磁碟寫入（Redo Log 頻率）還是 CPU（線程切換開銷）。

---

## 3. 診斷結果與優化 (Diagnosis & Optimization)

### A. 性能回歸原因分析
1.  **Redo Log 優化**: MySQL 8.0 重新設計了日誌寫入機制（Log Writer），在特定硬體下，預設的 `innodb_log_writer_threads` 可能導致額外的線程切換開銷。
2.  **Doublewrite Buffer**: 8.0 的雙寫緩衝區位置變更，若沒有正確配置 `innodb_doublewrite_files`，會在高併發下產生 I/O 瓶頸。

### B. 解決方案 (The Fix)
*   **鎖優化**: 縮短事務範圍，優化索引以減少 Next-Key Lock 的掃描範圍。
*   **參數調優**: 
    *   調整 `innodb_flush_log_at_trx_commit` 在性能與數據安全間取得平衡。
    *   優化 `max_connections` 與 `innodb_thread_concurrency` 避免線程過度競爭。
*   **架構建議**: 建議在前端引入緩衝機制或優化 API 層的連線池管理。

---

## 4. Dive Deep 可能的問題

*   **Q: 為什麼 5,000 RPM 的量級會需要用到 sysbench 這種重型工具？**
    *   *A*: 雖然平均值不驚人，但在產線切換或批次上傳時，會出現極短時間內的突發流量 (Spike)。`sysbench` 幫助我們模擬這種 Spike，確保系統在 Peak Load 下依然能保持 ACIT 特性而不死鎖。
*   **Q: 你在測試中如何確保「隨機性」？**
    *   *A*: 在 LUA 腳本中使用 `math.random` 並配合多樣化的 `WHERE` 條件子句，確保緩衝池 (Buffer Pool) 的命中率接近真實生產環境的離散分佈。
