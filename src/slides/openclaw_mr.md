# 面試備忘錄：自動化代碼衛士與 GitLab 插件架構 (OpenClaw MR)

這張投影片的核心在於：**將 AI 轉化為確定性的「工程門禁」，透過 Agentic Workflow 解決大規模專案中的代碼審核瓶頸。**

---

### 1. 💬 口語說明 (Colloquial Explanation)

*   **🇺🇸 English (Simple & Direct):**
    "Reviewing code manually is slow and subjective. I built 'OpenClaw MR'—an AI-powered code reviewer that acts as a quality gate for GitLab. Instead of just one AI prompt, I created a 'Multi-Agent' system where different agents specialize in security, logic, and style. I used **BullMQ and Redis** to handle the heavy workload in the background, making sure the review happens reliably without slowing down the developers' workflow."
    
*   **🇹🇼 中文 (口語精簡):**
    「人工審核代碼既慢又主觀。我開發了『OpenClaw MR』，這是一個為 GitLab 設計的 AI 代碼審核工具，充當品質門禁。我不只是丟一個 Prompt，而是建立了一個『多智能體 (Multi-Agent)』系統，讓不同的 Agent 分別專攻安全、邏輯和風格。我利用 **BullMQ 與 Redis** 在背景處理繁重的工作，確保審核能穩定執行，且不會拖慢開發者的工作流程。」

---

### 2. ❓ 模擬問答 (Possible Q&A - Google/Amazon Hybrid Strategy)

1.  **問：「為什麼要用多個專屬 Agent，而不是用一個強大的 LLM 就好？」(Invent and Simplify / Dive Deep)**
    *   **🇺🇸 English**: "Even the strongest LLMs suffer from 'attention dilution' when given a generic prompt. By using specialized agents—one for security, one for logic—we can provide much tighter system prompts. This reduces hallucinations and results in higher-quality, actionable feedback. It’s about 'Diving Deep' into specific code aspects rather than being surface-level."
    *   **🇹🇼 中文**: 「即使是最強的模型，在面對通用 Prompt 時也會有『注意力分散』的問題。透過使用專業 Agent——一個專攻安全，一個專攻邏輯——我們可以提供更精確的系統指令。這減少了幻覺，並產生高品質、具備指導意義的回饋。這就是針對特定代碼維度進行『深挖 (Dive Deep)』，而不是只做表面檢查。」

2.  **問：「當初為了確保審核任務不遺失而引入 BullMQ 時，你的考量是什麼？」(Inner Monologue)**
    *   **🇺🇸 English**: "I realized that code review is a mission-critical stage. If our review service crashed and lost a pending task, a buggy commit might sneak into production. I felt a sense of responsibility to build a **Resilient Queue**. I chose BullMQ with Redis persistence because I wanted to guarantee 'Exactly-Once' processing, even if our servers restarted."
    *   **🇹🇼 中文**: 「我意識到代碼審核是任務關鍵階段。如果審核服務當機並遺失了待處理任務，有 Bug 的提交可能會溜進生產環境。我覺得我有責任建立一個**具備韌性的隊列**。我選擇具備 Redis 持久化的 BullMQ，是因為我想要保證『精確一次 (Exactly-Once)』的處理，即便伺服器重啟也不例外。」

3.  **問：「如何防止 AI 產生的 False Positive (誤報) 損害開發者的信任？」(Earn Trust / High Standards)**
    *   **🇺🇸 English**: "Trust is hard to earn and easy to lose. I implemented a **Feedback Loop** where engineers can upvote or downvote AI comments. We treat 'downvotes' as data to fine-tune our agentic prompts. This ensures the tool evolves based on real engineering standards, rather than just being a noisy bot."
    *   **🇹🇼 中文**: 「信任很難建立但很容易毀掉。我實作了**回饋機制 (Feedback Loop)**，讓工程師可以對 AI 評論進行點讚或倒讚。我們將『倒讚』視為數據，用來微調 Agent 的指令。這確保了工具是根據真實的工程標準進化的，而不僅僅是一個吵鬧的機器人。」

4.  **問：「如果一個 MR 變動非常大，你的 Token 成本如何控管？」(Dive Deep / Performance Awareness)**
    *   **🇺🇸 English**: "Analyzing huge diffs is expensive and often inaccurate. I implemented **Selective Analysis**. The system filters out non-logic changes like comments or formatting. We also have a 'circuit breaker' that triggers a high-level summary mode for massive MRs, focusing only on the critical architectural blocks to balance cost and efficacy."
    *   **🇹🇼 中文**: 「分析巨大的 Diff 既貴又不準確。我實作了**選擇性分析 (Selective Analysis)**。系統會過濾掉非邏輯變動，如註解或排版。我們還設有『熔斷機制』，對於超大型 MR 會切換到高階摘要模式，只關注關鍵架構區塊，以平衡成本與效益。」

5.  **問：「這種自動化審核技術，在 Google 的大規模代碼庫中如何應用？」(Future Pacing)**
    *   **🇺🇸 English**: "Google has its own sophisticated review tools. This project taught me the importance of 'Agentic Specialization.' I will bring this mindset to Google to help build smarter automation that understands project-specific context, reducing the burden on our senior reviewers while maintaining the highest quality standards."
    *   **🇹🇼 中文**: 「Google 有自己精密的審核工具。這個專案教會我『智能體專業化』的重要性。我會將這種思維帶到 Google，幫助建立更聰明的自動化工具，使其能理解特定專案的背景，在維持最高品質標準的同時，減輕資深審核員的負擔。」

6.  **問：「你如何處理跨檔案的邏輯審核？」(Dive Deep / Ownership)**
    *   **🇺🇸 English**: "That's a classic LLM limitation. I used **Context Pre-packaging** with tools like Repomix. Before starting the review, the system retrieves relevant header files and interface definitions to provide the AI with a 'Global View.' I took ownership of the context construction to ensure the AI doesn't give suggestions in a vacuum."
    *   **🇹🇼 中文**: 「這是大模型的經典限制。我利用 Repomix 等工具進行**上下文預打包**。在開始審核前，系統會檢索相關的標頭檔與介面定義，提供 AI 一個『全景視野』。我對上下文的構建全權負責，確保 AI 不會在資訊真空的情況下給出建議。」

---

### 3. 📚 技術名詞解析 (Technical Glossary)

*   **🇺🇸 Multi-Agent System / 🇹🇼 多智能體系統**:
    A system composed of multiple interacting intelligent agents, each specializing in a specific task. (由多個互相協作的智能體組成的系統，每個智能體專攻特定任務。)
*   **🇺🇸 BullMQ / 🇹🇼 Bull 訊息隊列**:
    A message queue for Node.js based on Redis, used for handling background jobs with high reliability. (基於 Redis 的 Node.js 訊息隊列，用於高可靠地處理背景任務。)
*   **🇺🇸 Redis Distributed Lock / 🇹🇼 Redis 分散式鎖**:
    A mechanism used to ensure that a task is only processed once across multiple server instances. (一種確保任務在多個伺服器實例中只被處理一次的機制。)
*   **🇺🇸 Deterministic Quality Gate / 🇹🇼 確定性品質門禁**:
    A stage in the development process that uses predefined rules to decide whether code can proceed. (開發流程中的一個階段，使用預定義規則來決定代碼是否可以繼續。)
*   **🇺🇸 Hallucination / 🇹🇼 幻覺**:
    A phenomenon where an AI model generates plausible-sounding but incorrect or nonsensical information. (AI 模型產生看似合理但錯誤或無意義資訊的現象。)
