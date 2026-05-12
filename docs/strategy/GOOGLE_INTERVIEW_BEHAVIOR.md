# Google 面試：行為面試 (BQ) 準備心得

這份文件幫你把過去的專案經驗轉化為 Google 重視的特質。我們不用太死板的 STAR 格式，而是把重點放在「你為什麼要這樣做」以及「你學到了什麼」。

---

## 🧭 主題一：主動解決模糊需求 (Handling Ambiguity)

Google 喜歡會主動找問題的人，而不是等指令的人。

### 🎯 案例 1：Central Dashboard (主動開發的工程師工具)

*   **🇺🇸 English (How to say it):**
    "When I was at Supermicro, I noticed our debugging workflow was a bit of a mess. Engineers had to jump between different CLI tools and fragmented internal portals just to check a single machine's status. Although it wasn't on my official task list, I realized we were wasting a lot of time on this context-switching.
    So, I went ahead and interviewed our QA teams to learn their most painful pain points. Based on that, I built a 'Central Dashboard' using Go and Angular. It basically turned a bunch of messy terminal commands into a single, clean web UI. Test setup time dropped by 40%, and eventually, it became the default tool for the whole team."
*   **🇹🇼 中文大意：**
    當時我發現團隊除錯的效率很卡，因為大家得在不同的指令工具跟網頁之間跳來跳去。雖然主管沒叫我做這件事，但我看出這種切換很浪費時間。所以我主動去問了 QA 同事，把他們最常用的指令版型整理出來，做了一個整合式的儀表板。最後不但幫大家省下 40% 的前置時間，這個工具也成了團隊每天在用的標準配備。

---

## 🛠️ 主題二：處理技術挫折與重構 (Failure & Resilience)

重點在於你如何找出病根 (Root Cause)，並從架構上徹底解決，不只是疊床架屋。

### 🎯 案例 2：VideoCapture 設備掉線問題

*   **🇺🇸 English (How to say it):**
    "We used Raspberry Pis to simulate manual hardware operations, but we hit a wall where the camera capture was extremely unstable. The original script would open and close the device for every single frame to avoid black screens, but we needed to take hundreds of shots. This rapid-fire opening of the IO was crashing the hardware. 
    Instead of just adding a retry loop, I decided to rethink the architecture. I refactored the service using the V4L2 API to keep the stream running in the background. Now, we capture frames directly from a buffer without toggling the hardware and it's been rock solid ever since."
*   **🇹🇼 中文大意：**
    以前我們用樹莓派截圖時，為了怕擷取到黑畫面，原本的寫法是「拍一張就重啟一次鏡頭」，結果拍多了硬體就崩潰了。我那時候沒有選擇只加一個 Retry（重試）程式碼，而是決定從架構下手。我改用 V4L2 框架讓鏡頭在背景保持運作，要拍的時候直接從快取 (Buffer) 抓圖。這不但徹底解決了掉線問題，執行速度也快了很多。

---

## 🤝 主題三：沒有職權的影響力 (Influence)

如何用數據說服不相信你、或不想改動的人。

### 🎯 案例 3：壓縮演算法 (Zstd) 導入

*   **🇺🇸 English (How to say it):**
    "I wanted to switch our Jetson build system from Gzip to Zstd to save space, but the manufacturing and QA teams were pretty resistant because they didn't want to mess with a working process. I didn't have any formal authority over them, so I had to prove it with data.
    First, I showed them benchmarks proving we could cut image size by 30%, which meant faster factory downloads and more 'units-per-hour'. Then, I made the migration completely transparent—I tucked all the Zstd logic deep inside the existing scripts so their CLI commands didn't change at all. Once they saw the performance gain with zero learning curve, everyone was on board."
*   **🇹🇼 中文大意：**
    我想把壓縮更換成 Zstd 來節省空間，但產線跟 QA 的人很不情願，因為他們覺得原本的腳本會動就好，沒必要冒險。我不是他們的主管，所以我先用測試數據證明 30% 的縮減能讓工廠下載變快、出貨量提升。再來我保證「完全無痛轉換」，我把複雜邏輯包在舊腳本裡，他們敲的指令完全沒變。最後大家都學會了新方法，也順利完成了優化。

---

## 📈 主題四：根據回饋進行迭代 (Iteration & Feedback)

承認一開始設計不夠好，並主動修正。

### 🎯 案例 4：Baby Tracker (分散式同步衝突)

*   **🇺🇸 English (How to say it):**
    "When I first built an offline-first app for baby tracking, I totally missed the concurrency issues. If my wife and I both logged data while offline, our changes would randomly overwrite each other once we reconnected. It was a clear design flaw.
    I took it as a learning opportunity and researched how distributed syncing actually works. I ended up rewriting the sync engine using a 'Last-Write-Wins' strategy with version control. It was a tough lesson, but now I treat edge cases like network partitions as a top priority whenever I design a new system."
*   **🇹🇼 中文大意：**
    剛開始幫小孩寫記錄 App 的時候，我沒想清楚離線同步的問題。只要我們夫妻倆同時在沒網的地方記東西，連上網後資料就會打架、互相覆蓋。這是一個設計上的失誤，所以我重新研究了分散式系統的做法，引進了 LWW 策略跟版本控制來重寫同步引擎。這次經驗讓我很受用，現在我設計任何功能，第一步都會先考慮到「要是網路斷了會發生什麼事」。
：**
    「當我提議把 Jetson 韌體的壓縮從原廠預設的 Gzip 換成 Zstd 時，遇到了產線跟 QA 的抗拒，因為改寫底層腳本對他們來說風險太高了。
    我不是他們的主管，所以我必須用數據說服人。首先，我做了一份 Benchmark 報告，證明縮減的 30% 體積能直接替他們省下大把的工廠下載時間，提升 UPH。接著，我用了『透明化轉換 (Transparent Migration)』。我把 Zstd 複雜的解壓縮邏輯包在底層腳本裡，第一線工程師敲的 `./flash.sh` 指令完全沒變。透過消除學習成本並展示優渥的投資報酬率，我成功且無痛地帶領跨部門團隊完成了技術升級。」

---

## 📈 主題四：Iterative Improvement & Receptiveness to Feedback (迭代思維與接受回饋)
**核心精神：** 承認自己初版設計的不完美，並透過學習、收集使用者回饋進行系統迭代 (Iteration)。
**常見考題：** "Tell me about a time you realized a feature you built wasn't working as intended. What did you do?" (分享一次你意識到自己做的功能不符合預期的經驗，你怎麼處理？)

### 🎯 故事 4：Baby Tracker (從互相覆蓋到 LWW 機制)

*   **🇺🇸 English Script:**
    "When I first built the offline-first Baby Tracker app for my wife and me, I completely overlooked distributed concurrency. If we both logged data while our phones were offline, upon reconnecting, our data would randomly overwrite each other. **(The design flaw)**
    I realized I needed a stronger systemic approach. I researched distributed systems design and discussed with AI tools to learn about Eventual Consistency. Following this, I completely refactored the sync engine. I introduced a 'Last-Write-Wins (LWW)' strategy paired with version control blocks, ensuring deterministic data merging. This failure completely transformed my mindset—now I design every component with network-partitioning edge cases in mind from day one."
*   **🇹🇼 中文講稿：**
    「在我剛幫我們夫妻倆寫出 Baby Tracker 這個離線 App 時，我完全忽略了分散式併發 (Concurrency) 的問題。初期只要我們的手機都在離線狀態下記錄喝奶時間，一旦連上網路，家長彼此的資料就會互相覆蓋掉。**(設計上的缺失)**
    我立刻意識到我的系統思維不夠嚴謹。我主動去研究分散式系統的理論，並與 AI 討論『最終一致性 (Eventual Consistency)』的做法。後來，我整個重構了同步引擎，加入了 LWW (Last-Write-Wins) 策略與版本號控制，徹底解決了資料衝突。這次的失敗大幅提升了我的架構思維：從那之後，我設計任何系統的第一步，就是先思考在極端網路斷線下的 Edge Cases。」
