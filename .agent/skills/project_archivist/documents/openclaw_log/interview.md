# 面試指南：OpenClaw Log Matrix & RAG 診斷平台 (STAR 答題)

本指南專注於自動化測試失敗診斷之技術挑戰、RAG 檢索策略與系統整合。

---

### Q1: "如何透過 AI 縮短測試日誌（Log）的除錯時間？"
- **Situation**: 在大量 Firmware 測試中，`rf_debug` 或 `BiosLib` 的 Log 可能高達數萬行，傳統做法是由工程師手工搜尋關鍵字，耗時且效率低，且常面臨「知其然而不知其所以然」。
- **Task**: 建立一個能從海量 Log 中自動「讀懂」根因並連結 codebase 的 AI 工具。
- **Action**: 
    - 實作了 **Log Matrix Pipeline**：透過專家模式篩選有效 Log 區段，並決定是否啟動 RAG。
    - **檢索增強生成 (RAG)**：建立了 codebase 向量索引，當 Log 分析提到特定函式或錯誤模組時，AI 會主動搜尋實作原始碼並併入分析 Context。
    - 結合 **FAIL 展開分析器**：針對測試資料庫中的 FAIL 項點擊即分析，產出結構化建議。
- **Result**: 顯著加速了 **FAIL 測試的初步排查效率**。診斷報告包含「可能的根因、建議 Action 與嚴重度」，將原本需要數小時的手動 Log 分析縮短至分鐘級別的初步定位。

---

### Q2: "RAG 檢索時，如何避免檢索到無關的程式碼（Noisy Context）？"
- **Situation**: 程式碼庫可能包含數十個 Repo，隨意檢索會帶入大量冗餘資訊，干擾 LLM 判斷。
- **Task**: 提高檢索精度，確保 AI 只看到與 FAIL log 真正相關的實作。
- **Action**: 
    - 實作了 **白名單邊界規則 (Whitelist Boundary)**：檢索範圍被嚴格限制在與測試項目對應的專案路徑內。
    - **日誌專家指派 (Log Master)**：AI 會先判讀日誌中的測項名稱 (e.g. `BIOS_Update`)，再針對該模組進行關鍵字加權搜尋。
    - 紀錄 **RAG Metadata**：在最終報告中列出 `codebase_rag_files`，讓使用者看得到 AI 參考了哪些檔案，增加透明度。
- **Result**: 檢索準確度顯著提升，LLM 的幻覺 (Hallucination) 發生率降低，診斷結果的可信度與工程師的真實代碼實作高度掛鉤。

---

### Q3: "如何處理大規模測試日誌的 Token 限制？"
- **Situation**: `ResultDatabase.txt` 或完整的 debug log 太大，無法一次丟入 LLM。
- **Task**: 篩選出具備診斷意義的「關鍵日誌」。
- **Action**: 
    - 開發了 **日誌智慧裁減模組**：自動跳過 Robot Framework 重複性的「背景 Setup」與「Teardown」輸出，僅保留 FAIL 發生點前後的 200 行關鍵脈絡。
    - **多日誌併查**：若單一失敗涉及多個 log 檔案，AI 會平行指派專家各自摘要，最後再由 Aggregator 統一總結。
- **Result**: 即使面對重負載的測試日誌，分析引擎仍能穩定提取具備脈絡的技術結論，緩解了驗證團隊在 Log Parse 上的重複人力投入。
