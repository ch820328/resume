# 技術架構審計：Issue Trend Analytics (工程治理中心)

本文件詳述了 **Issue Trend Analytics (Engineering Governance Hub)** 專案的實體架構、自動化排程審計機制與多維度指標工程。

---

## 1. 專案背景與核心挑戰
在複雜的硬體開發與韌體驗證環境中，數據碎片化（Data Fragmentation）是最大的管理障礙。主要挑戰包括：
- **資訊煙囪 (Data Silos)**：專案狀態散落在 Redmine、Jira-style Project Boards 與 SVN/Git 提交紀錄中。
- **審計成本高昂**：人工追蹤上千個工單的「健康狀況」極度耗時，且具備主觀偏差。
- **反應遲緩**：缺乏預警機制，往往在問題爆發後才被動處理。

## 2. 技術架構 (Architecture)

### 2.1 無人值守治理引擎 (Unattended Governance Engine)
- **自動化排程 (`Console/Kernel.php`)**：
    - **正式週審計 (`--formal`)**：設定於每週一 08:00 自動執行，確保週會前所有團隊的 KPI 數據已完成最新清洗與評分。
    - **高階月匯總 (`--high_level`)**：設定於每月最後一天 22:00，產出趨勢分析供高層決策使用。
    - **價值**：透過定時排程消除了人工干預，建立了系統化的「自動問責 (Automated Accountability)」機制。

### 2.2 多維度規則與評分引擎 (`KpiService.php`)
- **啟發式風險偵測 (Heuristic Risk Detection)**：
    - **規則代號化**：定義了如 `B-1/B-2` (BIOS 團隊)、`T-1/T-2` (工具團隊)、`V-3` (測試驗證) 等具體品質規則。
    - **「不健康度」計算公式**：`Score = (1 - (Unhealthy Count / Total Count))`。
    - **判定邏輯**：系統自動根據工單狀態、最後更新時間與逾期天數 (`expired_days`) 標記「不健康」任務，並直接在報表中標紅示警。

### 2.3 異質資料標準化 (Data Normalization Layer)
- **多源對接能力**：
    - **Redmine API**：抓取工單內容與變更紀錄。
    - **Project Board**：整合 Jira 風格的看板任務。
    - **Telemetry & Logs**：匯入 ATS 驗證日誌與 SVN/Git Log，實現對「代碼開發動能」與「實際驗證結果」的同步追蹤。
- **轉接器模式 (Adapter Pattern)**：透過 `CommonHelper::usernameAdapter` 等模組，統一跨平台的開發者識別識別碼，解決數據對齊難題。

## 3. 工程價值 (Engineering Value)
- **決策透明化**：將抽象的「開發忙碌感」轉化為精確的「達標率 (Criteria = 90%)」，大幅提升管理透明度。
- **風險預警 (Proactive Warning)**：透過自動化腳本及早發現長期停滯的任務，將風險控制在萌芽階段。
- **維運標準化**：利用 Laravel 穩定的後端架構，支撐起覆蓋數百名工程師、上千個專案的大規模治理需求。
