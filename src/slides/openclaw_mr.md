# 面試備忘錄：自動化代碼衛士 (OpenClaw MR)

這張投影片的核心在於：**多維度品質矩陣 (Quality Matrix)——如何透過全方位的自動化審核，建立客觀且可視化的工程標準。**

---

### 1. 💬 口語說明 (Colloquial Explanation)

*   **🇺🇸 English (Simple & Direct):**
    "To move beyond simple syntax checks, I developed a **3-Phase Multi-Agent Review Matrix** for OpenClaw. The system orchestrates multiple specialized AI experts—evaluating Code Cleanliness, Logic, and Security in parallel. Using a **Blackboard Pattern**, critical findings from earlier experts are fed to later ones, preventing duplicate effort and aligning context. By leveraging **Repomix** for global context and performing **Multi-Inference Synthesis**, we generate a comprehensive 'Quality Radar' for every Merge Request, making the review process objective and data-driven."
    
*   **🇹🇼 中文 (口語精簡):**
    「為了超越簡單的語法檢查，我為 OpenClaw 開發了 **3階段多代理人 (Multi-Agent) 審核矩陣**。系統會協調多個專職 AI 專家——平行評估代碼整潔、邏輯與安全性。透過 **Blackboard (黑板) 設計模式**，早期專家發現的關鍵問題會餵給後續的專家，避免重複勞動並對齊上下文。搭配 **Repomix** 獲取全域上下文並進行 **多重推論合成**，我們為每個 Merge Request 生成一個『品質雷達圖』，使審核流程變得客觀且數據驅動。」

---

### 2. ❓ 模擬問答 (Possible Q&A - Google/Amazon Hybrid Strategy)

1.  **問：「這 7 個維度的分數是如何定義的？AI 是如何精確評分的？」(Technical Rigor)**
    *   **🇺🇸 English**: "Each dimension is managed by a specialized AI expert prompt with its own set of rules derived from our **LLM Wiki**. We don't just ask for a 'score'; we ask the AI to identify specific 'Violations' or 'Strengths.' The final score is a weighted aggregation based on the severity of the findings. This ensures the radar chart is backed by concrete evidence, which is visible in the dashboard."
    *   **🇹🇼 中文**: 「每個維度都由專屬的 AI 專家指令 (Prompt) 管理，並有一套源自我們 **LLM Wiki** 的規則。我們不只是要求一個『分數』，我們要求 AI 識別特定的『違規』或『優點』。最終分數是根據發現問題的嚴重程度進行權重聚合。這確保了雷達圖是由具體證據支持的，這些證據在儀表板中都是可見的。」

2.  **問：「這種多維度分析對開發團隊最大的價值是什麼？」(Impact / DX)**
    *   **🇺🇸 English**: "It provides **Immediate Objectivity**. In traditional reviews, discussions often get stuck on subjective style choices. With the 'Quality Radar,' the conversation shifts to specific technical gaps like 'Testability' or 'Security.' It helps junior developers see where they need to grow and helps senior reviewers focus on the most critical architectural risks."
    *   **🇹🇼 中文**: 「它提供了 **即時的客觀性**。在傳統審核中，討論常卡在主觀的風格選擇上。有了『品質雷達圖』，對話轉向了具體的技術缺口，如『可測試性』或『安全性』。它幫助初級開發者看到成長方向，並幫助資深審核員專注於最關鍵的架構風險。」

3.  **問：「你是如何處理 LLM 幻覺或是 JSON 輸出失敗等不穩定狀況的？」(Fault Tolerance / Defensive Programming)**
    *   **🇺🇸 English**: "I implemented strict defensive programming. Every LLM call is wrapped with a timeout, and if an expert fails to output valid JSON, it falls back to a custom `jsonrepair` and regex pipeline. If it still fails, the Aggregator phase gracefully handles the missing data rather than crashing the entire pipeline."
    *   **🇹🇼 中文**: 「我實作了嚴格的防禦性程式設計。每個 LLM 呼叫都包裝了 Timeout 處理，如果專家無法輸出有效的 JSON，會觸發自訂的 `jsonrepair` 與正則修復管線。如果仍失敗，聚合階段 (Aggregator) 會優雅地處理缺失資料，而不是讓整條管線崩潰。」

---

### 3. 📚 技術名詞解析 (Technical Glossary)

*   **🇺🇸 Blackboard Pattern / 🇹🇼 黑板設計模式**:
    An architectural pattern where multiple independent expert systems share knowledge via a common 'blackboard' to collaboratively solve a problem. (一種架構模式，多個獨立的專家系統透過一個共用的『黑板』分享知識，藉此協作解決問題。)
*   **🇺🇸 Quality Radar (Radar Chart) / 🇹🇼 品質雷達圖**:
    A graphical method of displaying multivariate data in the form of a two-dimensional chart of three or more quantitative variables. (一種以二維圖表形式顯示多變量數據的圖形方法，包含三個或更多定量變量。)
*   **🇺🇸 Context-Rich Review / 🇹🇼 富上下文審核**:
    A review process that incorporates extensive background information (repository structure, internal wikis) to provide more accurate and relevant feedback. (整合了大量背景資訊（代碼庫結構、內部 Wiki）的審核流程，以提供更準確且相關的回饋。)
