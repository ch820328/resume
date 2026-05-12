# 技術架構審計：Baby Tracker (分散式離線優先同步系統)

本文件詳述了 **Baby Tracker** 專案的實體架構與工程實作細節，用於面試回顧與技術存檔。

---

## 1. 專案背景與核心挑戰
本系統是一個為多設備設計的即時記錄系統，旨在提供強大的離線可用性與多端數據一致性。主要的工程挑戰在於：
- **異構同步 (Heterogeneous Sync)**：客戶端（React Native SQLite）與服務端（Node.js PostgreSQL）的數據 schema 不同。
- **高併發數據完整性**：多人同時編輯同一條記錄（如同時更新體溫）時的 Race Condition 處理。
- **低階設備性能瓶頸**：針對舊款 Android 設備的數據處理效率。

## 2. 技術架構 (Architecture)

### 2.1 離線優先同步代碼邏輯 (Offline-First Sync)
- **Delta Sync 算法**：不傳送全量數據，而是透過 `lastPulledAt` 時間戳抓取差異數據 (Delta)。
- **推送流程 (Push Logic)**：
    1.  客戶端標記 `dirty` 旗標。
    2.  將變動包裝成 JSON 透過 WebSocket 或 REST API 發送。
    3.  服務端執行 SQL 事務 (Transaction) 原子性寫入。
- **拉取流程 (Pull Logic)**：
    1.  客戶端請求 `sync_check`。
    2.  服務端查詢 `updated_at > lastPulledAt` 的記錄。
    3.  返回變動清單並在客戶端 SQLite 執行 Upsert (Update or Insert)。

### 2.2 鎖定機制：Redis 階層鎖 (Hierarchical Locking)
- **實作模組**：`RedisLockService.ts`。
- **邏輯描述**：
    - 使用 **Redis Lua Script** 確保原子性。
    - **Root/Leaf 模型**：更新數據前先對 Parent ID 進行 Read Lock (Shared Lock)，對當前數據 ID 進行 Write Lock (Exclusive Lock)。
    - **回退機制**：實作指數加權退避 (Exponential Backoff)，避免死鎖。

## 3. 關鍵實作細節 (Implementation Details)
- **JSI (JavaScript Interface) 優化**：
    - 直接在 C++/Rust 層級與 Android 宿主環境通訊，繞過 React Native Bridge 的序列化開銷，將數據處理速度提升 2~3 倍。
- **IDOR 防護 (Auth Middleware)**：
    - 使用 Prisma Middleware 統一攔截 SQL 請求，自動在 `WHERE` 子句中注入 `familyId`，防止越權訪問 (IDOR)。
- **Artillery 負載測試**：
    - 模擬高併發 WebSocket 連線，測試伺服器在 1000+ 同步請求下的內存佔用與鎖定競爭率。

## 4. 工程價值 (Engineering Value)
- **高性能數據一致性**：在高併發環境下達成 100% 數據正確性。
- **無縫用戶體驗**：支援極端弱網環境下的數據暫存與自發性重連同步。
