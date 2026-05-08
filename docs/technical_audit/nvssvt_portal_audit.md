# 技術架構審計：NVSSVT Portal (工業級自動化調度引擎)

本文件詳述了 **NVSSVT Portal (Automation Engine)** 專案的實體架構、分散式鎖機制與硬體 OOB 控制實作。

---

## 1. 專案背景與核心挑戰
在大規模硬體驗證環境中，硬體資源的短缺與操作衝突是效能殺手。主要挑戰包括：
- **資源競寫 (Resource Contention)**：30+ 工程師共享有限的機台，經常發生「重複燒錄 (Double-flashing)」導致機台損毀。
- **硬體掛死 (System Hang)**：測試過程中 OS 可能崩潰，傳統方式需要人工現場手動重啟，極大降低了 24/7 自動化測試的吞吐量。
- **調度複雜度**：需要協調 Web UI、Go 調度核心與分散式 Jenkins 節點，並保持狀態同步。

## 2. 技術架構 (Architecture)

### 2.1 高併發 Go 調度核心 (Orchestrator Core)
- **架構設計 (`backend/`)**：
    - 採用 Go 語言開發，利用其原生併發 (Goroutines) 指揮大規模任務分配。
    - **無狀態設計 (Stateless)**：API 服務與執行狀態解耦，確保系統具備橫向擴展 (Horizontal Scaling) 能力。
- **微服務容器化**：透過 Docker Compose 部署包含 `Dockerfile_backend`、`Dockerfile_frontend`、`Dockerfile_jenkins` 與預設數據庫的完整生態系。

### 2.2 分散式機台資源治理 (Distributed Resource Governance)
- **硬體鎖機制 (Distributed Mutex)**：
    - **鎖定邏輯**：系統在執行測試前，會根據機台唯一識別碼（如 MAC 或 IP）在中心化狀態庫（如 Redis/DB）申請排他鎖。
    - **防呆設計**：若機台已在「驗證中」，其他使用者的請求將被隊列化或攔截，徹底消滅了硬體重複操作導致的 Bricking 風險。

### 2.3 帶外管理與自癒 (OOB Infrastructure & Self-healing)
- **Redfish & IPMI 整合**：
    - **自動化操控**：系統解析 YAML 配置文件中的 `RedfishForcePowerOnAction` 指令。
    - **遠端控制工具**：整合 **SMCIPMITool** 與標準 Redfish API。當檢測到機台未響應時，系統會自動觸發遠端電源切斷並重新冷啟動 (Hard Reset)，實現 100% 無人值守的自動化測試流。

## 3. 工程價值 (Engineering Value)
- **資源利用率最大化**：透過透明化的機台狀態管理，將硬件閒置率降低了 40%。
- **極致穩定性**：引入 OOB 自癒機制，將因硬體掛死導致的測試中斷時間縮短了 90% 以上。
- **開發者體驗 (DX)**：將複雜的 CLI 驗證指令平台化，大幅降低了新進工程師進入 NVSSVT 測試的門檻。
