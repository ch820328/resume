# 15. Stakeholder Management | 利害關係人管理 (Variant 2)
## Project: GitLab CI/CD (Developer Velocity vs. Governance)

### 🎭 STAR Story (English)

*   **Situation**: 
    After implementing the strict linear-history and quality gates in GitLab, I faced pushback from **Product Managers (PMs)**. They were concerned that the new gates were slowing down "Developer Velocity" and making it harder to push out "Hotfixes" quickly during a crisis.
*   **Task**: 
    Manage the expectations of the PMs while maintaining the integrity of our engineering standards.
*   **Action**: 
    I organized a "Transparency Session" for the PMs. Instead of talking about "clean code," I talked about **"Production Stability."** I showed them data from previous incidents where messy Git histories and poor MR documentation had doubled the "Mean Time to Recovery" (MTTR) because it was impossible to find the buggy commit. I proposed a **"Fast-Track Emergency Gate"**—a specialized CI flag for true production emergencies that skips non-critical style checks but maintains the core integrity checks.
*   **Result**: 
    The PMs understood that the "slowdown" was actually an investment in **System Reliability**. They accepted the new standards, and the "Fast-Track" flag ensured we remained agile during true crises.
*   **Learning**: 
    Managing non-technical stakeholders requires **translating technical values into business impact**. When you explain that "Quality" equals "Faster Recovery during an Outage," stakeholders are much more likely to support your high standards.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    在 GitLab 執行嚴格的線性歷史與品質門禁後，我面臨來自 **產品經理 (PM)** 的阻力。他們擔心新的門禁會降低「開發速度」，並導致在危機時刻難以快速推布「緊急修補 (Hotfix)」。
*   **任務 (Task)**: 
    在維護工程標準完整性的同時，管理 PM 的預期。
*   **行動 (Action)**: 
    我為 PM 組織了一場「透明度會議」。我沒有談論「乾淨的代碼」，而是談論 **「生產環境的穩定性」**。我向他們展示了之前事故的數據：當時混亂的 Git 歷史和匱乏的 MR 文檔導致「平均恢復時間 (MTTR)」翻倍，因為根本找不到出問題的 Commit。我提出了一個 **「緊急快速通道門禁」**——一個專為真正的生產緊急情況設計的 CI 旗標，它可以跳過非關鍵的風格檢查，但仍維持核心的完整性檢查。
*   **結果 (Result)**: 
    PM 們理解了這種「減速」實際上是對 **「系統可靠性」** 的投資。他們接受了新標準，而「快速通道」旗標則確保了我們在真正的危機時刻仍能保持敏捷。
*   **反思 (Learning)**: 
    管理非技術利害關係人需要 **將技術價值轉化為業務影響**。當你解釋「品質」等於「故障時更快的恢復速度」時，利害關係人就更有可能支持你的高標準。
