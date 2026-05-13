# 12. High Standards | 追求卓越
## Project: GitLab CI/CD Governance (Linear History & Quality Gates)

### 🎭 STAR Story (English)

*   **Situation**: 
    In our multi-project environment, code quality was inconsistent and Git histories were messy due to non-linear merges. This made debugging and rollbacks difficult.
*   **Task**: 
    I was tasked with improving the engineering standards across all repositories.
*   **Action**: 
    I realized that manual reminders were ineffective. I decided to move the "Governance" from humans to the CI pipeline. I developed a **Linear History Enforcement** script that rejected any branch containing merge commits, forcing a rebase-only workflow. I also implemented a **Description Validator** to ensure every Merge Request linked to a ticket and included validation steps. I held my ground on these standards even when some developers initially found the strictness frustrating.
*   **Result**: 
    Achieved **100% linear Git history**, making auditing trivial. Reduced manual review overhead by **30%** by automating hygiene checks.
*   **Learning**: 
    High standards are not just about personal preference; they are about organizational scalability. Automating these standards ensures they are non-negotiable and shapes a healthier engineering culture.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    在我們多專案並行的環境中，代碼質量不一，且 Git 歷史因為非線性合併而非常混亂，這導致調試與回滾變得困難。
*   **任務 (Task)**: 
    我的任務是提升所有代碼庫的工程標準。
*   **行動 (Action)**: 
    我意識到人工提醒是無效的。我決定將「治理」從審核者轉移到 CI 流水線中。我開發了一套 **「線性歷史強制腳本」**，拒絕任何包含 Merge Commit 的分支，強制執行 Rebase-only 工作流。我還實作了 **「描述驗證器」** 以確保每個 MR 都關聯到 Ticket 並包含驗證步驟。即便最初有些開發者覺得這些規定過於嚴格，我仍堅持這些標準。
*   **結果 (Result)**: 
    實現了 **100% 線性 Git 歷史**，使審計變得非常簡單。透過自動化衛生檢查，減少了 **30% 的人工審核負擔**。
*   **反思 (Learning)**: 
    高標準不僅僅是個人偏好，更是為了組織的可擴展性。將標準自動化能確保其不可動搖，並塑造更健康的工程文化。
