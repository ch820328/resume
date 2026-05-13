# 14. Receiving Feedback | 接受回饋
## Project: PIC Transcript (Visual Recognition)

### 🎭 STAR Story (English)

*   **Situation**: 
    After launching the first version of PIC Transcript (my visual recognition engine), I received critical feedback from the factory floor engineers. They said the tool was "too fragile"—it worked perfectly in my lab but failed in the factory due to slight lighting changes and different monitor resolutions.
*   **Task**: 
    Instead of being defensive about my "100% accuracy" lab results, I had to accept the feedback and pivot my technical approach.
*   **Action**: 
    I spent a day on the production line to see the "real world" conditions. I realized my initial pixel-matching approach was a mistake. I took the feedback as a challenge to improve the system's **Robustness**. I refactored the engine to use **Normalized Cross-Correlation (TM_CCOEFF_NORMED)**, which is resistant to lighting shifts. I also implemented a **Fuzzy Matching Post-Processor** to handle OCR errors based on engineering whitelists.
*   **Result**: 
    The new version achieved **99%+ accuracy** in actual factory conditions, even with varying brightness. The engineers who initially complained became the tool's biggest advocates.
*   **Learning**: 
    Negative feedback is a "gift" that reveals your system's blind spots. A professional response is to listen, observe the failure in person, and use the data to build a more resilient solution.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    在發佈第一版 PIC Transcript（我的視覺辨識引擎）後，我收到了來自工廠現場工程師的嚴厲反饋。他們說這個工具太「脆弱」了——在我的實驗室運行完美，但在工廠裡卻因為微小的光影變化和顯示器解析度不同而失效。
*   **任務 (Task)**: 
    我沒有對自己在實驗室的「100% 準確率」數據採取防衛態度，而是接受了反饋並調整了技術方案。
*   **行動 (Action)**: 
    我在生產線上待了一整天，觀察「真實世界」的情況。我意識到我最初的像素比對方法是一個錯誤。我將反饋視為提升系統 **「強韌性 (Robustness)」** 的挑戰。我將引擎重構為使用 **歸一化互相關 (TM_CCOEFF_NORMED)** 技術，這種技術能抵抗光影變化。我還實作了一個 **模糊匹配後處理器**，根據工程白名單來修正 OCR 錯誤。
*   **結果 (Result)**: 
    新版本在實際工廠環境（即使亮度不一）中達到了 **99% 以上的準確率**。最初抱怨的工程師成了這個工具最強力的支持者。
*   **反思 (Learning)**: 
    負面回饋是一份「禮物」，它揭示了你系統的盲點。專業的應對方式是傾聽、親自觀察失敗現場，並利用數據構建出更具韌性的解決方案。
