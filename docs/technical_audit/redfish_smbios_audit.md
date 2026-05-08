# 技術架構審計：Redfish SMBIOS Check (一致性治理框架)

本文件詳述了 **Consistency Transformation Framework** (Redfish SMBIOS Check) 專案的實體架構、主動式驗證機制與計算機視覺適配技術。

---

## 1. 專案背景與核心挑戰
在伺服器 L10/L11 生產與驗證過程中，資訊一致性是最高品質指標。主要挑戰包括：
- **數據傳播時差 (Propagation Latency)**：物理層 FRU/SMBIOS 的變更是否能實時、準確地反映在 BMC Web 與 Redfish API 中。
- **介面異質性 (Interface Heterogeneity)**：BMC 存在多個版本（如 Supermicro V1/V2），傳統的自動化腳本難以在不同介面間維持強韌性 (Robustness)。
- **靜態驗證的侷限**：單純的讀取無法測試「寫入後同步」的動態穩定性。

## 2. 技術架構 (Architecture)

### 2.1 主動式同步驗證 (Active Synchronization Validation)
- **隨機數據注入 (`check_point_1`)**：
    - 系統利用 **SMC SUM** 工具 (`ChangeFruInfo`)，主動將亂序產生的 UUID 或特定字串寫入物理機台的 FRU0 存儲。
    - **價值**：這超越了傳統的「唯讀核對」，轉化為主動的「數據流壓力測試」，確保從底層硬體到頂端管理介面的傳播鏈結 100% 正確。
- **三向核對演算法 (3-Way Reconciliation)**：
    - 同步比對物理層紀錄 (Source of Truth)、BMC Web (Scraped via Selenium) 與 Redfish JSON 數據。

### 2.2 計算機視覺介面辨識 (CV-Driven Adaptation)
- **視覺版本感知**：
    - 在 Selenium 登入階段，系統對 BMC 登入頁面進行截圖，並利用 **OpenCV (`matchTemplate`)** 進行模板比對。
    - **動態工廠模式 (`BmcSeleniumFactory`)**：根據視覺辨識結果，自動實例化對應的驅動類別 (`BmcV1Selenium` 或 `BmcV2Selenium`)，確保了在無預警韌體更新下的自動化強韌性。

### 2.3 異質數據採集與清洗 (Heterogeneous Scaper)
- **Selenium 深度操控**：
    - 處理了複雜的 iFrame 切換、等待 JS 載入狀態 (`readyState`) 與 BlockUI 遮罩處理。
    - **數據映射 (Data Mapping)**：將 Web UI 上的非標準欄位名稱精確映射至標準化的 FRU/SMBIOS 邏輯模型。

## 3. 工程價值 (Engineering Value)
- **出廠品質保障**：確保機台出廠時，客戶不論從哪個介面看到的資訊（Serial Number, Asset Tag）均完全一致。
- **全自動化驗證流**：整合多 Agent 指令（SUM, IPMI, Selenium），實現了從「底層更新」到「介面核對」的封閉式自動化測試流。
- **高強韌性設計**：透過 OpenCV 解決了傳統 Selenium 腳本對 Element ID 度依賴的問題，大幅降低了 UI 變動導致的維護成本。
