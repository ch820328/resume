# 面試備忘錄：Baby Tracker (家庭共享照護平台)

這張投影片的核心在於：**用戶至上 (User First) 與產品思維——如何透過技術解決家庭成員間的溝通摩擦與資訊不對稱。**

---

### 1. 💬 口語說明 (Colloquial Explanation)

*   **🇺🇸 English (Simple & Direct):**
    "When my family was taking care of our newborn, we faced a major 'communication friction' problem. With multiple caregivers like parents and grandparents, we were constantly asking each other: 'When was the last feeding?' or 'Did he nap already?' I built **Baby Tracker** as a **Real-time Shared Platform** to solve this. I integrated daily activity logging with a **Future Planning** module. By creating this single source of truth, we eliminated 100% of the verbal overhead and communication gaps. Now, every family member knows exactly what the baby needs and what the plan is for the day, even when they are not in the same room."
    
*   **🇹🇼 中文 (口語精簡):**
    「當我的家人在照顧新生兒時，我們面臨嚴重的『溝通摩擦』。因為有多位照顧者（父母與長輩），我們常要互相詢問：『上次什麼時候餵奶？』或『他睡過了嗎？』我開發了 **Baby Tracker** 實時共享平台來解決這個問題。我將日常記錄與 **未來計畫模組** 整合在一起。透過建立這個單一的事實來源，我們徹底消除了口頭溝通的成本和資訊差。現在，每位家人都能精確掌握嬰兒的需求與當天的計畫，即使人不在現場也能無縫銜接。」

---

### 2. ❓ 模擬問答 (Possible Q&A - Google/Amazon Hybrid Strategy)

1.  **問：「你是如何確保數據在多個家人裝置間即時同步且不衝突的？」(Technical Depth)**
    *   **🇺🇸 English**: "I implemented an **Offline-First** architecture using **WatermelonDB** and a Firebase/Node.js sync backend. By using **Optimistic Locking** and timestamp-based conflict resolution, I ensured that if two parents logged a feeding simultaneously, the system would merge the data accurately without losing any records."
    *   **🇹🇼 中文**: 「我使用了 **WatermelonDB** 配合 Firebase/Node.js 後端實作了 **Offline-First** 架構。透過 **樂觀鎖 (Optimistic Locking)** 與基於時間戳的衝突解決機制，我確保即使兩位家長同時記錄餵奶，系統也能準確合併數據而不遺失任何記錄。」

2.  **問：「『計畫規劃』功能在你的 App 中是如何體現的？」(Product Design)**
    *   **🇺🇸 English**: "It's not just a log; it's a **Shared Calendar for Care**. I added a module where we can plan upcoming vaccinations, nap schedules, and medication times. This allowed us to move from 'recording what happened' to 'aligning on what will happen,' which is where most family friction actually occurs."
    *   **🇹🇼 中文**: 「它不僅是記錄，更是 **『照護共享行事曆』**。我加入了一個模組來規劃未來的疫苗接種、小睡時間與用藥時間。這讓我們能從『記錄發生過的事』轉向『對未來計畫達成共識』，而這正是家庭摩擦最常發生的地方。」

3.  **問：「這個專案如何體現你『用戶至上』的理念？」(User First)**
    *   **🇺🇸 English**: "I spent time observing how my family actually used the App. I realized that grand-parents struggled with complex menus, so I optimized for **'One-Handed, High-Contrast UI.'** But the ultimate 'User First' realization was that the 'User' isn't just one person—it's the **family ecosystem**. By reducing the verbal overhead of constant status-checking, the App improved the emotional well-being of the whole family."
    *   **🇹🇼 中文**: 「我花時間觀察家人如何使用這個 App。我發現長輩對於複雜選單感到吃力，所以我優化了 **『單手操作與高對比 UI』**。但最終的『用戶至上』體現是——用戶不只是個人，而是 **家庭生態系**。透過減少頻繁詢問狀態的口頭負擔，App 改善了全家人的情緒福祉。」

---

### 3. 📚 技術名詞解析 (Technical Glossary)

*   **🇺🇸 Single Source of Truth / 🇹🇼 單一事實來源**:
    The practice of structuring information models such that every data element is mastered in only one place. (確保所有家人看到的數據都是最新且一致的唯一標準。)
*   **🇺🇸 Offline-First / 🇹🇼 離線優先**:
    A development mindset that ensures the application is fully functional without an active internet connection, syncing data once back online. (確保在沒有網路的情況下也能記錄，並在恢復連線後同步。)
*   **🇺🇸 Optimistic Locking / 🇹🇼 樂觀鎖**:
    A strategy where multiple users can attempt to update the same record at the same time, resolving conflicts only when a clash is detected. (允許多人同時編輯，僅在衝突發生時才進行處理的同步策略。)
