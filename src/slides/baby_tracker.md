# 面試備忘錄：Baby Tracker (選型與整合實戰)

這張投影片的核心在於：**展示你如何「聰明選型」並在資源受限的環境下解決實際的同步衝突問題。**

---

### 1. 💬 口語說明 (Colloquial Explanation)

*   **🇺🇸 English (Simple & Direct):**
    "I built a synchronization system for a 'Baby Tracker' app to help family members log activities together in real-time. The main challenge was keeping data consistent across multiple devices while keeping the app fast on older phones. I chose **WatermelonDB** because of its **JSI** technology, which allows the app to handle large amounts of data without lagging. I also used **Redis** on the backend to prevent data from being overwritten when two people try to update the same record at the same time."
    
*   **🇹🇼 中文 (口語精簡):**
    「我為 Baby Tracker 開發了一套同步系統，方便家人一起實時記錄寶寶狀況。主要的挑戰是在網路不穩或多台設備同時操作時，如何保證數據一致，且在舊手機上也要跑得順。我選用了 **WatermelonDB**，利用它的 **JSI** 技術讓 App 處理大量數據時不會卡頓。後端我則用 **Redis** 來處理併發衝突，確保兩個人同時修改時，數據不會互相覆蓋。」

---

### 2. ❓ 模擬問答 (Possible Q&A - Google/Amazon Hybrid Strategy)

1.  **問：「為什麼選 WatermelonDB 而不是直接用 SQLite 或 Realm？」(Invent and Simplify / Trade-offs)**
    *   **🇺🇸 English**: "I prioritized **UI Responsiveness** and **Offline-First** architecture. Standard SQLite via a bridge is slow in React Native. WatermelonDB uses **JSI (JavaScript Interface)** to communicate directly with the underlying database, bypassing the bridge's serialization overhead. It simplified my sync logic while providing the best performance for the user."
    *   **🇹🇼 中文**: 「我優先考慮 **UI 響應速度** 與 **離線優先 (Offline-First)** 架構。在 React Native 中，透過 Bridge 使用標準 SQLite 會很慢。WatermelonDB 利用 **JSI** 直接與底層資料庫通訊，繞過了 Bridge 的序列化開銷。這在提供最佳效能的同時，也簡化了我的同步邏輯。」

2.  **問：「在開發這套同步系統時，你遇到的最大挫折是什麼？」(Inner Monologue)**
    *   **🇺🇸 English**: "I initially struggled with 'Race Conditions' where two parents would log a feeding at the exact same time. I felt the pressure of potentially losing critical baby data. I realized that 'Client-side only' logic wasn't enough. I had to rethink the backend and introduce **Atomic Locking with Redis**. It was a tough lesson in distributed systems, but it made the app rock-solid."
    *   **🇹🇼 中文**: 「我最初在處理『競爭狀態』時遇到很大挫折，比如父母兩個人同時紀錄餵奶時間。我當時很擔心會遺失關鍵的寶寶數據。我意識到只靠『前端邏輯』是不夠的，我必須重構後端並引入 **Redis 原子鎖**。這對我來說是分散式系統的一堂硬課，但它讓 App 變得非常穩固。」

3.  **問：「舊手機跑這套系統會卡嗎？你做了哪些效能優化？」(Dive Deep / Performance Awareness)**
    *   **🇺🇸 English**: "Performance on low-end devices was a key requirement. Beyond using JSI, I implemented **Lazy Loading** for all lists. We only load data that is visible on the screen. I also profiled the JS thread and found that heavy object mapping was a bottleneck, so I optimized our data models to be more 'flat' to reduce GC pressure."
    *   **🇹🇼 中文**: 「低階設備的效能是關鍵需求。除了使用 JSI，我還實作了所有列表的 **Lazy Loading (懶加載)**。我們只載入螢幕可見的數據。我還剖析了 JS 執行緒，發現重型的物件映射 (Mapping) 是瓶頸，所以我優化了數據模型，使其更『扁平』以減少 GC (垃圾回收) 壓力。」

4.  **問：「你如何保證家庭數據的安全性，不讓 A 看到 B 的資料？」(High Standards / Ownership)**
    *   **🇺🇸 English**: "Data privacy for families is non-negotiable. I implemented **IDOR protection** at the database layer using Prisma Middleware. Every query is automatically scoped to the user's `family_id`. I also wrote automated **Security Integration Tests** to verify that a user with an unauthorized token would get a 403 error immediately."
    *   **🇹🇼 中文**: 「家庭數據的隱私是不容妥協的。我利用 Prisma Middleware 在資料庫層實作了 **IDOR 防護**。每一筆查詢都會自動被鎖定在該使用者的 `family_id` 範圍內。我還寫了自動化**安全性整合測試**，確保任何持有未授權 Token 的使用者都會立刻收到 403 錯誤。」

5.  **問：「這段個人開發經驗，對你在 Google 處理大規模 Infra 有什麼幫助？」(Future Pacing)**
    *   **🇺🇸 English**: "It taught me to be 'Product-Minded.' Even in Infra, the end goal is always the user experience. At Google, I will use this 'Performance-First' mindset to build infrastructure that isn't just scalable, but also provides the lowest possible latency for our end users."
    *   **🇹🇼 中文**: 「這教會我具備『產品思維』。即使是在 Infra 領域，終極目標永遠是使用者體驗。在 Google，我會利用這種『效能優先』的思維來建立基礎設施，不僅要具備擴展性，還要為我們的最終使用者提供最低的延遲。」

6.  **問：「你是如何驗證你的同步邏輯在網路極差的情況下依然有效？」(Dive Deep / Learn and Be Curious)**
    *   **🇺🇸 English**: "I used **Network Throttling** tools to simulate 2G and high-latency environments. I specifically tested the 'Conflict Resolution' logic by making simultaneous edits while the app was offline. This 'stress testing' gave me the confidence that our sync model could handle real-world messy connectivity."
    *   **🇹🇼 中文**: 「我使用了 **Network Throttling (網路限流)** 工具來模擬 2G 和高延遲環境。我特別測試了在 App 離線時進行同時編輯的『衝突解決』邏輯。這種『壓力測試』給了我信心，讓我們知道同步模型能應付現實世界混亂的連線狀況。」

---

### 3. 📚 技術名詞解析 (Technical Glossary)

*   **🇺🇸 JSI (JavaScript Interface) / 🇹🇼 JS 介面**:
    A new layer in React Native that allows JavaScript to call C++ methods directly, bypassing the asynchronous bridge. (React Native 中的新層級，允許 JS 直接呼叫 C++ 方法，繞過非同步 Bridge 以提升效能。)
*   **🇺🇸 Race Condition / 🇹🇼 競爭狀態**:
    A situation where the outcome of a process depends on the timing or sequence of other events. (當程序的結果取決於其他事件發生的時機或順序時，所產生的不確定狀態。)
*   **🇺🇸 IDOR (Insecure Direct Object Reference) / 🇹🇼 不安全的直接物件參照**:
    A security vulnerability where an application provides direct access to objects based on user-supplied input. (一種安全性漏洞，應用程式根據使用者輸入直接提供物件存取權，未進行適當權限檢查。)
*   **🇺🇸 Offline-First / 🇹🇼 離線優先**:
    A design approach where an app is built to function fully without an internet connection, syncing data once it's back online. (一種設計方法，讓 App 在無網路時也能完全運作，並在連線後同步數據。)
*   **🇺🇸 GC Pressure (Garbage Collection Pressure) / 🇹🇼 垃圾回收壓力**:
    The workload placed on the system's memory management to identify and reclaim unused memory. (系統內存管理為了識別並回收不再使用的內存所承受的負擔，過大會造成 UI 卡頓。)
