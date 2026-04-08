# Interview Guide: Cross-Platform Business Intelligence Engine

## 🎤 簡報講稿 (Elevator Pitch)
*   **🇺🇸 English (1-min Pitch):** "I built an internal dashboard using Laravel to pull data from Redmine, Excel, and other project boards. By cleaning up the data and running background jobs to summarize it, the dashboard loads instantly and gives managers a quick view of team blockers and ticket trends."
*   **🇹🇼 中文 (1 分鐘講稿):** 「我用 Laravel 寫了一個內部儀表板，負責把 Redmine、Excel 還有專案看板的資料統整起來。透過統一資料格式，加上在背景跑排程先把數據算好，這個系統載入速度很快，能讓主管馬上看出專案哪裡卡住或是整體的進度趨勢。」

## 一、 資料整合與 ETL (Data Integration & ETL)

### Q: 既然資料來源包含 Redmine, Excel 和 Project Board，你如何處理「資料清洗」與欄位不統一的問題? / How do you handle data cleaning and schema mapping from disparate sources?
*   **🇺🇸 English:** "I created a standard format we wanted everything to end up in. Then, I wrote small adapters for each system like Redmine or the boards, to translate their statuses into our standard format. For Excel uploads, I added strict checks upfront so bad data gets rejected before it even enters the database."
*   **🇹🇼 中文:** 「我先訂好一個我們想要的通用格式（例如只留幾種狀態）。然後針對 Redmine 或看板各寫一個轉接程式，把他們原本的狀態對應到我們的標準。至於 Excel 匯入，我在上傳那一關就加了嚴格的檢查，格式不對直接擋掉，不會讓髒資料進到資料庫。」

## 二、 效能與擴展性 (Performance & Scalability)

### Q: 當資料量變大時，複雜的 SQL 統計會變得很慢，你如何優化查詢效能? / How do you optimize complex SQL queries for large datasets?
*   **🇺🇸 English:** "I don't run heavy SQL joins when the user loads the page. Instead, I use cron jobs to calculate the totals and metrics in the background every hour, and save them in a summary table. So when the frontend asks for data, it just reads that small table, which takes milliseconds."
*   **🇹🇼 中文:** 「我不會在打開網頁的當下去撈好幾個大表做計算。我是設定每小時在背景跑排程，先把統計數據算完，存到一張總表裡。前端抓資料時，只要讀這張已經算好的小表就好，所以網頁幾乎是秒開。」

## 三、 框架選型 (Technology Choice)

### Q: 為什麼選擇 Laravel 搭配 PHP? / Why Laravel over Python/Django for Data Analytics?
*   **🇺🇸 English:** "Python is great for data, but for an internal tool, development speed is key. Laravel has everything built-in—auth, database tools, queues—which made it really fast to spin up a secure web app that fits into our existing PHP setup."
*   **🇹🇼 中文:** 「雖然 Python 很適合算資料，但做內部工具，開發速度最重要。Laravel 的套件很完整，像是權限控制、資料庫連線、背景排程都包好了。這讓我能很快把一個安全的網頁系統趕出來，也比較好跟公司現有的 PHP 伺服器整合。」

## 四、 商業影響力 (Business Impact)

### Q: 你如何定義「Unhealthy Rate」? 這個指標真的能反映團隊效率嗎? / How did you define "Unhealthy Rate" and why?
*   **🇺🇸 English:** "I tracked tickets that hadn't been updated for over 7 days. Just counting closed tickets doesn't tell you much. Seeing the 'Unhealthy Rate' go up helps management catch team blockers early, so they can step in and help before a deadline is missed."
*   **🇹🇼 中文:** 「我特別去抓那些『超過 7 天沒動靜的票』。因為只看關了多少票不夠準確，『不健康率』能直接點出哪裡卡關或沒人在管。只要看到這個比例往上飆，主管就可以提早發現問題去幫忙，而不是等到專案快 deadine 了才發現做不完。」

---

## 🚀 Google L4/L5 System Design & Architecture Deep Dives

### [L4 深度題] Extending Design Patterns for New Data Sources (新資料源的無縫擴展)
*   **🇺🇸 English:** "If the company mandates adding Jira as a 4th data source next month, how does your backend architecture handle this without rewriting the core analytics engine?"
*   **🇹🇼 中文:** 「如果公司下個月強制要求把 Jira 接入變成第四個資料來源，你的後端架構如何在不改寫核心統計引擎的狀況下吃下這份需求？」
*   **💡 Expected Defense:**
    *   *Design:* "I separated the data fetching from the main logic using the Adapter Pattern. The core system only expects our standard data object. So to add Jira, someone just needs to write a Jira adapter that converts Jira's API response into our standard object. It won't break the existing Redmine or Excel logic at all."
    *   *(中文防禦：我有把串接資料跟核心計算分開做。核心系統只認我們自己的標準格式，所以要加 Jira 的話，只要寫一個 Jira 的轉接器，把 Jira 的 API 格式轉換成我們的標準格式丟過去就好。這樣完全不會動到原本算好的系統，也不會弄壞舊的功能。)*

### [L5 架構題] Data Governance & Row-Level Security (資料分享與權限控管)
*   **🇺🇸 English:** "This platform holds productivity metrics for 500+ engineers. How did you design the backend to ensure a Team Lead only sees their 10 subordinates, while a Director sees the aggregate, without manually writing rigid database queries for every possible role?"
*   **🇹🇼 中文:** 「這個平台握有五百個工程師的績效數據。你如何設計後端，確保一般主管只能看到他底下 10 個人，而處長可以看到全局？你不可能為了每個階層都去寫死 (Hardcode) 不同的 SQL 語法吧？」
*   **💡 Expected Defense:**
    *   *Design:* "I used database query scopes. When a user logs in, we know who reports to them. The database automatically adds a filter to only show records linked to their team members on every query. This saves us from having to manually check permissions in every single API endpoint, preventing accidental data leaks."
    *   *(中文防禦：我是用 Laravel 內建的 Global Scope 在資料庫層做控管。當使用者登入後，系統知道他底下有哪些人，並在底層自動幫每個資料庫查詢加上『只包含下屬資料』的過濾條件。這樣我們就不用在每個 API 裡面手動寫權限判斷，也避免了工程師忘記寫而導致資料外洩的風險。)*
