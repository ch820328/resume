# 13. Disagreement | 意見分歧
## Project: Infrastructure Migration (Stability vs. Speed)

### 🎭 STAR Story (English)

*   **Situation**: 
    During a critical infrastructure upgrade for the Jetson BSP build pipeline, a senior developer insisted on skipping certain validation steps to meet a tight shipping deadline. I strongly disagreed, as I believed skipping these steps would lead to non-deterministic device tree errors in production.
*   **Action**: 
    I didn't turn it into a personal argument. Instead, I focused on **Risk Quantification**. I spent a few hours building a quick "stress-test" script that simulated the skipped validation. I presented the results, showing a **15% failure rate** in edge cases that the senior developer hadn't considered. I proposed a middle-ground: **automated parallel validation**, which would run the checks without delaying the main build pipeline.
*   **Result**: 
    The team adopted the parallel validation approach. We hit the deadline, and more importantly, the automated check caught 2 critical bugs that would have crashed the hardware in the field.
*   **Learning**: 
    When disagreeing with a peer or senior, use data to remove emotion from the discussion. A "disagreement" is just a difference in risk assessment; the best way to resolve it is to provide more accurate information.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    在 Jetson BSP 建置流水線的一次關鍵基礎設施升級中，一位資深開發者堅持跳過某些驗證步驟，以趕上緊迫的交付期限。我強烈反對，因為我認為跳過這些步驟會導致生產環境中出現不確定的 Device Tree 錯誤。
*   **行動 (Action)**: 
    我沒有將其演變成個人爭論。相反地，我專注於 **「風險量化」**。我花了幾個小時建立了一個簡單的「壓力測試」腳本，模擬跳過驗證後的結果。我展示了測試數據，證明在資深開發者未考慮到的邊界情況下，有 **15% 的失敗率**。我提出了一個折衷方案：**並行自動驗證**，這能在不延誤主建置流水線的情況下執行檢查。
*   **結果 (Result)**: 
    團隊採納了並行驗證的方法。我們準時完成了交付，更重要的是，自動檢查攔截了 2 個原本會導致硬體在現場當機的關鍵 Bug。
*   **反思 (Learning)**: 
    當與同事或資深前輩產生分歧時，利用數據將情緒從討論中抽離。一個「分歧」通常只是對風險評估的不同；解決它的最好方法是提供更準確的資訊。
