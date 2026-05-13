# 09. Complex Problem Solving | 解決複雜問題
## Project: OpenClaw (Three-Stage Multi-Perspective Pipeline)

### 🎭 STAR Story (English)

*   **Situation**: 
    Traditional code review processes and simple AI prompts struggled with our complex hardware-software integration projects. Reviews were either too superficial or plagued by LLM hallucinations because they lacked the necessary repository context and adherence to internal standards.
*   **Task**: 
    Develop a high-fidelity AI review engine capable of detecting deep logical flaws and architectural violations in large Merge Requests.
*   **Action**: 
    I solved this by architecting a **Three-Stage, Dual-Context Pipeline**. 
    1. **Stage 1 (Complexity Analysis)**: I implemented an initial pass that analyzes the MR's complexity to intelligently allocate compute resources. 
    2. **Stage 2 (Multi-Expert Review)**: I deployed multiple specialist agents (Logic, Security, Performance) to perform **Multi-Inference Synthesis**—querying the model multiple times and aggregating answers to ensure a consensus-based result, eliminating stochastic errors. 
    3. **Stage 3 (Report Synthesis)**: A final stage synthesizes all findings into a unified, high-quality report. 
    To ensure accuracy, I orchestrated the system to run this entire process **twice**: once using **LLM Wiki** for normative compliance and once using **Repomix** for structural repository context.
*   **Result**: 
    Reduced AI hallucinations by 30% and identified critical logic flaws that human reviewers missed, establishing a new gold standard for automated quality gating.
*   **Learning**: 
    Complex engineering problems are solved by **"Engineering the Process."** By breaking a probabilistic task into a structured, multi-perspective pipeline, you can achieve deterministic reliability even with stochastic models.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    傳統的代碼審核流程與簡單的 AI Prompt 在處理我們複雜的軟硬體整合專案時遇到了困難。審核結果要麼過於表面，要麼深受 LLM 幻覺之苦，因為它們缺乏必要的倉庫上下文，且無法嚴格遵循內部規範。
*   **任務 (Task)**: 
    開發一套高精準度的 AI 審核引擎，能夠在大型 Merge Request 中偵測深層邏輯缺陷與架構違規。
*   **行動 (Action)**: 
    我透過架構一套 **「三階段、雙上下文」流水線** 來解決這個問題。
    1. **第一階段（複雜度分析）**: 我實作了初始過濾，分析 MR 複雜度以智慧化分配運算資源。
    2. **第二階段（多專家審核）**: 我部署了多個專家 Agent（邏輯、安全、效能）執行 **「多重推論合成 (Multi-Inference Synthesis)」**——對模型發問多次並聚合答案以確保結果是基於共識的，從而消除隨機錯誤。
    3. **第三階段（報告聚合）**: 最後階段將所有發現整合成一份統一的高品質報告。
    為確保精準度，我編排系統將整個流程 **執行兩次**：一次以 **LLM Wiki** 確保規範合規性，一次以 **Repomix** 提供結構化的代碼庫上下文。
*   **結果 (Result)**: 
    將 AI 幻覺減少了 30%，並識別出了人工審核員漏掉的關鍵邏輯缺陷，建立了自動化品質門禁的新標準。
*   **反思 (Learning)**: 
    複雜的工程問題是透過 **「流程工程化 (Engineering the Process)」** 來解決的。透過將一個機率性的任務分解為結構化的多視角流水線，即使使用隨機模型也能達成確定性的可靠結果。
