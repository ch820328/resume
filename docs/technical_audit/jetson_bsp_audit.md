# 技術架構審計：Jetson BSP (嵌入式生產與調度中台)

本文件詳述了 **Embedded BSP Factory** (Jetson BSP) 專案的後端架構、產線優化技術與硬體多樣性治理邏輯。

---

## 1. 專案背景與量產挑戰
在 NVIDIA Jetson 平台的產品化過程中，面對多樣化的客戶需求與 SKU，傳統的手動編譯流程存在以下瓶頸：
- **編譯與打包效率低下**：單一 RootFS 鏡像常達 5-8GB，傳統 Gzip 打包導致傳輸與燒錄時間過長。
- **硬體配置風險**：手動修改 BCT (Boot Configuration Table) 或 RAM Code 極易導致硬體 Bricking。
- **環境不一致**：30+ 工程師在不同環境下編譯導致產出的 BSP 鏡像存在潛在差異。

## 2. 技術架構 (Architecture)

### 2.1 全棧式編議調度引擎 (Build Orchestration)
- **Go (Gin) 後端中台**：
    - 系統核心由 Go 語言構建，實作了一個強韌的任務隊列 (Job Queue)，用於並行調度多個 L4T (Linux for Tegra) 編譯任務。
    - **數據庫驅動 (SQLite3)**：精確追蹤每筆「訂單」對應的 `RAM Code`、`BOARDID` 與編譯產物路徑。
- **前端控制台 (Vite/Vue)**：為工程師提供一鍵式 Web 介面，隱藏了底層複雜的 `source_sync.sh` 與 `flash.sh` 操作。

### 2.2 產線加速技術：Zstd 遷移 (UPH Optimization)
- **高性能壓縮策略**：
    - 主導將 RootFS 鏡像從 Gzip 遷移至 **Zstd (Zstandard)**。
    - **成效**：鏡像體積縮減 30% 以上。由於 Zstd 極快的解壓速度，在工廠燒錄端顯著縮短了磁碟 I/O 時間，直接提升了 **UPH (Units Per Hour)** 達 25%。

### 2.3 硬體多樣性治理 (SKU Governance)
- **SKU 自動化感知**：
    - 系統會根據數據庫中的 **RAM Code** 與 **BOARDID** 自動注入特定的 Patch 與編譯參數。
    - **防呆安全機制**：在執行 MassFlash Image (MFI) 打包前，會強制進行硬體 ID 比對，確保 0000 的韌體不會被燒錄到 0001 的機台上。

### 2.4 量產鏡像工廠 (MFI Factory)
- **MassFlash Orchestration**：
    - 自動化生成包含 Kernel、Bootloader 與客製化 RootFS 的 MFI Tarball。
    - 支援工廠並行燒錄 (Parallel Flashing)，單一工作站可通過 USB Hub 同時對多台機台進行燒錄，極大化生產效率。

## 3. 面試價值亮點 (Interview Values)
- **工業級自癒架構**：實作 A/B Partition (Redundancy) 策略，確保邊緣運算設備在極端環境下的部署安全性。
- **從研發到產線的閉環**：展現了不僅能寫驅動代碼，更能優化整個產品生命週期 (Manufacturing Lifecycle) 的架構師視野。
- **數據驅動決策**：透過 Benchmark 說服各部門導入 Zstd，展現了技術領導力。
