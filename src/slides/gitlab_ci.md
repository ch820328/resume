# 面試備忘錄：流水線最佳化與品質門禁 (GitLab CI)

這張投影片的核心在於：**透過「工程紀律」與「環境預置技術」提升開發效率，確保代碼合併前具備絕對的技術信心。**

---

### 1. 💬 口語說明 (Colloquial Explanation)

*   **🇺🇸 English (Simple & Direct):**
    "I optimized our CI pipelines to make development faster and safer. I enforced a 'Rebase-based Gating' rule to catch merge conflicts early. To speed things up, I used 'Pre-baked Docker Images'—pre-installing all dependencies so the pipeline doesn't waste time downloading them every time. This cut our pipeline duration by 60%, so engineers get feedback in seconds instead of minutes."
    
*   **🇹🇼 中文 (口語精簡):**
    「我優化了我們的 CI 流水線，讓開發變更快、更安全。我強制實作了『基於 Rebase 的門禁規則』，提早攔截合併衝突。為了加速，我採用了『預建構 Docker 鏡像』策略，把所有依賴都先裝好，這樣流水線就不用每次都浪費時間下載。這讓執行時間縮短了 60% 以上，工程師只要幾秒鐘就能得到測試結果，不需要等好幾分鐘。」

---

### 2. ❓ 模擬問答 (Possible Q&A - Google/Amazon Hybrid Strategy)

1.  **問：「為什麼要強制 Rebase Gating？這不會讓開發者覺得麻煩嗎？」(High Standards / Earn Trust)**
    *   **🇺🇸 English**: "It might feel like a hurdle initially, but it ensures **Test Integrity**. A test passed on an old branch doesn't guarantee it works after merging. By forcing a rebase, we ensure CI runs on the 'latest' state. This builds trust in the pipeline because green actually means green."
    *   **🇹🇼 中文**: 「剛開始可能會覺得麻煩，但這保證了**測試完整性**。在舊分支上跑過的測試無法保證合併後依然正確。透過強制 Rebase，我們確保 CI 跑在『最新』狀態。這建立了團隊對流水線的信任，因為綠燈就代表真正的安全。」

2.  **問：「當你看到工程師在等待 CI 跑完而無法工作時，你在想什麼？」(Inner Monologue)**
    *   **🇺🇸 English**: "I felt that every minute wasted on a slow CI was a minute of lost innovation. I realized that 'Developer Velocity' is a performance metric just like system latency. I felt a responsibility to remove that friction so my teammates could stay in the 'flow' state."
    *   **🇹🇼 中文**: 「我覺得在慢速 CI 上浪費的每一分鐘都是在消耗創新。我意識到『開發速度 (Developer Velocity)』跟系統延遲一樣，都是關鍵的效能指標。我有責任消除這種摩擦，讓隊友能保持在『心流』狀態。」

3.  **問：「預建構鏡像 (Pre-baking) 雖然快，但維護起來不會很累嗎？」(Dive Deep / Performance Awareness)**
    *   **🇺🇸 English**: "If done manually, yes. But I automated the image rebuild process. Whenever `requirements.txt` changes, a separate pipeline triggers to update the base image. This **Zero-Latency Startup** strategy provides the best ROI (Return on Investment) for a high-frequency development team."
    *   **🇹🇼 中文**: 「如果手動做會很累，但我把鏡像重建自動化了。只要依賴配置文件變更，就會自動觸發更新。這種**零延遲啟動**策略對高頻率開發團隊來說，是投資報酬率最高的優化方案。」

4.  **問：「你是如何在高併發的情況下管理 Runner 資源的？」(Dive Deep / Scaling)**
    *   **🇺🇸 English**: "I implemented **Tag-based Routing** and monitored the runner's CPU/Memory load分位數. Heavy build jobs are routed to high-performance bare-metal runners, while light linting jobs run in lightweight Docker containers. This ensures we don't starve the critical path of the CI."
    *   **🇹🇼 中文**: 「我實作了**基於標籤的路由 (Tag-based Routing)** 並監控 Runner 的負載分位數。重型編譯任務會被導向高效能實體機，輕型任務則跑在容器裡。這確保了我們不會讓關鍵路徑上的 CI 任務因為缺乏資源而卡住。」

5.  **問：「你在 CI 流程中如何應用『數據驅動』的思維？」(Data-Driven / Future Pacing)**
    *   **🇺🇸 English**: "I didn't just guess which step was slow. I used GitLab CI's metrics to profile the pipeline. I found that dependency installation was 70% of the time, which led to the Pre-baking strategy. At Google, I will continue to use profiling to find and eliminate bottlenecks in our build systems."
    *   **🇹🇼 中文**: 「我不是靠猜測哪一動變慢，而是利用指標來進行效能剖析 (Profile)。我發現依賴安裝佔了 70% 的時間，這才促成了預建構策略。在 Google，我會持續利用剖析技術來找出並消除構建系統中的瓶頸。」

6.  **問：「如果開發者對你的 Gating 規則有強烈意見，你如何處理？」(Disagree and Commit / Earn Trust)**
    *   **🇺🇸 English**: "I would show them the data—specifically, how many 'broken master' incidents were prevented by this rule. I listen to their concerns about friction, and I work to simplify the Rebase process (e.g., via automation scripts), but I don't compromise on the quality standard."
    *   **🇹🇼 中文**: 「我會讓數據說話，展示這條規則攔截了多少次『Master 被弄掛』的事故。我會傾聽他們對流程摩擦的疑慮，並致力於簡化 Rebase 流程（例如提供腳本），但在品質標準上我不會妥協。」

---

### 3. 📚 技術名詞解析 (Technical Glossary)

*   **🇺🇸 Rebase-based Gating / 🇹🇼 基於變基的門禁**:
    A rule that requires a branch to be updated with the latest master code before it can be tested and merged. (要求分支在測試與合併前必須先同步 master 最新代碼的規則。)
*   **🇺🇸 Pre-baking Strategy / 🇹🇼 預建構策略**:
    The process of pre-installing software and configurations into a container image to save time during runtime. (預先在鏡像中裝好軟體與配置，以節省執行時的時間。)
*   **🇺🇸 Developer Velocity / 🇹🇼 開發速度**:
    A measure of how quickly a development team can deliver high-quality software. (衡量開發團隊交付高品質軟體速度的指標。)
*   **🇺🇸 Tag-based Routing / 🇹🇼 基於標籤的路由**:
    Assigning CI jobs to specific runners based on their labels or capabilities. (根據標籤或能力將 CI 任務指派給特定的執行器。)
*   **🇺🇸 Merge Conflict / 🇹🇼 合併衝突**:
    An event that occurs when Git is unable to automatically resolve differences in code between two commits. (Git 無法自動解決兩次提交間的代碼差異時發生的事件。)
