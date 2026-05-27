# 面試備忘錄：OpenClaw Semantic Log Diagnostics

這張投影片的核心在於：**展示如何用「向量檢索 (Vector Search) + 原始碼索引 (Codebase Indexing)」解決龐大且無結構的韌體測試日誌所帶來的「資訊超載」與「跨部門溝通成本 (Escalations)」。**

---

### 1. 💬 口語說明 (Colloquial Explanation)

*   **🇺🇸 English (System Design Narrative):**
    "In firmware validation, engineers were wasting hours doing manual triage on massive, unstructured test logs. Traditional `grep` keyword searches failed miserably because they missed the semantic context across disparate subsystems. To solve this, I engineered a **Semantic Log Matrix** using LLMs and pgvector. The key innovation wasn't just throwing logs at an LLM; I actually indexed our entire codebase so the system could correlate log errors directly with internal implementation logic. This turned MBs of raw data into actionable root causes automatically, empowering QA testers with a self-service diagnostic tool and drastically reducing escalations to the engineering team."
    
*   **🇹🇼 中文 (講故事版本):**
    「在韌體驗證中，工程師往往要花費數小時手動排查龐大且毫無結構的測試日誌。傳統的 `grep` 關鍵字搜尋根本行不通，因為它無法捕捉跨越多個子系統的真實語意脈絡。為了解決這問題，我利用 LLM 和 pgvector 打造了『語意日誌矩陣』。這個系統最核心的創新不只是把 Log 丟給 AI，而是我**將整個原始碼庫建立了索引 (Indexed the codebase)**。這讓系統能夠將報錯的 Log，直接與底層實作邏輯進行高保真關聯。這項設計把數 MB 的原始雜訊，自動轉換成了具體可執行的 Root-Cause，讓 QA 測試員能自助診斷問題，大幅減少了把工單往上呈報 (Escalate) 給開發團隊的次數。」

---

### 2. ❓ 模擬問答 (Possible Q&A - Google L4/Senior)

1.  **問：「你提到『Indexed the codebase』，具體是怎麼關聯 Log 跟 Code 的？」(Technical Implementation / RAG)**
    *   **🇺🇸 English**: "Logs only tell you *what* failed, not *why*. By embedding our firmware source code and architectural documentation into pgvector, I created a two-stage RAG pipeline. First, we semantically group the failed log sequences. Second, we query the vector database to find the exact C/C++ function or Python script associated with that logic. The LLM then synthesizes both the log context and the source code snippet to generate the final diagnostic."
    *   **🇹🇼 中文**: 「Log 只告訴你『哪裡失敗』，而不是『為什麼』。透過將韌體原始碼與架構文件 embedding 到 pgvector 裡，我建立了一個兩階段的 RAG 管線。第一步，我們先將報錯的 Log 序列進行語意分群；第二步，我們去向量資料庫尋找與該邏輯關聯的 C/C++ 函數或 Python 腳本。最後由 LLM 結合 Log 上下文與原始碼片段，產出最終的診斷報告。」

2.  **問：「這種做法如何解決『False Positives (誤判)』或『AI 幻覺』？」(Earn Trust / Quality Assurance)**
    *   **🇺🇸 English**: "To minimize false positives, I implemented **Confidence Scoring**. The diagnostic report explicitly cites the source code file or previous Jira ticket it based its conclusion on. If the similarity score is below a strict threshold, the system flags it as 'Needs Human Review' rather than guessing. We also built a feedback loop where engineers can upvote/downvote the root-cause, actively refining the embeddings over time."
    *   **🇹🇼 中文**: 「為了最小化誤判，我實作了『置信度評分 (Confidence Scoring)』。診斷報告會明確標註它是根據哪個原始碼檔案或過去的 Jira 工單得出結論的。如果相似度低於嚴格的門檻，系統會標示為『需人工審查』而不是亂猜。我們也建立了回饋機制，讓工程師能對 Root-Cause 點讚或倒讚，持續優化未來的檢索品質。」

---

### 3. 📚 關鍵字亮點 (Keyword Highlights for Resume/Interview)
*   **Semantic Context vs. Grep**: 展現您對傳統除錯工具限制的深刻理解，並知道如何用 AI 降維打擊。
*   **Codebase Indexing**: 這是整個架構的靈魂，把「文字分析」提升到了「程式邏輯分析」的層次。
*   **Reduced Escalations**: 強調商業價值 (Business Impact)——不僅是技術自嗨，而是真實替工程團隊省下了寶貴的 Debug 時間。
