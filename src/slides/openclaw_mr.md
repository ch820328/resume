# 面試備忘錄：OpenClaw AI Merge Request Review

這張投影片的核心在於：**如何從一個天真的 LLM 玩具，進化成一個解決真實工程痛點 (失真、維度單一、不穩定) 的 Multi-Agent 架構。**

---

### 1. 💬 口語說明 (Colloquial Explanation)

*   **🇺🇸 English (Simple & Direct):**
    "To move beyond simple syntax checks, I developed a **3-Phase Multi-Agent Review Matrix** for OpenClaw. The system orchestrates multiple specialized AI experts—evaluating Code Cleanliness, Logic, and Security in parallel. Using a **Blackboard Pattern**, critical findings from earlier experts are fed to later ones, preventing duplicate effort and aligning context. By leveraging **Repomix** for global context and performing **Multi-Inference Synthesis**, we generate a comprehensive 'Quality Radar' for every Merge Request, making the review process objective and data-driven."
    
*   **🇹🇼 中文 (口語精簡):**
    「為了超越簡單的語法檢查，我為 OpenClaw 開發了 **3階段多代理人 (Multi-Agent) 審核矩陣**。系統會協調多個專職 AI 專家——平行評估代碼整潔、邏輯與安全性。透過 **Blackboard (黑板) 設計模式**，早期專家發現的關鍵問題會餵給後續的專家，避免重複勞動並對齊上下文。搭配 **Repomix** 獲取全域上下文並進行 **多重推論合成**，我們為每個 Merge Request 生成一個『品質雷達圖』，使審核流程變得客觀且數據驅動。」

---

### 2. ❓ 模擬問答 (Possible Q&A - Google L4/Senior)

1.  **問：「你提到早期的做法每次 Retry 結果都不同。你的 Multi-Agent 架構是如何解決這種非決定性 (Non-determinism) 的？」(System Determinism)**
    *   **🇺🇸 English**: "LLMs are inherently probabilistic. To build determinism, I decoupled the tasks. First, I narrowed the scope of each specialized agent to evaluate only a single dimension based on strict rubrics from our **LLM Wiki**. Second, I introduced the Blackboard Pattern where an 'Aggregator Agent' synthesizes the isolated findings. By reducing the cognitive load on each LLM call and feeding them full repository context via Repomix, the variance dropped significantly, resulting in stable, reproducible feedback."
    *   **🇹🇼 中文**: 「LLM 本質上是機率性的。為了建立穩定性，我把任務拆解。首先，我縮小了每個專職 Agent 的工作範圍，讓他們嚴格依照 LLM Wiki 的量表只做單一維度的評分。其次，我導入了黑板模式，由『聚合者 Agent』來統整各方結果。透過降低每次 API call 的認知負擔，並透過 Repomix 餵給它完整的專案上下文，我們大幅降低了隨機性，產出穩定且可重現的反饋。」

2.  **問：「為什麼需要 Repomix 預處理知識庫？只用原本的 Git Context 不夠嗎？」(Context Management)**
    *   **🇺🇸 English**: "Git context usually provides just a few lines above and below the change. For architectural reviews, an agent needs to know if a modified function breaks a global interface defined in another file. Repomix allowed us to pack the essential repository structure, dependencies, and internal architectural guidelines into the prompt's context window, essentially giving the agent **'global vision'** rather than 'tunnel vision'."
    *   **🇹🇼 中文**: 「Git Context 通常只提供修改處上下幾行。對於架構級別的審查，Agent 需要知道這個修改是否破壞了另一個檔案定義的全域介面。Repomix 讓我們能把核心的專案結構、相依性以及內部的架構規範打包進 Context Window 裡。這等於是賦予了 Agent『上帝視角』，而不是原本管中窺豹的『隧道視野』。」

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
