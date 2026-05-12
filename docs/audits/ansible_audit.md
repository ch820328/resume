# 技術架構審計：Ansible 分散式壓力測試系統 (Ansible Stress Test)

本文件詳述了 **Ansible Stress Test** 專案的實體架構與工程實作細節，用於面試回顧與技術存檔。

---

## 1. 專案背景與核心挑戰
本系統旨在模擬真實世界的跨來源併發流量，針對 Web Service 執行壓力測試。主要的工程挑戰在於：
- **流量去中心化 (Resource Decentralization)**：單台高效能伺服器產生的流量來源受限（單一 IP、單一網卡隊列），無法模擬真實的分散式 Stress。
- **環境一致性 (Environment Drift)**：在 10+ 台不同環境的 VM 上手動部署測試工具鏈（Python, Dependencies, Scripts）極易出錯且耗時。

## 2. 技術架構 (Architecture)

### 2.1 部署與執行解耦 (Decoupling)
系統設計將「環境建設」與「壓力注入」完全分離：
- **環境預置 (Provisioning)**：使用 **Ansible Playbooks**。負責將所有 Slave VM 的 OS 環境標準化、安裝測試腳本與必要的 Python 依賴。這保證了 10 台 VM 的測試基線完全一致。
- **執行邏輯 (Execution Loop)**：測試啟動後，Ansible 不再參與執行動態。Slave 機台本地的 Python 腳本會獨立運行，以避開 Ansible 連線開銷對測試數據的干擾。

### 2.2 負載注入模型 (Load Injection Model)
- **橫向擴展 (Horizontal Scaling)**：部署 10 台 VM 作為 Load Generators。
- **縱向併發 (Vertical Concurrency)**：每台 VM 內部執行 5 個獨立進程（Processes）。
- **總負載規模**：50 個併發 Stress 來源，每個進程持續對 Target Web Service 發起非同步請求。

## 3. 關鍵實作細節 (Implementation Details)
- **多來源併發策略**：
    - 採用各別 VM 獨立執行的方案，取代單機高效能方案，確保壓力分布於不同的虛擬交換機與網路節點，提高 Stress 的真實感。
- **自動化 Pipeline**：
    - 使用 Ansible 的 `copy` 與 `shell` 模組自動分發 Python 腳本，並利用 `nohup` 或系統服務讓測試獨立於 SSH 會話運行。

## 4. 工程價值 (Engineering Value)
- **環境自癒性**：即便某台 VM 損毀，透過 Ansible Playbook 可以在 3 分鐘內重新拉起一台具備相同負載能力的 Load Generator。
- **可預期性 (Determinism)**：透過代碼化的環境配置，消除了環境變因對測試結果的影響。
