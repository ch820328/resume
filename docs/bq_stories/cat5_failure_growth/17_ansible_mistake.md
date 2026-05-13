# 17. Admit a Mistake | 承認錯誤
## Project: Ansible Automation (System Config Error)

### 🎭 STAR Story (English)

*   **Situation**: 
    While automating a fleet-wide configuration update using Ansible, I made a mistake in the inventory filtering logic. This caused the script to target a few production servers that should have been excluded.
*   **Task**: 
    I had to fix the error immediately and ensure it never happened again.
*   **Action**: 
    The moment I realized the logs showed incorrect targets, I **immediately halted the execution** and notified my lead. I didn't try to hide it. I performed a manual rollback of the affected nodes. Afterward, I conducted a **root cause analysis**. I realized the "Human Error" was actually a "System Flaw." I implemented a **"Check Mode" gate** in our CI pipeline that requires a manual approval of the `ansible-playbook --check` output before the actual run is allowed on production.
*   **Result**: 
    Minimized downtime to under 5 minutes. The new "Approval Gate" prevented several similar near-misses in the following months.
*   **Learning**: 
    Admitting a mistake early is the fastest way to stop the bleeding. More importantly, a professional response is to build a technical system that prevents the same mistake from being made by anyone else.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    在使用 Ansible 自動化更新全伺服器配置時，我在 Inventory 過濾邏輯中犯了一個錯誤。這導致腳本誤傷了幾台原本應該被排除的生產伺服器。
*   **任務 (Task)**: 
    我必須立即修復錯誤，並確保它不再發生。
*   **行動 (Action)**: 
    當我從日誌中發現目標錯誤時，我 **立即停止執行** 並通知了我的主管。我沒有嘗試隱瞞。我對受影響的節點執行了手動回滾。事後，我進行了 **根本原因分析 (RCA)**。我意識到「人為錯誤」實際上是「系統缺陷」。我在 CI 流水線中實作了 **「Check Mode 門禁」**，要求在生產環境執行前，必須人工核准 `ansible-playbook --check` 的輸出結果。
*   **結果 (Result)**: 
    將停機時間降至 5 分鐘內。新的「核准門禁」在隨後的幾個月中成功攔截了幾次類似的潛在事故。
*   **反思 (Learning)**: 
    儘早承認錯誤是止血最快的方法。更重要的是，專業的應對方式是構建一套技術系統，防止任何人再犯同樣的錯誤。
