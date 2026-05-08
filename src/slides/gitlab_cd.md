# 面試備忘錄：持續佈署與環境一致性治理 (GitLab CD)

這張投影片的核心在於：**透過「極致自動化」讓部署成為日常，消除人為干預，實現代碼到生產環境的零摩擦轉化。**

---

### 1. 💬 口語說明 (Colloquial Explanation)

*   **🇺🇸 English (Simple & Direct):**
    "I transformed our deployment process so that updating servers is no longer a stressful event. I built a CD pipeline that automatically pushes firmware and service updates to our hardware clusters. By using 'Health Probes' and 'Auto-Rollbacks,' I made sure that if anything goes wrong during a deploy, the system catches it and reverts immediately. This keeps our production environment perfectly synced with our code repository at all times."
    
*   **🇹🇼 中文 (口語精簡):**
    「我改造了我們的部署流程，讓更新伺服器不再是一件壓力很大的事。我建立了一套 CD 流水線，會自動把韌體和服務更新推送到硬體集群。透過『健康檢查』和『自動回滾』機制，我確保了部署過程中如果出錯，系統會立刻發現並自動還原。這讓我們生產環境的狀態能隨時跟 Git 倉庫保持完美同步。」

---

### 2. ❓ 模擬問答 (Possible Q&A - Google/Amazon Hybrid Strategy)

1.  **問：「為什麼要推行『無人值守』部署？這不會增加風險嗎？」(Ownership / High Standards)**
    *   **🇺🇸 English**: "Actually, manual deployment IS the risk. Humans make mistakes; automated pipelines don't. I believe in building a system that is **Self-Healing**. By integrating automated smoke tests, we catch issues faster than any human could, which ultimately raises our standard for reliability."
    *   **🇹🇼 中文**: 「事實上，人工部署才是風險。人會犯錯，但自動化流水線不會。我致力於建立一個具備**自我修復 (Self-Healing)** 能力的系統。透過整合自動化冒煙測試，我們捕捉問題的速度比人工快得多，這最終提升了我們的可靠性標準。」

2.  **問：「當你第一次在生產環境執行自動回滾時，你的感受是什麼？」(Inner Monologue)**
    *   **🇺🇸 English**: "I felt a mix of anxiety and relief. Anxiety because a deploy failed, but relief because the safety net I built—the auto-rollback—actually worked. It confirmed my belief that as an infra engineer, my job is to build systems that fail gracefully, protecting our users from downtime."
    *   **🇹🇼 中文**: 「我當時既焦慮又放鬆。焦慮是因為部署失敗了，但放鬆是因為我建立的安全網（自動回滾）真的起作用了。這印證了我的信念：作為 Infra 工程師，我的職責是建立能『優雅失敗』的系統，保護使用者免受停機影響。」

3.  **問：「你是如何處理異質環境（Dev/QA/Prod）之間的變數管理？」(Dive Deep / Performance Awareness)**
    *   **🇺🇸 English**: "I used **Environment-Agnostic Artifacts**. The same binary is used everywhere, but configurations are injected at runtime via Vault or GitLab variables. This eliminates the 'it works on my machine' problem and ensures that our testing environment is a perfect proxy for production performance."
    *   **🇹🇼 中文**: 「我採用了**環境無關的產物 (Environment-Agnostic Artifacts)**。同樣的二進位檔跑在所有環境，但配置是在執行時透過 Vault 或 GitLab 變數動態注入。這消除了『在我電腦上可以跑』的問題，確保測試環境能完美模擬生產環境的效能。」

4.  **問：「在實體機環境下，為什麼選 Rolling Update 而非藍綠部署？」(Trade-offs / Decision Making)**
    *   **🇺🇸 English**: "Cost and hardware constraints. We didn't have double the hardware capacity for blue-green. I chose **Rolling Update** with strict health gating. For L4, it's about making the best technical choice within given constraints—achieving high availability without unnecessary capital expenditure."
    *   **🇹🇼 中文**: 「成本與硬體限制。我們沒有雙倍的機台資源來做藍綠部署。我選擇了帶有嚴格健康門禁的 **Rolling Update**。對於 L4 來說，重點是在限制下做出最佳技術抉擇——在不增加非必要資本支出的情況下實現高可用性。」

5.  **問：「這種『部署即非事件』的理念如何應用在 Google 的規模上？」(Future Pacing)**
    *   **🇺🇸 English**: "At Google, deployments happen thousands of times a day. This project taught me the importance of 'Deployment Transparency.' I will bring this focus on visibility and automated safety to Google to ensure that our massive global infrastructure remains stable even during rapid iterations."
    *   **🇹🇼 中文**: 「在 Google，部署每天發生數千次。這個專案教會我『部署透明度』的重要性。我會將這種對可視化與自動化安全的專注帶到 Google，確保我們龐大的全球基礎設施即使在快速迭代中也能保持穩定。」

6.  **問：「如果 CD 執行時偵測到手動變更，你會怎麼處理？」(Earn Trust / Ownership)**
    *   **🇺🇸 English**: "Our rule is 'Single Source of Truth.' The CD pipeline will trigger an alert and pause if an **Idempotency Conflict** is detected. I would then work with the person who made the change to understand the 'why' and ensure that the fix is committed to Git, preserving the integrity of our infrastructure-as-code."
    *   **🇹🇼 中文**: 「我們的原則是『唯一真理源』。如果偵測到**冪等性衝突**，CD 流水線會報警並暫停。我會與進行變更的人員溝通，了解『為什麼』，並確保該修復被提交回 Git，以維護基礎設施即代碼的完整度。」

---

### 3. 📚 技術名詞解析 (Technical Glossary)

*   **🇺🇸 IaC (Infrastructure as Code) / 🇹🇼 基礎設施即代碼**:
    Managing and provisioning infrastructure through machine-readable definition files, rather than physical hardware configuration or interactive configuration tools. (透過機器可讀的定義檔來管理與配置基礎設施，而非手動操作。)
*   **🇺🇸 Health Probes / 🇹🇼 健康檢查**:
    Automated checks that determine if a service or system is functioning correctly after deployment. (自動化檢查，用以判斷服務或系統在部署後是否正常運作。)
*   **🇺🇸 Auto-Rollback / 🇹🇼 自動回滾**:
    A feature that automatically reverts a deployment to a previous stable version if the current one fails health checks. (如果當前部署未通過健康檢查，自動還原至上一個穩定版本的特色。)
*   **🇺🇸 Single Source of Truth / 🇹🇼 唯一真理源**:
    The practice of structuring information models such that every data element is mastered in only one place. (確保每個數據元素都只由一個地方掌控的實務作法。)
*   **🇺🇸 Rolling Update / 🇹🇼 滾動更新**:
    A deployment strategy that updates a set of servers incrementally to ensure high availability. (逐台更新伺服器以確保高可用性的部署策略。)
