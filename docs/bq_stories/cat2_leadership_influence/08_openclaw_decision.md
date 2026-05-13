# 08. Decision Making | 決策能力
## Project: OpenClaw (Three-Stage Multi-Perspective Pipeline)

### 🎭 STAR Story (English)

*   **Situation**: 
    During the architecture of OpenClaw, I had to decide how to process code reviews for maximum accuracy. A simple "Prompt + Code" approach was insufficient for our complex hardware-software integration code, as it lacked both structural context and normative standards.
*   **Task**: 
    Design a decision-making framework that ensures no architectural blind spots and high reliability in AI feedback.
*   **Action**: 
    I decided to implement a **Three-Stage, Dual-Context Pipeline** instead of a single-shot prompt. 
    1. **Stage 1 (Complexity Analysis)**: The AI first assesses the MR's complexity to determine the depth of review needed. 
    2. **Stage 2 (Multi-Expert Synthesis)**: Multiple specialized agents perform multi-inference reviews to eliminate stochastic errors. 
    3. **Stage 3 (Report Aggregation)**: A final agent synthesizes all findings into a structured report. 
    Crucially, I decided to run this entire process **twice**—once using **LLM Wiki** as the data source (for normative standards) and once using **Repomix** (for structural repository context). I chose this "Cross-Verification" model because it ensures that every piece of advice is validated against both our internal rules and the actual project structure.
*   **Result**: 
    This robust decision led to a 30% drop in hallucinations and identified complex architectural risks that single-stage models missed. It became the definitive standard for our AI review quality.
*   **Learning**: 
    Strategic technical decisions are about **"Architecting for Confidence."** By breaking a complex task into stages and using dual perspectives, you turn a probabilistic tool (LLM) into a deterministic engineering gate.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    在架構 OpenClaw 時，我必須決定如何處理代碼審核以達成最高準確度。簡單的「Prompt + Code」方法對於我們複雜的軟硬體整合代碼來說是不夠的，因為它既缺乏結構上下文，也缺乏規範標準。
*   **任務 (Task)**: 
    設計一個決策框架，確保 AI 回饋中沒有架構盲點且具備高可靠性。
*   **行動 (Action)**: 
    我決定實作一套 **「三階段、雙上下文」流水線**，而非單次發問。
    1. **第一階段（複雜度分析）**: AI 先評估 MR 的複雜度以確定審核深度。
    2. **第二階段（多專家合成）**: 多個專業 Agent 進行多重推論審核以消除隨機錯誤。
    3. **第三階段（報告聚合）**: 最後一個 Agent 將所有發現彙整為結構化報告。
    至關重要的是，我決定將整個流程 **執行兩次**——一次以 **LLM Wiki** 為數據源（確保符合規範標準），一次以 **Repomix** 為數據源（確保理解代碼庫結構）。我選擇這種「交叉驗證」模型，是因為它確保了每一條建議都同時經過了內部規則與實際專案結構的雙重驗證。
*   **結果 (Result)**: 
    這個強大的決策讓幻覺降低了 30%，並識別出了單階段模型會漏掉的複雜架構風險。它成為了我們 AI 審核品質的最終標準。
*   **反思 (Learning)**: 
    戰略技術決策在於 **「為信心而架構 (Architecting for Confidence)」**。透過將複雜任務分解為階段並使用雙重視角，你將一個機率性工具 (LLM) 轉化為一個確定性的工程門禁。
