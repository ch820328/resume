# 技術架構審計：Central Dashboard (可觀測性與全棧編排基礎設施)

本文件詳述了 **Central Dashboard (Engineering Hub)** 專案的實體架構與跨平台編排 (Orchestration) 實作細節。

---

## 1. 專案背景與核心挑戰
本系統旨在消除硬體研發流程中的工具鏈碎片化問題。主要的工程挑戰在於：
- **除錯閉環缺失**：工程師在查看日誌後，通常需要跳轉至終端機或 FTP 工具進行文件操作，流程不連貫。
- **異構觀測難度**：Jenkins (編譯)、Docker (執行環境)、Redmine (管理) 以及 BMC (硬體) 的數據缺乏統一的聚合入口。

## 2. 技術架構 (Architecture)

### 2.1 基於 SSH 的虛擬文件系統 (Web-based File Explorer)
- **實作邏輯**：
    - 後端提供 `ssh/file_list`、`ssh/read_file` 與 `ssh/download_file` 等 RESTful 端點。
    - **傳輸協議**：透過 Go 的 `sftp` 或遠端執行 `ls/cat` 命令抓取數據，並在後端將檔案流封裝為二進制 Blob 傳送至 Angular 執行下載。
    - **優點**：工程師能直接在瀏覽器對遠端機台進行日誌瀏覽、刪除或抓回本地分析，無需開啟額外的 FTP 用戶端。

### 2.2 跨平台工具鏈編排 (Integrated Orchestration)
- **Docker 帶外觀測 (OOB Observability)**：
    - 透過 `ssh/docker/get_container_names` 繞過遠端主機可能未開啟的 Docker Registry API，直接透過 SSH 通道執行命令來獲取容器狀態與 Log 流。
- **Jenkins 實時日誌流**：
    - 實作 `jenkins_console_text` 接口，動態抓取 CI 伺服器的 Console Output，實現一站式的編冊與除錯體驗。
- **Redmine 兩向同步**：
    - 透過 `redmine/update_issue` API，實現在 Dashboard 內直接標註除錯進度或更新 Bug 狀態，打破了管理工具與技術工具的壁壘。

### 2.3 硬體周邊控制：Raspberry Pi 整合
- **Pi-gen 控制模組**：
    - 實作了 `raspberry_pi/screen_sendword` 等專屬接口，透過網頁端控制 Pi-box 的螢幕顯示與指令輸入，這在 Headless 裝置的初期啟動偵錯中至關重要。

## 3. 關鍵實作細節 (Implementation Details)
- **Blob 檔案下載處置 (Angular)**：
    - 前端使用 `HttpClient` 定義 `responseType: 'blob'`，並透過 `window.URL.createObjectURL` 觸發安全下載，有效解決了大檔案傳輸時的內存溢出風險。
- **動態 Admin 全面管理 (CRUD Engine)**：
    - 實作了 `admin/data` 接口，支持對後端資料庫所有 Table 的動態增刪改查，實現了自定義的後台管理功能。

## 4. 工程價值 (Engineering Value)
- **生產力倍增器 (Force Multiplier)**：透過整合檔案管理、容器監控與 CI 狀態，將原本分散的操作整合為一個 Closed-loop 的研發環境。
- **技術普惠**：讓不熟悉 Docker 或單雜命令的新進工程師，也能透過視覺化介面輕鬆執行高級調試任務。
