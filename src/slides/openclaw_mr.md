# 面試備忘錄：OpenClaw AI Merge Request Review

這張投影片的核心在於：**如何從一個天真的 LLM 玩具，進化成一個解決真實工程痛點 (失真、維度單一、不穩定) 的 Multi-Agent 架構。**

---

### 1. 💬 口語說明 (Colloquial Explanation)

*   **🇺🇸 English (System Design Narrative):**
    "Initially, everyone thought we could just feed a code diff to an LLM for code review. But we quickly hit a wall. Naive LLMs suffered from severe context loss because they only saw the **isolated diffs**, leading to high hallucination rates. Furthermore, a single prompt produced inconsistent and single-dimensional feedback—every retry gave a different result. To fix this, I architected a **Multi-Agent Pipeline**. Instead of one generic prompt, we have specialized agents looking at different dimensions like security, logic, and architecture. To solve the context issue, I integrated a **Repository Knowledge Base** via Repomix to inject the full codebase context before the review. This transformed our tool from a flaky toy into a deterministic quality gate, cutting review cycle time by 40%."
    
*   **🇹🇼 中文 (講故事版本):**
    「一開始大家都以為把 Code Diff 丟給 LLM 就能做 Code Review。但我們很快就撞牆了。初步的做法面臨嚴重的『上下文遺失』，因為 LLM 只看得到孤立的 diff，導致滿滿的幻覺 (Hallucination)。而且單一 Prompt 產出的反饋維度單一、每次 Retry 結果都不一樣，缺乏穩定性。為了解決這個問題，我設計了 **Multi-Agent 流水線**。我們不再依賴單一大神，而是讓不同領域的專職 Agent 進行多維度分析。為了解決上下文問題，我透過 Repomix 導入了『全專案知識庫』，在分析前就注入完整的架構脈絡。這成功把一個不穩定的玩具，變成了一道 100% 自動化的架構品質閘門，讓我們的 Review 週期縮短了 40%。」

---

### 2. ❓ 模擬問答 (Possible Q&A - Google L4/Senior)

1.  **問：「你提到早期的做法每次 Retry 結果都不同。你的 Multi-Agent 架構是如何解決這種非決定性 (Non-determinism) 的？」(System Determinism)**
    *   **🇺🇸 English**: "LLMs are inherently probabilistic. To build determinism, I decoupled the tasks. First, I narrowed the scope of each specialized agent to evaluate only a single dimension based on strict rubrics from our **LLM Wiki**. Second, I introduced the Blackboard Pattern where an 'Aggregator Agent' synthesizes the isolated findings. By reducing the cognitive load on each LLM call and feeding them full repository context via Repomix, the variance dropped significantly, resulting in stable, reproducible feedback."
    *   **🇹🇼 中文**: 「LLM 本質上是機率性的。為了建立穩定性，我把任務拆解。首先，我縮小了每個專職 Agent 的工作範圍，讓他們嚴格依照 LLM Wiki 的量表只做單一維度的評分。其次，我導入了黑板模式，由『聚合者 Agent』來統整各方結果。透過降低每次 API call 的認知負擔，並透過 Repomix 餵給它完整的專案上下文，我們大幅降低了隨機性，產出穩定且可重現的反饋。」

2.  **問：「為什麼需要 Repomix 預處理知識庫？只用原本的 Git Context 不夠嗎？」(Context Management)**
    *   **🇺🇸 English**: "Git context usually provides just a few lines above and below the change. For architectural reviews, an agent needs to know if a modified function breaks a global interface defined in another file. Repomix allowed us to pack the essential repository structure, dependencies, and internal architectural guidelines into the prompt's context window, essentially giving the agent **'global vision'** rather than 'tunnel vision'."
    *   **🇹🇼 中文**: 「Git Context 通常只提供修改處上下幾行。對於架構級別的審查，Agent 需要知道這個修改是否破壞了另一個檔案定義的全域介面。Repomix 讓我們能把核心的專案結構、相依性以及內部的架構規範打包進 Context Window 裡。這等於是賦予了 Agent『上帝視角』，而不是原本管中窺豹的『隧道視野』。」

---

### 3. 📚 關鍵字亮點 (Keyword Highlights for Resume/Interview)
*   **Naive vs. Agentic Workflow**: 展示您懂單一 Prompt 與多代理人協作的架構層次差異。
*   **Isolated Diffs**: 點出痛點，展現深入實作才有的 Insight。
*   **Context Window Management**: 證明您具備駕馭大型語言模型上下文限制的實戰工程經驗。
