# 06. Influencing Others | 說服他人
## Project: GitLab CI/CD Governance (Standardization)

### 🎭 STAR Story (English)

*   **Situation**: 
    When I proposed the "Rebase-only" and "Linear History" policy for our GitLab repositories, there was significant pushback from the team. Developers were used to simple merges and felt that rebasing was too complex and risky for their workflow.
*   **Task**: 
    I needed to persuade the engineering team to adopt a stricter, but cleaner, version control standard.
*   **Action**: 
    Instead of just mandating the change, I focused on **education and proof-of-concept**. I created a short internal workshop demonstrating how linear history makes `git bisect` and rollbacks much faster. I then built the **automated gating scripts** in a "dry-run" mode first, showing developers the "messy" history they were creating without actually blocking them. Once the value was clear, I gained the lead engineers' support and rolled it out as a hard gate.
*   **Result**: 
    The team successfully transitioned to a 100% linear history workflow. Developers eventually appreciated the clarity, especially during production incidents where we needed to revert changes quickly.
*   **Learning**: 
    Influencing others is about aligning your goals with theirs. By showing how a "stricter" rule actually makes *their* lives easier during a crisis, you can turn resistance into support.

### ❓ 模擬問答 (Possible Q&A)

1.  **問：「除了線性歷史，你的『品質門禁 (Quality Gates)』還包含哪些具體項目？」(Engineering Standards)**
    *   **🇺🇸 English**: "I focused on **Information Transparency**. I implemented a mandatory **MR Template Validation** gate. Every Merge Request must include an Impact Analysis, Test Evidence, and a 'Definition of Done' checklist. If the template isn't correctly filled, the CI job fails. This simple gate reduced the 'Review-Ping-Pong' (back-and-forth comments) by 30% because reviewers had all the context they needed from the start."
    *   **🇹🇼 中文**: 「我專注於 **資訊透明度**。我實作了強制性的 **MR 模板驗證門禁**。每個 Merge Request 都必須包含『影響分析』、『測試證據』和『完成定義 (DoD)』清單。如果模板填寫不正確，CI 任務就會失敗。這個簡單的門禁減少了 30% 的『審核乒乓』（來回詢問），因為審核員從一開始就擁有了所需的完整上下文。」

2.  **問：「你是如何在大規模（多個專案）的環境下維護這些 CI 規則的？」(Scalable Governance)**
    *   **🇺🇸 English**: "I built a **Centralized CI Framework** using GitLab's remote include feature. Instead of each project having its own messy `.gitlab-ci.yml`, they all 'include' a version-controlled master template maintained by my team. This allows me to roll out new security scans or quality checks to 50+ repositories simultaneously with a single commit, ensuring unified engineering standards across the company."
    *   **🇹🇼 中文**: 「我利用 GitLab 的遠端包含 (Include) 功能建立了一個 **中央化 CI 框架**。與其讓每個專案都有自己混亂的 `.gitlab-ci.yml`，它們都統一『包含』一份由我團隊維護、具備版本控制的主模板。這讓我只需一次提交，就能將新的安全掃描或品質檢查推送到 50 多個倉庫，確保全公司擁有統一的工程標準。」

3.  **問：「AI 在你的品質門禁中扮演什麼角色？」(Innovation in QA)**
    *   **🇺🇸 English**: "AI acts as the **First Responder**. Before a human reviewer even opens the MR, OpenClaw AI performs a multi-dimensional analysis. It catches common logic flaws and formatting issues immediately. By the time the human arrives, the low-level noise is already cleared, allowing the senior engineers to focus on high-level architectural concerns."
    *   **🇹🇼 中文**: 「AI 扮演 **『第一響應者』** 的角色。在人工審核員打開 MR 之前，OpenClaw AI 會先進行多維度分析。它能立即抓出常見的邏輯漏洞和排版問題。當人工進入時，低階的噪音已經被清除，讓資深工程師能專注於高階的架構考量。」

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    當我提議在 GitLab 倉庫執行「Rebase-only」和「線性歷史」政策時，團隊產生了很大的阻力。開發者習慣了簡單的合併，覺得 Rebase 對他們的工作流來說太複雜且有風險。
*   **任務 (Task)**: 
    我需要說服工程團隊採納一套更嚴格、但也更乾淨的版本控制標準。
*   **行動 (Action)**: 
    我沒有直接下達指令，而是專注於 **「教育與原型驗證」**。我舉辦了一個內部工作坊，演示線性歷史如何讓 `git bisect` 和回滾變得更快。接著，我先以「試執行」模式建立了 **自動化門禁腳本**，向開發者展示他們正在製造的「混亂」歷史，但先不真正封鎖他們。當價值變得清晰後，我獲得了首席工程師的支持，並將其正式上線。
*   **結果 (Result)**: 
    團隊成功轉向 100% 線性歷史工作流。開發者最終體會到了這種清晰度的價值，特別是在需要快速撤回變更的生產事故中。
*   **反思 (Learning)**: 
    說服他人在於將你的目標與他們的利益掛鉤。透過展示「更嚴格」的規則如何讓他在危機時刻更輕鬆，你可以將阻力轉化為支持。
