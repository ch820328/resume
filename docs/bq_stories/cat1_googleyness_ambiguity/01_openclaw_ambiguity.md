# 01. Dealing with Ambiguity | 處理模糊
## Project: OpenClaw (AI Multi-Agent Matrix)

### 🎭 STAR Story (English)

*   **Situation**: 
    When we started the OpenClaw project, the concept of using "Multi-Agent AI" for code reviews was entirely new to the team. There were no established patterns, and we didn't know if an LLM could handle the complexity of our domain-specific manufacturing logic without hallucinating.
*   **Task**: 
    I was tasked with architecting a system that was reliable enough for production use despite the inherent non-determinism of AI.
*   **Action**: 
    *   **Strategic Pivot**: Pivoted from a single-call architecture to a **3-Phase Matrix Pipeline** with specialists running in parallel to solve the "Focus Drift" issue in large files.
    *   **Context Engineering**: Leveraged **RAG and Repomix** to distill code context, ensuring high relevance and maximizing the model's signal-to-noise ratio.
    *   **Resilience**: Implemented a type-safe **Validation-Repair-Retry** loop using JSON schemas and TypeScript to handle non-deterministic outputs.
*   **Result**: 
    *   Successfully identified **cross-file handshake errors** previously missed by humans.
    *   Achieved **100% coverage** and a **40% reduction** in review time.
*   **Learning**: 
    In ambiguous environments, prioritize "Content Distillation" and "Type-Safe Pipelines" to turn non-deterministic models into reliable tools.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    啟動 OpenClaw 時，團隊對「多智能體 AI」審核完全陌生。面對 LLM 的幻覺風險與特定領域邏輯的複雜性，沒有既有模式可循。
*   **任務 (Task)**: 
    在 AI 具有不確定性的情況下，架構一套穩定到能用於生產環境的系統。
*   **行動 (Action)**: 
    *   **架構轉向**：從單次調用轉向 **「三階段矩陣流水線」**，讓不同維度的專家（邏輯、安全等）並行執行以解決焦點偏移問題。
    *   **上下文優化**：利用 **RAG 與 Repomix** 精煉代碼上下文，確保模型焦點鎖定在最高相關性的代碼片段。
    *   **強韌性設計**：建立基於 **JSON Schema 與 TypeScript 類型**的「驗證-修復-重試」迴圈，確保輸出具備確定性。
*   **結果 (Result)**: 
    *   成功抓出人工審核易遺漏的 **「跨檔案交握 (Handshake) 錯誤」**。
    *   達成 **100% 覆蓋率** 並縮短 **40%** 的審核時間。
*   **反思 (Learning)**: 
    在模糊環境中，優先考慮「內容精煉」與「類型安全管線」，才能將非確定性模型轉化為可靠的工程工具。

---

### ❓ 模擬問答 (Possible Q&A)

1.  **問：「為什麼要將 Agent 並行化？這不會增加聚合時的衝突嗎？」**
    *   **🇺🇸 English**: "I parallelized the agents (Logic, Security, Testability) to maximize the **Signal-to-Noise Ratio (SNR)**. A single agent trying to review everything often suffers from 'Focus Drift.' By isolating dimensions, each specialist stays within its cognitive domain. I resolved the aggregation conflict in Phase 3 by using a 'Consensus Orchestrator' that resolves overlapping findings."
    *   **🇹🇼 中文**: 「我將 Agent（邏輯、安全、測試性）並行化是為了最大化 **訊噪比 (SNR)**。一個試圖審核所有內容的 Agent 往往會產生『焦點偏移』。透過維度隔離，每個專家都能專注於其認知領域。至於衝突，我在第三階段使用『共識編排器 (Consensus Orchestrator)』來解決重複或重疊的發現。」

2.  **問：「既然有了大 Context Window，為什麼還要花功夫做 RAG 和內容精煉？」**
    *   **🇺🇸 English**: "Having a big window is like having a big library; it doesn't mean you can read every book at once without getting confused. LLMs still suffer from 'Lost in the Middle' phenomena. I used **RAG and Repomix** to provide only the 'high-value' dependencies, ensuring the model's attention is 100% on the diff and its direct impact."
    *   **🇹🇼 中文**: 「擁有大視窗就像擁有一個大圖書館，並不代表你能同時讀完所有書而不產生混淆。LLM 仍會遇到『中段遺忘 (Lost in the Middle)』的現象。我使用 **RAG 與 Repomix** 僅提供『高價值』的依賴關係，確保模型的注意力 100% 鎖定在代碼變動及其直接影響上。」

3.  **問：「如果 JSON 修復流水線在重試後仍然失敗，你的系統會如何處理？」**
    *   **🇺🇸 English**: "Reliability is key. If the **Validation-Repair-Retry** loop fails, the system triggers a 'Safe-Fallback.' It logs the raw output for human audit but flags the review as 'Unverified' to the developer. We prioritize **'No output' over 'Wrong output'** to maintain developer trust in the tool."
    *   **🇹🇼 中文**: 「可靠性是關鍵。如果 **驗證-修復-重試** 迴圈失敗，系統會觸發『安全回退』。它會記錄原始輸出供人工審計，但會將該次審核標記為『未驗證』。我們優先選擇『不輸出』而非『錯誤輸出』，以維持開發者對工具的信任。」

4.  **問：「你提到抓出了『跨檔案交握 (Handshake) 錯誤』，能舉個具體例子嗎？」**
    *   **🇺🇸 English**: "Sure. We had a case where an engineer updated a function signature in a library file but forgot to update one obscure consumer in a different package. Because I used **Repomix** to feed the relationship graph to the 'Logic Specialist,' the AI caught the mismatch that human reviewers missed because they only looked at the files in the Git diff."
    *   **🇹🇼 中文**: 「當然。我們曾遇到一個案例，工程師更新了庫文件中的函數簽名，但忘記更新另一個包中某個隱蔽的調用者。因為我使用 **Repomix** 將關係圖提供給『邏輯專家』，AI 捕捉到了這個人工審核遺漏的錯誤，因為人類通常只查看 Git Diff 中顯示的文件。」
