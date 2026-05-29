# 面試備忘錄：OpenClaw Semantic Log Diagnostics

這張投影片的核心在於：**展示如何用「向量檢索 (Vector Search) + 原始碼索引 (Codebase Indexing)」解決龐大且無結構的韌體測試日誌所帶來的「資訊超載」與「跨部門溝通成本 (Escalations)」。**

---

### 1. 💬 口語說明 (Colloquial Explanation)

*   **🇺🇸 English (Simple & Direct):**
    "Finding a root cause in 50,000 lines of hardware logs is a nightmare. I built 'OpenClaw Log' to automate this. I implemented a **Staged Expert Pipeline** where a Root-Cause expert analyzes the log, and its output is fed into an Action expert, preventing contradicting advice. Coupled with **Codebase RAG**, the AI dynamically looks up repository context before diagnosing. Now, the system automatically analyzes **20+ machine test reports daily**, significantly reducing the 'detect-to-verify' cycle."
    
*   **🇹🇼 中文 (口語精簡):**
    「在幾萬行硬體日誌裡找 Bug 是研發的噩夢。我開發了『OpenClaw Log』來自動化這個過程。我實作了 **分段式專家管線 (Staged Expert Pipeline)**，讓『根本原因』專家的分析結果能餵給『行動建議』專家，避免前後矛盾。結合 **Codebase RAG**，AI 在診斷前會動態查找程式碼庫的上下文。現在系統每天會自動分析 **20 多份機器測試報告**，大大縮短了從發現問題到確認原因的週期。」

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
