# 技術架構審計：GitLab CD (自動化發布工程與 IaC)

本文件詳述了 **GitLab CD (Release Engineering)** 專案的實體架構與自動化發布實作細節。

---

## 1. 專案背景與核心挑戰
本系統旨在建立一套安全、低手動介入且具備追蹤能力的持續交付管道。主要的工程挑戰在於：
- **秘密資訊管理 (Secrets Exposure)**：在長期運作的 CI 管道中，靜態 SSH 金鑰的洩漏風險極高。
- **發布流程斷裂**：代碼合併後，版本標記 (Tagging) 與變更紀錄 (Changelog) 通常需要人工同步，導致交付一致性差。
- **Runner 環境碎片化**：不同專案需要的 Runner 環境（Docker, Shell）各異，手動配置 Runner 效率極低。

## 2. 技術架構 (Architecture)

### 2.1 動態 Runner 預置與 IaC (`gitlab_runner_create.py`)
- **實作架構**：
    - 利用 GitLab REST API v4 自動化管理專案生命週期。
    - **動態權限管理**：自動建立具備 `access_level: 40` (Maintainer) 的 Project Access Token，實現最小權限原則。
    - **遠程自動化配置**：使用 **Python Paramiko** 庫透過 SSH 登入目標伺服器，自動執行 `gitlab-runner register`，並動態修改 `/etc/gitlab-runner/config.toml` 中的 `concurrent` 併發數參數。這實現了 Runner 的全自動化生命週期管理。

### 2.2 元數據驅動的自動標記引擎 (`auto-tag.yml`)
- **邏輯描述**：
    - 流水線具備解析 **`CHANGELOG.md`** 的能力。透過正則表達式 (Regex) 自動提取最新版本號 (`## Version`) 與變更描述 (`### Description`)。
    - **自動化 Git 生命週期**：利用 OAuth2 Token 自動執行 `git tag -a` 與 `git push`，確保代碼庫的 Tag 與文檔永遠同步。
    - **Webhook 手法**：在 Tag 成功後，自動組合包含 URL-encoded 描述信息的 Payload，觸發遠端部署 Webhook (如 `10.140.100.24:5000`)。

## 3. 關鍵實作細節 (Implementation Details)
- **零信任部署轉譯**：
    - 將舊有的「CI 直接連入 Server」模型，轉化為「CI 觸發 Webhook，Agent 自行處理部署」的模型，從根本上消除了部署環境對外暴露 SSH 私鑰的需求。
- **多階段鏡像優化 (`docker-image/`)**：
    - 針對不同版本的 Python (2.7, 3.9) 實作了專屬的 `Dockerfile` 範本，強調 Build-time 的層級快取優化。

## 4. 工程價值 (Engineering Value)
- **資安與合規性**：透過 API 自動化與短期 Token 運作，符合企業級的安全性要求。
- **極致自動化**：發布流程從原本的「人工對帳、手動標記、執行腳本」縮短為「更新 CHANGELOG 後自動全量交付」，極大地提升了 Release Engineering 的可預測性。
