# 17. Admit a Mistake | 承認錯誤 (Variant 2)
## Project: PIC Transcript (Robustness Overconfidence)

### 🎭 STAR Story (English)

*   **Situation**: 
    Early in the PIC Transcript project, I was overconfident in my initial "Pixel-Matching" algorithm. I presented it to the QA team as a "100% accurate solution" based on my lab tests. However, during the first week of factory deployment, the tool failed miserably because of a minor update in the BIOS font-rendering engine.
*   **Task**: 
    I had to admit that my initial solution was too "fragile" and fix the relationship with the factory team who now distrusted the tool.
*   **Action**: 
    I immediately **owned the failure**. I flew to the factory site the next day, not to defend my code, but to "watch it fail" in person. I apologized to the QA team for the disruption. I then realized that relying on pixel-perfect accuracy was my fundamental mistake. I spent the next 72 hours refactoring the engine to use **Feature-based matching (NCC)** and added a **Fuzzy logic layer**. I didn't leave the site until I proved the new version could handle the new font variations.
*   **Result**: 
    The "failed" launch actually strengthened my relationship with the factory team because they saw my commitment to fixing it. The tool's reliability increased to 99% across all hardware generations.
*   **Learning**: 
    Never be overconfident in "lab results." A professional acknowledges that real-world environments are chaotic. When you fail, **own it fast, show up in person, and fix the root cause**, not just the symptom.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    在 PIC Transcript 專案初期，我對最初的「像素比對 (Pixel-Matching)」演算法過於自信。根據實驗室測試，我向 QA 團隊將其介紹為「100% 準確的解決方案」。然而，在工廠部署的第一週，該工具就因為 BIOS 字體渲染引擎的一個微小更新而慘敗。
*   **任務 (Task)**: 
    我必須承認我最初的方案太過「脆弱」，並修復與現在對該工具失去信任的工廠團隊之間的關係。
*   **行動 (Action)**: 
    我立即 **承擔了這次失敗**。第二天我飛到了工廠現場，不是為了辯護我的代碼，而是為了親自「看它如何失敗」。我為造成的困擾向 QA 團隊道歉。接著我意識到，依賴像素級的準確度是我根本性的錯誤。在接下來的 72 小時裡，我將引擎重構為使用 **「基於特徵的匹配 (NCC)」** 並加入了一個 **模糊邏輯層**。我一直留在現場，直到證明新版本能處理新的字體變化。
*   **結果 (Result)**: 
    「失敗」的發佈反而加強了我與工廠團隊的關係，因為他們看到了我修復問題的決心。該工具的可靠性在所有硬體世代中提升到了 99%。
*   **反思 (Learning)**: 
    永遠不要對「實驗室結果」過於自信。專業人士應承認現實環境是混亂的。當你失敗時，**快速承擔、親自到場並修復根本原因**，而不僅僅是表象。
