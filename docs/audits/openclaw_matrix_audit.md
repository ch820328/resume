# Technical Audit: OpenClaw AI Review Matrix Architecture

本審核針對 `open-claw-webservice` 的核心 AI 審核引擎進行深度分析，該系統採用了業界領先的多智能體協同 (Multi-Agent Orchestration) 架構。

---

## 1. 核心架構：三階段矩陣流水線 (3-Phase Pipeline)

### Phase 1: 策略調度 (Master Orchestrator)
*   **邏輯**: 系統接收到 GitLab Webhook 後，首先由 `MASTER_AGENT` 讀取 MR 的元數據與 Diff。
*   **決策基準**: 根據代碼變更的複雜度 (Complexity: LOW/MEDIUM/HIGH) 與檔案類型，動態生成一份 **Orchestration Plan**。
*   **亮點**: 系統會自動檢測是否有底層 C/C++ 源碼變更，若有則強制介入 `EXP_CLEAN_CODE` 專家，確保韌體層級的代碼規範。

### Phase 2: 專家矩陣執行 (Specialist Matrix)
*   **並行化**: 透過 NestJS 與 BullMQ 實現專家節點的並行調用，極大提升了審核效率。
*   **黑板模式 (Blackboard Pattern)**: 專家之間並非孤立。後續批次的專家可以讀取 `CROSS_EXPERT_CRITICAL_FINDINGS`（黑板上的關鍵發現），避免重複勞動並加深分析深度。
*   **深度控制**: 透過 `matrixDepthReviewHint` 動態調整 LLM 的分析深度，確保資源花在刀口上。

### Phase 3: 結論聚合 (Aggregator)
*   **合成邏輯**: `AGG_AGENT` 負責收集所有專家的碎片化意見，消除冗餘與衝突，最終產出包含 `score`, `issues`, `code_suggestions` 的標準化 JSON。
*   **自動化回饋**: 系統支持 `postReviewToGitlab`，能自動將發現的問題以 Thread 的形式回貼至 GitLab MR，實現開發閉環。

---

## 2. 穩定性與邊際案例處理 (Resilience)

*   **JSON 健壯性**: 實作了雙重防線：`extractJson` (正則提取) 與 `jsonrepair` (結構修補)，有效解決了 LLM 輸出的截斷問題。
*   **上下文管理 (Context Budgeting)**: 
    *   針對超大型 MR，實作了 `getMatrixReviewerContext` 算法。
    *   優先保留 **MR Diff** 與 **Strict Rules**，對中間的庫文件進行「緊急裁切 (Emergency Truncation)」，保證核心變更始終在 LLM 的視窗內。
*   **併發控制**: 透過 `OPENCLAW_MATRIX_GATEWAY_CONCURRENCY` 環境變數精確控制 API 流量，防止觸發上游 LLM 供應商的 Rate Limit。

---

## 3. 面試 Dive Deep 預演

*   **Q: 為什麼不直接用一個大 Prompt 解決所有問題？**
    *   *A*: 單一 Prompt 會受到 Long-context 失憶問題的影響，且無法同時具備多維度的專家視角。矩陣架構將問題解構，讓 Logic 專家專注於邏輯，Security 專家專注於漏洞，最後由 Aggregator 彙整，能顯著提升精準度與召回率。
*   **Q: 專家之間如何通訊？**
    *   *A*: 我們採用了非對稱的通訊機制。同一批次並行的專家不互相通訊以保持效能，但後續批次的專家會獲取前序專家的「關鍵發現」快照，這在複雜的跨模組變更分析中非常有效。
