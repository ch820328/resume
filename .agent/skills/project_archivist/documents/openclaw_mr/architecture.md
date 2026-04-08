# 架構設計：OpenClaw AI Merge Request 審閱服務

OpenClaw 的 MR 審閱主線是一個分散式 AI 專家系統，專注於在程式碼合併前提供高品質、多維度的技術回饋。

---

## 目的 (Purpose)
在程式合併進主線前後，自動化運用多專家視角（安全、邏輯、效能、可測性等）檢視變更，產出可追蹤的分數與結構化建議。旨在整合 Dashboard、API 與郵件通知，共用同一份分析結果，解決人工逐行 Diff 的高認知負擔與疏漏問題。

---

## 流程 (Workflow)
1.  **觸發啟動**：
    *   **週期同步**：系統自動掃描視窗內已合併的 MR。
    *   **主動觸發**：透過 GitLab Webhook (MR open/update)、REST API (trigger-review) 或 Dashboard「重試」按鈕排入 BullMQ。
2.  **資料預處理**：呼叫 GitLab API 擷取 MR 內容、Commits 與原始 Diff 文本，組合成分析 Context。
3.  **狀態判斷 (Idempotency)**：比對 Commit Signature，若 Commits 與上次相同且存有現成結果，則跳過 LLM 呼叫。
4.  **Matrix 審閱階段**：
    *   **Phase 1 (Master)**：總指揮 Agent 評估變更複雜度，規劃專家矩陣。
    *   **Phase 2 (Experts)**：多個領域專家 Agent 並行分析並輸出結構化意見。
    *   **Phase 3 (Aggregator)**：彙整各路意見，計算最終分數、摘要與改善建議。
5.  **寫回與曝光**：結果存入資料庫，刷新 Dashboard Snapshot，確保同一 MR 同一時間只有一個職程執行（透過 Redis 分散式鎖）。

---

## 好處 (Benefits)
*   **決策一致性**：無論觸發源為何，審閱標準與資料模型完全對齊。
*   **成本控管**：智能快取機制避免對無變動的 Commits 進行重複分析。
*   **深入覆蓋**：矩陣式架構能同時從安全、效能、邏輯多個維度進行深度鑽研，優於單一 Prompt。
*   **營運透明**：提供完整 Session 紀錄與 Metadata，便於追蹤與稽核。
