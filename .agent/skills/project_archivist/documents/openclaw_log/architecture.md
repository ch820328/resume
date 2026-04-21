# 架構設計：OpenClaw Log Matrix & Semantic Diagnosis 診斷平台

此主線專注於自動化測試日誌的深度診斷與根因分析，結合 Semantic Diagnosis 技術將故障與實際程式碼關聯。

---

## 目的 (Purpose)
將複雜測試日誌（如 BiosLib, rf_debug 等）中埋藏的失敗原因轉化為可執行的診斷報告。核心目的是在對接程式碼庫 (Semantic Diagnosis) 的情況下，讓系統不只推論 Log 面，而能關聯到對應的程式實作，大幅縮短 Fail 回報到修復的時間。

---

## 流程 (Workflow)
1.  **進入路徑**：
    *   **手動/API**：透過 `/ats-log/analyze` 提供 Log 純文本分析。
    *   **自動鏈路**：系統自測資料庫拉取 `ResultDatabase.txt`，針對 FAIL 項自動展開。
2.  **Log 片段提取**：智慧定位與測試失敗相關的日誌範圍，過濾 Robot 輪次中無效的背景執行日誌，保留核心上下文。
3.  **Log Matrix 審閱階段**：
    *   **Log 總指揮**：判讀測評名稱與工具類型，決定啟動哪些 Log 分類專家。
    *   **Codebase Semantic Diagnosis (選配)**：若專案已建立向量索引，發起語義搜尋擷取相關程式碼。
    *   **各專家並行輸出**：Log 專家與程式碼 Context 結合，產出結構化 JSON。
4.  **彙總與紀錄**：合成最終分析 JSON，並完整紀錄 `pipeline_trace`、`codebase_rag_files` 與所耗時長。
5.  **寫回機制**：手動分析結果會額外存入 Issue 向量庫，加速日後「相似失敗」的自動建議。

---

## 好處 (Benefits)
*   **輔助決策實例化**：直接產出根因建議與嚴重度評估，對齊工程師除錯大腦，減少初步通讀 Log 的負擔。
*   **精準 Code-Context 鏈結**：不再只是字面推測，而是真正關聯到 codebase 實作位置，縮短定位週期。
*   **除錯經驗沉澱**：透過向量紀錄歷史分析，讓重複出現的失敗能被快速識別。
*   **高透明度調查**：明確標註 AI 檢視了哪些關鍵日誌行，讓開發者能快速核對模型判斷。
