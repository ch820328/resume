# 面試備忘錄：技術治理與績效分析平台 (Issue Analytics)

這張投影片的核心在於：**將混亂的工單數據轉化為具備指導意義的「工程指標」，透過數據建模預測項目風險。**

---

### 1. 💬 口語說明 (Colloquial Explanation)

*   **🇺🇸 English (Simple & Direct):**
    "Tracking technical debt across many projects is usually a mess of spreadsheets. I built an 'Issue Analytics Hub' to turn that raw data into actionable insights. I developed a special 'Unhealthy Rate' algorithm that uses data like issue aging and priority shifts to flag projects that are falling behind. It’s an early-warning system that helps managers move resources to where they are needed most before a project fails."
    
*   **🇹🇼 中文 (口語精簡):**
    「要追蹤這麼多專案的技術債通常很混亂。我開發了這個『Issue Analytics Hub』，把原始數據轉化為有意義的指標。我設計了一套專門的『不健康率演算法』，根據工單逾期天數和優先級變動來找出落後的專案。它就像一個預警系統，幫助主管在專案出問題前，就根據數據把資源調配到最需要的地方。」

---

### 2. ❓ 模擬問答 (Possible Q&A - Google/Amazon Hybrid Strategy)

1.  **問：「為什麼要自己寫演算法來算『不健康率』？這跟一般的 KPI 有什麼不同？」(Invent and Simplify / Dive Deep)**
    *   **🇺🇸 English**: "Standard KPIs are often too static. My algorithm uses a **Weighted Average** of multiple signals—like how long a bug stays open and its re-open rate. It's designed to capture the 'momentum' of a project, identifying risks two weeks before they become obvious. It simplifies complex project health into a single, trustable metric."
    *   **🇹🇼 中文**: 「標準 KPI 通常太僵化。我的演算法採用了多種訊號的**加權平均**——例如 Bug 開啟多久以及重啟率。它的目的是捕捉專案的『動量』，在風險變得明顯前兩週就識別出來。它把複雜的專案健康度簡化成一個可信的指標。」

2.  **問：「在開發這套平台時，你最擔心的『數據偏誤』是什麼？」(Inner Monologue)**
    *   **🇺🇸 English**: "I was worried that teams would start 'gaming the system'—closing tickets fast just to improve their score. I realized that a single metric is dangerous. This pushed me to include **Re-open Rate** as a stabilizer. If you close things too fast and they bounce back, your score actually gets worse. I wanted to ensure we were measuring real progress, not just activity."
    *   **🇹🇼 中文**: 「我擔心團隊會開始『鑽系統漏洞』——為了衝高分而隨便關閉工單。我意識到單一指標很危險，這促使我加入 **Re-open Rate (重啟率)** 作為穩定器。如果你關得太快但問題沒修好，分數反而會變差。我要確保我們測量的是真實進度，而不只是虛假活動。」

3.  **問：「當資料量增加到百萬級別時，你如何維持查詢效能？」(Dive Deep / Performance Awareness)**
    *   **🇺🇸 English**: "Querying millions of rows for live reports is slow and memory-intensive. I implemented **Materialized Views** and **Summary Tables**. We pre-calculate high-cost aggregations in the background, so the frontend only reads 'lightweight' results. This ensures millisecond response times regardless of data volume."
    *   **🇹🇼 中文**: 「對百萬行數據進行實時查詢既慢又耗內存。我實作了**物化視圖 (Materialized Views)** 與**統計摘要表**。我們在背景預先計算高成本的聚合運算，前端只讀取『輕量級』結果。這確保了無論資料量多大，都能維持毫秒級的響應速度。」

4.  **問：「為什麼選擇 Laravel 而非 Python 框架？」(Trade-offs / Decision Making)**
    *   **🇺🇸 English**: "For this specific project, I prioritized **Developer Velocity** and built-in tooling. Laravel's Eloquent ORM and task scheduling allowed me to build the full data aggregation pipeline and admin UI in half the time it would take in Flask. I chose the tool that delivered the highest ROI for the business."
    *   **🇹🇼 中文**: 「針對這個專案，我優先考慮了**開發速度**與內建工具。Laravel 的 ORM 與任務排程讓我只花了一半的時間就蓋好數據聚合管線與管理介面。我選擇了對業務來說投資報酬率 (ROI) 最高的工具。」

5.  **問：「這種『量化治理』的經驗，如何幫助你應對 Google 的規模？」(Future Pacing)**
    *   **🇺🇸 English**: "At Google's scale, you can't manage by intuition; you must manage by metrics. This project taught me how to distill massive noise into a few high-signal indicators. I will bring this data-driven governance mindset to Google to help our teams identify and eliminate technical debt efficiently."
    *   **🇹🇼 中文**: 「在 Google 的規模下，你不能靠直覺管理，必須靠指標。這個專案教會我如何從海量雜訊中萃取高訊號指標。我會將這種數據驅動的治理思維帶到 Google，幫助團隊高效地識別並消除技術債。」

6.  **問：「如果原始系統的 API 欄位改了，你的分析平台會崩潰嗎？」(High Standards / Maintenance)**
    *   **🇺🇸 English**: "No, I built a **Data Schema Mapping** layer. The core algorithm doesn't touch raw API fields; it uses an internal `MetricModel`. If the source changes, I only update the mapper. This ensures our technical governance remains stable even when the underlying tools are in flux."
    *   **🇹🇼 中文**: 「不會，我建立了**數據架構映射層 (Mapping Layer)**。核心演算法不會直接碰原始 API 欄位，而是使用內部的 `MetricModel`。如果源頭改了，我只要更新映射關係。這確保了即使底層工具變動，我們的技術治理依然穩定。」

---

### 3. 📚 技術名詞解析 (Technical Glossary)

*   **🇺🇸 Weighted Algorithm / 🇹🇼 加權演算法**:
    A method of calculating a value where different factors are given different levels of importance (weights). (根據不同因素的重要性（權重）來計算數值的方法。)
*   **🇺🇸 Issue Aging / 🇹🇼 工單逾期/老化**:
    The length of time a task or bug remains unresolved. (任務或 Bug 持續未解決的時間長度。)
*   **🇺🇸 Materialized Views / 🇹🇼 物化視圖**:
    A database object that contains the results of a query, stored physically to improve query performance. (存儲查詢結果的資料庫對象，實體化存儲以提升查詢效能。)
*   **🇺🇸 Re-open Rate / 🇹🇼 重啟率**:
    The frequency at which closed issues are reopened, often used as a proxy for fix quality. (已關閉工單被重新開啟的頻率，通常用來衡量修復品質。)
*   **🇺🇸 Service Pattern / 🇹🇼 服務模式**:
    A design pattern that encapsulates business logic into separate, reusable classes (Services). (將業務邏輯封裝進獨立、可複用類別（Services）的設計模式。)
