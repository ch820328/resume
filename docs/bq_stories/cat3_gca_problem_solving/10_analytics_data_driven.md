# 10. Data-Driven Decisions | 數據導向 (Variant 2)
## Project: Issue Analytics (The Unhealthy Rate Algorithm)

### 🎭 STAR Story (English)

*   **Situation**: 
    Our management team was struggling to identify which projects were at risk of failing. They relied on "Gut Feeling" and simple counts of open bugs, which were often misleading. A project with 100 low-priority bugs might be healthier than one with 5 critical, aging bugs.
*   **Task**: 
    Create an objective, data-driven "Project Health Metric."
*   **Action**: 
    I developed a custom **"Unhealthy Rate" Algorithm**. Instead of simple counting, I used a **Weighted Scoring System** based on historical data. I assigned weights to: **Issue Aging** (how long it stays open), **Priority Shift** (how often it's escalated), and **Re-open Rate** (fix quality). I validated the algorithm by "Back-testing" it against projects that had failed in the past year. The data proved that my algorithm could have predicted those failures two weeks before they happened.
*   **Result**: 
    The "Unhealthy Rate" became the standard dashboard for all project managers. We reduced project "Emergency Interventions" by **40%** because we could now identify and fix risks early.
*   **Learning**: 
    Data-driven decisions require **distilling noise into signal**. By weighting raw data according to its business impact, you turn a "messy spreadsheet" into a powerful predictive tool.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    我們的主管團隊很難識別哪些專案面臨失敗風險。他們依賴「直覺」和簡單的待解 Bug 數量，這通常會誤導判斷。一個有 100 個低優先級 Bug 的專案可能比一個有 5 個過期關鍵 Bug 的專案更健康。
*   **任務 (Task)**: 
    建立一個客觀、數據驅動的「專案健康指標」。
*   **行動 (Action)**: 
    我開發了一套自定義的 **「不健康率 (Unhealthy Rate) 演算法」**。我沒有進行簡單的計數，而是使用了基於歷史數據的 **「加權評分系統」**。我為以下因素分配權重：**工單逾期 (Aging)**、**優先級變動 (Priority Shift)** 以及 **重啟率 (Re-open Rate)**。我透過對過去一年失敗的專案進行 **「回溯測試 (Back-testing)」** 來驗證演算法。數據證明，我的演算法能在風險發生前兩週就預測到失敗。
*   **結果 (Result)**: 
    「不健康率」成為了所有專案經理的標準儀表板。我們將專案的「緊急介入」次數減少了 **40%**，因為現在我們可以及早發現並修復風險。
*   **反思 (Learning)**: 
    數據驅動的決策需要 **「從雜訊中萃取訊號」**。透過根據業務影響力對原始數據進行加權，你可以將「混亂的試算表」轉化為強大的預測工具。
