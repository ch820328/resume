# Google 面試：Behavioral Questions (BQ) & Googleyness 核心指南

這份指南將你的真實專案經驗，對應到 Google 面試中最常考的 4 大 **Googleyness & Leadership Principles (行為準則與領導力)**。
每個故事都採用 **STAR 原則 (Situation 情境 -> Task 任務 -> Action 行動 -> Result 結果)** 撰寫，備有中英雙語講稿，讓你能在面試中信手拈來。

---

## 🦸‍♂️ 主題一：Navigating Ambiguity (處理模糊與未知的需求)
**核心精神：** Google 喜歡「主動發現問題、定義問題，而不是等老闆派工」的工程師。
**常見考題：** "Tell me about a time you identified a problem nobody else saw and fixed it." (請分享一次你主動發現並解決了一個沒人注意到問題的經驗。)

### 🎯 故事 1：Central Dashboard (無中生有的生產力工具)

*   **🇺🇸 English Script (1-1.5 mins):**
    "At Supermicro, I noticed that our QA and RD teams were struggling with inefficient debugging workflows. They had to constantly switch between fragmented CLI tools, IPMITool, and Redfish just to monitor a single testing server. **Nobody asked me to build a solution (Navigating Ambiguity)**, but I knew this context-switching was costing us hours every week.
    So, I took the initiative to interview the QA engineers, aggregate their most common command patterns, and architected a single 'Central Dashboard' using Go and Angular. It provided a unified web interface with automated diagnostic scripts. As a result, test setup times were reduced by 40%, and the portal became the daily standard tool for the entire hardware validation team."
*   **🇹🇼 中文講稿：**
    「在 Supermicro 期間，我觀察到 QA 和 RD 團隊在除錯時效率極低。他們為了一台機器，得同時開好幾個視窗切換 IPMITool, Redfish 等破碎的工具。**當時主管並沒有交辦這個項目 (處理模糊性)**，但我知道這種 Context-Switching 每週都在浪費團隊大把時間。
    所以我主動去訪談第一線的 QA，整理出他們最常用的指令版型，並用 Go + Angular 打造了一個『Central Dashboard』集中化儀表板。它把瑣碎的指令變成了簡單好操作的網頁，還整合了自動化測試腳本。這項我主動發起的專案，最終幫團隊砍掉了 40% 的前置作業時間，成為工程師每天必用的標準工具。」

---

## 🛠️ 主題二：Handling Failure & Troubleshooting (處理錯誤與技術重構)
**核心精神：** 面對失敗不退縮，能找出 Root Cause (根本原因) 並從架構面徹底解決，確保災難不再發生。
**常見考題：** "Tell me about a time you encountered a difficult technical bug. How did you debug it and prevent it from happening again?" (分享一次你遇過最難的 Bug，你如何除錯並防止它再次發生？)

### 🎯 故事 2：Raspberry Pi VideoCapture (不穩定的硬體 IO 問題)

*   **🇺🇸 English Script (1-1.5 mins):**
    "We used Raspberry Pis to simulate manual hardware operations. Initially, the legacy RD script would open the IO device for 2 seconds just to capture a single frame, to avoid capturing a 'no signal' black screen. However, for a single test cycle, we needed to capture over 100 images.
    This caused the `VideoCapture` device to frequently crash and drop offline due to repeated, rapid IO opening and closing. **(The Failure)**
    Instead of just adding 'retries', I refactored the entire architecture. I transitioned to using `V4L2` APIs. I redesigned the service to open the IO stream *once* upon startup and keep it alive in the background. Whenever an image was requested, it simply transmitted the current frame from the buffer. This completely eradicated the hardware instability drops and significantly sped up the simulation workflow."
*   **🇹🇼 中文講稿：**
    「我們用樹梅派來模擬打點或硬體操作。早期 RD 寫的工具為了避免截圖截到『無訊號』的黑屏，每次截圖都會去開啟一次 IO，等兩秒後擷取最後的畫面。但我們單次測試常常需要連拍超過 100 張以上的截圖。
    這種頻繁且暴力的開啟/關閉 IO，導致 `VideoCapture` 設備經常崩潰掉線。**(失敗情境)**
    我沒有選擇用單純的 Retry 腳本去掩蓋問題，而是決定從底層重構。我改用 `V4L2` 框架，把架構改成『服務啟動時只開啟一次 IO 並在背景保持串流』。當測試腳本需要截圖時，直接從 Buffer 抓取當下最新的一幀。這個架構級的重構，徹底解決了設備掉線的不穩定問題，也讓自動化執行速度快上許多。」

---

## 🤝 主題三：Influencing Without Authority (無職權的影響力)
**核心精神：** 能用「數據即真理 (Data-driven)」和「同理心 (Empathy)」說服資深同事或跨部門採用你的方案。
**常見考題：** "Tell me about a time you had to push a controversial technical change to a resistant team." (分享一次你必須把具有爭議的技術改革推動給抗拒的團隊的經驗。)

### 🎯 故事 3：NVIDIA Jetson BSP 壓縮演算法 (Zstd 導入)

*   *(這裡可以沿用我們之前在 System Design 寫的 "Transparent Migration" 與 "ROI 數據說服" 策略。)*
*   **🇺🇸 English Script:**
    "When I proposed migrating our Jetson OS compression from Gzip to Zstd, I faced resistance from the manufacturing and QA teams who preferred the 'safe, legacy' scripts. Since I wasn't their manager, I had to influence them through data.
    First, I presented a benchmark proving that the 30% file size reduction would directly save hours of factory download time, boosting their UPH (Units Per Hour). Second, I employed a 'Transparent Migration' strategy. I completely encapsulated the Zstd complexity inside the existing scripts. The QA engineers could still run the exact same `./flash.sh` command. By removing the learning curve and proving the ROI, I successfully convinced the entire cross-functional team to adopt the new standard."
*   **🇹🇼 中文講稿：**
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
