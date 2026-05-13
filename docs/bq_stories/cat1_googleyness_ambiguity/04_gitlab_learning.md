# 04. Learning & Curiosity | 學習熱情
## Project: GitLab-to-Jenkins Pipeline Integration

### 🎭 STAR Story (English)

*   **Situation**: 
    Our development team used GitLab for version control, but the deployment infrastructure was locked within a complex Jenkins environment. Because these two systems didn't talk to each other, deployments were manual, slow, and prone to "Version Mismatch" errors.
*   **Task**: 
    I wanted to eliminate this "Integration Gap" by creating a fully automated, cross-platform pipeline, which required me to learn Jenkins API orchestration and GitLab webhook security from scratch.
*   **Action**: 
    I took the initiative to study the **Jenkins Remote API** and **GitLab CI Webhooks**. I engineered a custom bridge that allowed GitLab CI to **trigger downstream Jenkins jobs** automatically upon successful builds. I implemented a secure authentication layer using secret tokens and built a **"Status Feedback Loop"** where Jenkins would report the final deployment status back to the GitLab Merge Request, providing developers with a unified visibility.
*   **Result**: 
    Completely eliminated manual deployment steps. Reduced the end-to-end release cycle from 1 hour to **10 minutes**. The solution was so stable that it was adopted as the standard CI/CD pattern for 5 other major projects in the company.
*   **Learning**: 
    True engineering curiosity is about **breaking down silos**. By learning how to bridge two disparate systems (GitLab & Jenkins), I was able to create far more value than just optimizing a single platform.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    我們的開發團隊使用 GitLab 進行版本控制，但部署基礎設施卻被鎖在一個複雜的 Jenkins 環境中。因為這兩個系統彼此不通訊，導致部署必須手動執行，速度緩慢且容易出現「版本不一致」的錯誤。
*   **任務 (Task)**: 
    我希望透過建立一個完全自動化的跨平台流水線來消除這個「整合缺口」，這需要我從零開始學習 Jenkins API 編排與 GitLab Webhook 安全性。
*   **行動 (Action)**: 
    我主動研究了 **Jenkins Remote API**、**GitLab CI Webhooks** 以及 **語義化版本 (Semantic Versioning)** 原則。我架構了一個自定義橋樑，實現了 **「自動化版本引擎」**：在 Merge Request 合併後，流水線會自動解析提交內容並 **建議且更新 GitLab Tag**。這個標籤隨後會作為觸發點，啟動下游 Jenkins 任務。我實作了安全驗證層，並建立了一個狀態回饋循環，讓所有發佈過程 100% 可視化且無人值守。
*   **結果 (Result)**: 
    徹底消除了手動標記標籤的繁瑣與錯誤，實現了 100% 的自動化版本管理。將端到端的發佈週期縮短至 **10 分鐘**。該自動化標籤模式極大提升了團隊的開發者體驗 (DX)，並被多個核心專案採納。
*   **反思 (Learning)**: 
    學習熱情讓我有能力解決「重複性」的痛點。透過自動化版本管理，我證明了「好奇心」可以轉化為極高的工程效能與系統嚴謹性。

---

### ❓ 模擬問答 (Possible Q&A)

1.  **問：「為什麼要花力氣串接兩個系統，而不是直接把部署移到 GitLab CI？」**
    *   **🇺🇸 English**: "Our Jenkins setup had years of legacy testing logic and hardware lab integrations that were too risky to migrate. The most efficient solution was to **'Bridge'** them. It allowed us to keep our stable deployment logic in Jenkins while benefiting from GitLab's modern CI interface."
    *   **🇹🇼 中文**: 「我們的 Jenkins 設定擁有多年累積的測試邏輯與硬體實驗室整合，遷移風險太大。最有效的解決方案是 **『橋接 (Bridge)』** 他們。這讓我們能在保留 Jenkins 穩定部署邏輯的同時，享受到 GitLab 現代化 CI 介面的好處。」

2.  **問：「你是如何處理觸發失敗的情況？如果 Webhook 沒送到怎麼辦？」**
    *   **🇺🇸 English**: "I implemented a **Retry Logic** and a manual 'Force Sync' button in our internal dashboard. Additionally, I set up a logging service that monitors the Webhook delivery status, ensuring we have a 100% audit trail of whether the trigger was successful or not."
    *   **🇹🇼 中文**: 「我實作了 **重試邏輯 (Retry Logic)**，並在內部儀表板中加入了一個手動『強制同步』按鈕。此外，我建立了一個監控 Webhook 交付狀態的日誌服務，確保我們對於觸發是否成功擁有 100% 的審計追蹤。」

3.  **問：「評分 (Score)」**
    *   **Rating**: **8.8/10** (展現了優異的系統整合能力與實務問題解決導向，這是大型組織非常需要的工程特質。)
