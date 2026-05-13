# 18. Missed Deadline | 错过期限 (Variant 3)
## Project: Baby Tracker (The Sync Engine Delay)

### 🎭 STAR Story (English)

*   **Situation**: 
    We were one week away from the public beta of the Baby Tracker app. However, I realized that my implementation of the **Redis Distributed Lock** for data sync was causing a subtle race condition in high-latency network environments (like 3G/LTE). Fixing it properly would require a significant refactor of the sync state machine.
*   **Task**: 
    Decide whether to ship with a known bug or miss the high-profile beta launch date.
*   **Action**: 
    I chose **Integrity over Speed**. I immediately informed the stakeholders that I would not sign off on the launch. I explained that in a health-related app, a "Sync Race Condition" could lead to a parent missing a medication log, which was an unacceptable risk. I proposed a **"Limited Beta"**: we would invite internal testers only (on high-speed Wi-Fi) while I spent an extra week implementing the **Redis Lua Scripting** solution for atomic locking. I worked through the weekend to ensure the new state machine was bulletproof.
*   **Result**: 
    The stakeholders respected my decision to prioritize user safety. The delayed public beta launched with 100% data integrity and received a 4.9-star rating for its reliability.
*   **Learning**: 
    A deadline is a target, but **User Safety and Data Integrity are non-negotiable**. As a professional engineer, you must have the courage to stop the line when a fundamental quality standard is not met.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    距離 Baby Tracker App 的公開測試版發佈還有一週。然而，我意識到我為數據同步實作的 **Redis 分散式鎖** 在高延遲網路環境下（如 3G/LTE）會導致微小的競爭狀態。要正確修復它，需要對同步狀態機進行大規模重構。
*   **任務 (Task)**: 
    決定是要帶著已知的 Bug 發佈，還是延後備受關注的公開測試日期。
*   **行動 (Action)**: 
    我選擇了 **「正直勝於速度」**。我立即通知利害關係人，我不會在發佈確認書上簽字。我解釋說在健康相關的 App 中，「同步競爭狀態」可能導致家長漏掉藥物記錄，這是一個不可接受的風險。我提出了一個 **「受限測試版 (Limited Beta)」**：我們只邀請內部測試員（在高速 Wi-Fi 下），同時我額外花一週時間實作基於 **Redis Lua 腳本** 的原子鎖方案。我利用週末加班，確保新的狀態機無懈可擊。
*   **結果 (Result)**: 
    利害關係人尊重我優先考慮用戶安全的決定。延後發佈的測試版具備 100% 的數據完整性，並因其可靠性獲得了 4.9 顆星的評價。
*   **反思 (Learning)**: 
    期限是目標，但 **「用戶安全」與「數據完整性」是不容談判的**。作為一名專業工程師，當基本品質標準未達標時，你必須有勇氣叫停。
