# Interview Guide: GitLab CI Automated Quality Gate

## 🎤 Elevator Pitch (1-Minute)
*   **🇺🇸 English:** "I built a centralized CI system that enforces development standards across the department. Instead of just running tests, it acts as a mandatory checkpoint for code quality. By automating Conventional Commits, building custom CHANGELOG validators, and enforcing rebase-only linear history, I reduced manual code review overhead by 30% and simplified the release auditing process. This framework eventually became the standard CI template for all new projects."
*   **🇹🇼 中文:** 「我主動重構了部門的 GitLab CI 體系，將其轉變為強制的品質守門員管線。透過自動化語意化提交驗證、自製 CHANGELOG 檢查工具與限制線性歷史紀錄，我減少了約 30% 的人工重複審核工作，並徹底解決了版本審計困難的問題。這套架構隨後成為部門內所有新專案的代碼集成標準。」

## 🚀 Google L4/L5 Behavioral & Architecture Deep Dive

### [L4/L5 Behavioral] Establishing Governance Without Authority (建立無授權治理框架)
*   **❓ Question:** "Tell me about a time you established standards or processes that influenced a larger team."
*   **🇺🇸 English Response:**
    *   **Context:** Different teams had completely different commit styles, no changelogs, and inconsistent merge strategies, making release auditing nearly impossible.
    *   **Action:** I proactively authored comprehensive documentation, built custom enforcement tooling as a Dockerized CI job (not just linter configs), and socialized it by demonstrating the ROI: "this auto-generates your release notes and prevents production auditing nightmares."
    *   **Impact:** Teams adopted the framework because the automation actually simplified their release tasks rather than just adding friction.
*   **🇹🇼 中文回應:**
    *   **情境:** 各個團隊提交風格各異，沒有隨版本更新的 Changelog，導致追蹤 Release 內容非常痛苦且難以審計。
    *   **行動:** 我主動開發了一套可複用的 Docker CI 任務。我不只寫文件，還向大家演示這套工具能「自動生成 Release Notes」並且「擋掉格式錯誤的提交」。
    *   **影響:** 團隊自願採納這套工具，因為它實質上減少了他們準備發布內容的時間，而不只是增加開發限制。這證明了「易用的工具」比「強制的規範」更能有效推行技術標準。

### [L4 Architecture] Shift-Left & Flaky Test Governance (左移策略與不穩定測試治理)
*   **❓ Question:** "End-to-end tests in CI are notorious for flakiness. How did you design the pipeline to distinguish real failures from transient environment issues without causing alert fatigue?"
*   **🇺🇸 English Defense:**
    *   "**Strict Retry Scoping:** Linting and unit tests never auto-retry—a failure means a real bug. Only jobs that depend on external infrastructure (Docker pulls, staging API calls) are configured with GitLab CI's `retry` parameter scoped exclusively to `runner_system_failure` or `api_failure` statuses."
    *   "**Flaky Test Quarantine:** Persistent flaky E2E tests get automatically moved to an 'allowed_to_fail' job with a Slack notification to the test owner—'retry is not a fix' is a hard team rule."
*   **🇹🇼 中文防禦:**
    *   「**嚴格限定重試範圍:** Lint 和單元測試永遠不自動重試——失敗就是有 Bug。只有依賴外部基礎設施的任務才配置 GitLab CI 的 `retry`，而且限定在 `runner_system_failure` 或 `api_failure` 狀態碼。」
    *   「**不穩定測試隔離:** 持續 Flaky 的 E2E 測試會被自動移到 `allowed_to_fail` 任務並透過 Slack 通知負責人——『重跑不是解法』是不可妥協的團隊規則。」

### [L5 Architecture] Scaling Runner Infrastructure (CI 基礎設施的規模化)
*   **❓ Question:** "As the engineering team triples, CI queues are constantly backed up. The monolithic GitLab Runner is at 100% CPU. How do you re-architect the runner infrastructure?"
*   **🇺🇸 English Defense:**
    *   "**Migrate to Docker-based Auto-Scaling Runners.** The GitLab Runner itself becomes a stateless Dispatcher. Each pipeline job provisions a fresh, ephemeral Docker container and tears it down afterward."
    *   "**Benefits:** Unlimited horizontal scalability, guaranteed clean slate for every job (no artifact leakage), and cost optimization via cluster auto-scaling (scale-to-zero during off-peak hours)."
    *   "**Trade-off:** Pod startup time adds ~30s latency vs. persistent shell runners—acceptable since this is amortized across CI jobs totaling tens of minutes."
*   **🇹🇼 中文防禦:**
    *   「**遷移到 Docker 自動擴展 Runner。** GitLab Runner 本身變成無狀態的 Dispatcher。每個 Pipeline 任務都動態創建全新的短暫 Docker 容器，執行完畢立即銷毀。」
    *   「**優點:** 無限水平擴展、每個任務都有 100% 乾淨的執行環境（無製品洩漏），以及透過叢集自動縮放節省成本（離峰縮至零節點）。」
    *   「**取捨:** Pod 啟動時間增加約 30 秒的延遲，相比於持久型 Shell Runner 略有增加——但相對於整個 CI 任務動輒數十分鐘的執行時間，這是完全可以接受的。」
