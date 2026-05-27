# Google 面試深度準備指南：Software Engineer, Fuchsia (CI/CD & Infrastructure)

這份指南針對 Google **Software Engineer, Fuchsia** 職缺所設計。請注意，雖然抬頭是軟體工程師，但細看 JD 內容，這實際上是一個高度偏向 **DevOps / CI/CD Infrastructure / Build & Release Engineering** 的職位。這與你在基礎設施自動化、CI/CD 與內部工具開發的經驗**完美契合**！

---

## 1. 角色破題與面試核心策略

### 1.1 這到底是一個什麼職位？
Fuchsia 是 Google 開發的開源作業系統。一個 OS 的程式碼庫極度龐大，牽涉數百個模組與跨團隊協作。這個職位的主要任務是：**打造並維護 Fuchsia 團隊專用的 CI/CD 系統與建置工具 (Build Systems)**，讓其他核心開發者能順利且安全地提交程式碼。

### 1.2 面試主軸 (與你的履歷完美對應)
你必須將自己定位為一個「**用軟體工程思維解決維運與部署痛點的工程師 (Infrastructure as Code)**」。
*   對應專案：`Secure CD & Automated Release Engineering`, `GitLab CI Automated Quality Gate`, `Test-Driven Infrastructure as Code (Ansible)`。
*   主攻語言：Python 與 Go (JD 明確要求)。這剛好是你的強項，面試時請強調你如何用 Go 寫高效能的並發工具，用 Python 寫靈活的自動化腳本。

---

## 2. 建置系統與版本控制 (Build Systems & VCS)
對於作業系統等級的專案，如何有效率地「拉 Code」跟「Build Code」是極大挑戰。

### 2.1 版本控制與相依性管理 (Git & Git-Submodules)
*   **情境**：Fuchsia 包含大量的第三方套件與驅動程式，通常會使用 Git Submodules 或 Google 內部的 Repo tool (類似 Android) 來管理多個 repositories。
*   **面試深挖**：
    *   了解 Git 的底層運作 (Trees, Blobs, Commits)。
    *   如何解決 submodule 版本脫鉤 (version drift) 的問題？
    *   **你的武器**：分享你如何在 CI Pipeline 中強制檢驗 Conventional Commits，以及如何撰寫 Python 腳本來自動同步/檢驗 Code 與文件的更新 (`GitLab CI Automated Quality Gate` 專案)。

### 2.2 建置系統 (Bazel)
*   **概念**：Bazel 是 Google 開源的高效能 Build System。它的核心哲學是：**Hermetic (密封性)** 與 **Reproducible (可重現性)**。
*   **面試深挖**：
    *   為什麼大專案不用 Make 或 CMake，而要用 Bazel？(因為 Bazel 透過精準的相依性圖譜 Dependency Graph，只重新編譯有改動的部分，並支援雲端分散式編譯 Remote Execution)。
    *   *準備建議*：如果沒用過 Bazel，務必去了解它的基本概念 (WORKSPACE, BUILD files, Targets, Rules)。
    *   **你的武器**：將 Bazel 的「密封性」概念對比你使用 Ansible/Molecule/Docker 建立 `Test-Driven Infrastructure` 的經驗——目的都是為了解決環境不一致 (Environment Drift) 的問題。

---

## 3. CI/CD 架構與雲端基礎設施 (CI/CD & Cloud Infra)
這是此職缺的重中之重："centralize and standardize CI and Infra tooling"。

### 3.1 CI/CD 流水線設計
*   **痛點**：每個團隊自己寫自己的 Jenkinsfile 或 .gitlab-ci.yml，導致重複造輪子且難以維護。
*   **深度解法 (你的強項)**：
    *   設計模組化、可共用的 CI/CD Templates。
    *   **你的武器**：向面試官展示你如何建立 `GitLab CI Automated Quality Gate`。你是如何從混亂的手動審查中，抽出共同邏輯（Linting、Rebase status、Commit format），將其容器化 (Dockerized Runners) 並強制套用到所有微服務上，藉此降低技術債 (Technical Debt)。

### 3.2 雲端自動化 (GCP: GCE, GCS, IAM)
*   **概念**：Fuchsia 的 CI 跑在 GCP 上。你需要了解基礎的 GCP 服務操作。
*   **面試深挖**：
    *   **GCE (Compute Engine)**：如何透過 API 動態開關 VM 進行測試 (Auto-scaling CI runners)。
    *   **GCS (Cloud Storage)**：用來存放 Build 出來的 Artifacts (Packages, OS images)。
    *   **IAM (Identity and Access Management)**：權限控管 (對應 JD 的 ACL permissions)。確保 CI Runner 只有最低權限 (Least Privilege) 只能上傳檔案，不能刪除。

---

## 4. 基礎設施安全 (Security in CI/CD)
JD 特別強調："reduce the incidence of security bugs in the CI and Infrastructure services"。軟體供應鏈安全 (Supply Chain Security) 是近年的絕對重點。

### 4.1 安全的自動化發布 (Secure Release Engineering)
*   **痛點**：傳統部署依賴長期的 SSH 金鑰，容易外洩，且缺乏稽核追蹤 (Audit trail)。
*   **深度解法 (你的武器)**：
    *   拿出你的 `Secure CD & Automated Release Engineering` 專案！
    *   **設計細節**：向面試官講解你如何「拔掉」高風險的 SSH Access，改用 Webhook-based 的 Deployment Agent 來觸發內部 API 進行部署。這完美展示了你對 Infrastructure Security 的實務經驗。
    *   強調你導入 **Semantic Versioning** 結合 CHANGELOG 解析，確保發布過程是自動且防呆的，消除了人為操作帶來的安全漏洞。

### 4.2 權限與套件管理 (Package Server Management & ACL)
*   **概念**：保護 Package Server 不被惡意竄改（類似防止 SolarWinds 事件）。
*   **設計**：實作嚴格的 Role-Based Access Control (RBAC) 與 IAM 政策，確保只有通過所有 CI 測試的 Service Account 才能對 Package Server 進行寫入。

---

## 5. 開發與跨團隊協作 (Coding & Collaboration)

### 5.1 Python 與 Go 的應用場景
*   **Go (Golang)**：適合用來寫高效能、並發能力強的底層 CLI 工具、部署代理程式 (Deployment Agent) 或是 Webhook Server。你的 `Unified Engineering Productivity Portal` 後端就是絕佳證明。
*   **Python**：適合寫 CI/CD 流程中的膠水程式 (Glue code)、資料解析腳本、以及與 GCP API 互動的自動化任務。你的 `Cross-Interface Consistency Validation Framework` (Strategy Pattern) 展現了你寫高質量 Python 的能力。

### 5.2 軟實力：解決技術債與推動標準化
JD 提到："Address technical debt... Collaborate with partner development teams to understand needs."
*   **面試答題策略 (STAR)**：
    *   **情境 (Situation)**：跨部門團隊各自使用不同的工具，效率低落且充滿技術債。
    *   **任務 (Task)**：你需要統一工具鏈，但又沒有絕對的管理權限。
    *   **行動 (Action)**：描述你如何主動訪談 (Understand needs)，找出共同痛點，然後開發了 `Unified Engineering Productivity Portal`。你整合了 WebSSH、Redfish API，讓 junior 工程師也能「一鍵 Debug」。
    *   **結果 (Result)**：不僅減少了 40% 的 Setup time，更成功說服其他團隊放棄舊工具，主動採用你的標準化方案。這個故事完美命中 Google 對 "Leadership" 與 "Collaboration" 的期待。

---

## 🚀 週末實戰學習計畫 (Actionable Weekend Study Plan)

為了把上述概念內化，建議你在這個週末執行以下「小而美」的實作練習：

### [任務 1] Bazel 建置系統初體驗
*   **Action**：完成官方的 Bazel Tutorial (選擇 Python 或 Go 版本)。
*   **Goal**：
    1. 了解 `WORKSPACE` 和 `BUILD` 檔案的作用。
    2. 成功用 `bazel build` 編譯出一個執行檔。
    3. 思考：如果這個專案有 1000 個依賴，Bazel 的 Dependency Graph 是如何做到只編譯改動過的程式碼的？

### [任務 2] Git Submodules 進階操作
*   **Action**：在本地端建兩個 Git Repositories，把 A 當作 B 的 submodule 加入。
*   **Goal**：
    1. 練習 `git submodule update --init --recursive` 指令。
    2. 刻意製造 Submodule "Detached HEAD" 狀態，並想辦法修復它。
    3. 思考：在 CI Pipeline 裡面拉 code 時，如果 submodule 的 commit 已經不存在於遠端了（例如被 force push 蓋掉），CI 會報什麼錯？該如何設計 CI 去提早攔截？

### [任務 3] 軟體供應鏈安全 (SLSA) 知識補齊
*   **Action**：閱讀 Google SLSA (Supply-chain Levels for Software Artifacts) 框架的官方文件。
*   **Goal**：
    1. 了解 SLSA Level 1 到 Level 4 的差異。
    2. 把你在 `GitLab CI Automated Quality Gate` 做的防呆機制，對應到 SLSA 的哪一個層級（例如：有沒有做到 Provenance, Hermetic build？）。
    3. 這會是面試中展現你對 Security 有宏觀視野的最佳武器。

### [任務 4] GCP IAM 與 Workload Identity 概念演練
*   **Action**：如果你有 GCP 帳號，去開一個 Service Account；如果沒有，畫白板推演。
*   **Goal**：
    1. 了解 User Account 與 Service Account 的區別。
    2. 了解傳統「給 CI/CD 系統一組寫死且永不過期的 JSON Key」有多危險。
    3. 研讀 GCP 的 **Workload Identity Federation**（或類似的 OIDC 機制），了解 CI/CD 如何安全地透過短效 Token 向 GCP 取得暫時權限。這完全對應 JD 的 "reduce security bugs in Infrastructure services"！
