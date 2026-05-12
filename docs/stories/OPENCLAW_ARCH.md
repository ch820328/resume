# BQ Story: Architecting a Multi-Agent AI Review Matrix (Innovation / Complexity)

這個故事展現了您處理複雜分布式系統與 AI 整合的能力。

---

## 🎭 STAR Story (English)

*   **Situation / Task**: 
    Our engineering team faced a bottleneck in code reviews. Manual reviews were slow and often missed subtle logic or security issues due to the high volume of MRs. I was tasked with building an AI-driven review system that could provide high-fidelity, multi-dimensional feedback automatically.
*   **Action**:
    *   **Inner Monologue**: *"A simple LLM prompt wasn't enough; it would either hallucinate or lose focus on large diffs. I needed a 'divide and conquer' strategy—an orchestration layer that functions like a senior lead, assigning tasks to specialist agents."*
    *   **The Matrix Design**: I architected a **3-Phase Matrix Pipeline**. Phase 1 uses a Master Orchestrator to analyze complexity and plan the review. Phase 2 runs parallel specialists (Logic, Security, Style). Phase 3 aggregates findings into a structured report.
    *   **Collaborative Intelligence**: I implemented a **Blackboard Pattern**, allowing experts to share critical findings asynchronously. This ensured that the Security expert was aware of the Logic expert's discovery of a new data flow.
    *   **Resilience Engineering**: Built a robust context-management system with intelligent truncation and a custom **JSON repair pipeline** to handle non-deterministic LLM behaviors.
*   **Result**:
    *   Achieved **100% automated coverage** for all incoming MRs.
    *   Detected **20% more critical bugs** (logic flaws and security gaps) compared to previous single-prompt attempts.
    *   Reduced human review time by **40%** by filtering out hygiene issues and highlighting high-risk areas.
*   **Learning (Future Pacing)**: 
    *"Building OpenClaw taught me that the future of software engineering lies in Multi-Agent collaboration. At Google, I will leverage these orchestration patterns to build intelligent developer tools that scale beyond human cognitive limits."*

---

## 🎭 STAR Story (中文)

*   **S/T (情境/任務)**: 
    我們的工程團隊在代碼審核上遇到了瓶頸。人工審核速度慢，且由於 MR 數量龐大，審核者常因趕進度而遺漏細微的邏輯或安全問題。我的任務是建立一套 AI 驅動的審核系統，能自動提供高準確度、多維度的回饋。
*   **Action (行動)**:
    *   **內心獨白**: 「單一的 LLM Prompt 是不夠的；面對大型 Diff，它不是產生幻覺就是失去焦點。我需要一個『分而治之』的策略——一個像資深組長一樣的編排層 (Orchestration)，將任務分發給各領域的專家 Agent。」
    *   **矩陣設計**: 我架構了一套 **三階段矩陣流水線**。第一階段由 Master Orchestrator 分析複雜度並規劃審核方案；第二階段並行執行專家矩陣（邏輯、安全、風格）；第三階段將所有發現聚合為結構化報告。
    *   **協同智能**: 我實作了 **黑板模式 (Blackboard Pattern)**，允許專家們非同步地分享關鍵發現。這確保了安全專家能得知邏輯專家發現的新數據流，從而進行更深層的滲透分析。
    *   **穩定性工程**: 建立了強大的上下文管理系統與智能裁切算法，並開發了自定義的 **JSON 修復流水線**，以處理 LLM 的不確定性輸出。
*   **Result (結果)**:
    *   為所有 MR 實現了 **100% 自動化覆蓋**。
    *   相較於之前的單一 Prompt 嘗試，**關鍵 Bug 的檢出率提升了 20%**。
    *   透過自動過濾衛生問題並標註高風險區域，將 **人工審核時間縮短了 40%**。
*   **Learning (未來投射)**: 
    「構建 OpenClaw 的經驗教會我，軟體工程的未來在於多智能體 (Multi-Agent) 的協作。在 Google，我將利用這些編排模式來構建超越人類認知極限的智能開發者工具。」
