# 04. Learning & Curiosity | 學習熱情 (Variant 2)
## Project: OpenClaw (Learning MLOps & LLM Evaluation)

### 🎭 STAR Story (English)

*   **Situation**: 
    When building OpenClaw, I realized that "traditional unit testing" wasn't enough to validate AI outputs. I knew how to code the orchestrator, but I didn't know how to objectively measure the "Quality" of the AI's code reviews.
*   **Task**: 
    Master the emerging field of **MLOps and LLM Evaluation** to ensure OpenClaw's reviews were actually useful.
*   **Action**: 
    I spent weeks researching benchmarks and evaluation frameworks like **G-Eval** and **RAGAS**. I taught myself how to build a **"Golden Dataset"**—a collection of code samples with known human-verified flaws. I implemented an automated "Evaluation Pipeline" that compares the AI's findings against this dataset, calculating metrics like Precision and Recall for code reviews. I had to learn how to use an "LLM-as-a-judge" pattern while also building statistical safety nets to prevent bias.
*   **Result**: 
    Created a data-driven feedback loop that allowed us to tune our prompts and models with **95% confidence**, moving away from "vibes-based" AI development.
*   **Learning**: 
    In the AI era, curiosity must extend into the "Evaluation" of the magic. Learning how to objectively measure what seems subjective (like code quality) is the key to building trust in AI systems.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    在開發 OpenClaw 時，我意識到「傳統單元測試」不足以驗證 AI 的輸出。我知道如何編寫編排器，但不知道如何客觀地衡量 AI 代碼審核的「品質」。
*   **任務 (Task)**: 
    掌握新興的 **MLOps 與 LLM 評估 (Evaluation)** 領域，以確保 OpenClaw 的審核結果真正有用。
*   **行動 (Action)**: 
    我主動研究了 **上下文工程 (Context Engineering)** 與 **推論可靠性**。我自學了如何使用 **Repomix** 將整個代碼庫打包，並整合內部 **LLM Wiki** 作為 AI 的知識底座。為了消除 AI 的隨機性與幻覺，我實作了 **「多重推論合成」** 策略：針對每個審核請求，系統會多次發問並聚合答案。我分別從 Wiki 和代碼庫檢索數據，並在最後階段進行交叉驗證，確保回饋的精確度。
*   **結果 (Result)**: 
    建立了一套極其穩定的 AI 審核機制，大幅減少了誤報。我們能以極高的信心水平進行自動化審核，這套「富上下文」的架構後來成為了公司內所有 AI 應用的開發範本。
*   **反思 (Learning)**: 
    真正的學習熱情在於 **「追求極致的準確」**。透過掌握上下文打包與多重驗證技術，我證明了只要有正確的數據底座與推論策略，AI 就能從「實驗工具」轉化為「生產級的工程門禁」。
