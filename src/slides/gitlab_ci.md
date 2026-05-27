# Standardized Quality Gating (GitLab CI)

### 💬 口語講稿 (Pitch Script)
「當團隊逐漸擴編，我們面臨了 10 幾個 Repository 裡的 CI 流程破碎且標準不一的問題。過去我們高度依賴資深工程師進行手動的 Code Review 來維持程式碼品質，但這成為了極度缺乏擴展性的瓶頸。為了解決這問題，我利用 GitLab CI 的 `include` 語法，架構了一套『全域的 CI 模板庫 (Global CI Template Library)』。我在封閉式的 Docker Runner 內，整合了自動化的靜態分析 (Static Analysis)、覆蓋率測試以及客製化的架構 Linting。這個專案統一了跨團隊的測試標準，把新專案建置 CI 的時間從好幾天縮短到幾分鐘內完成。更重要的是，它幫助團隊實現了 **『品質左移 (Shift-Left)』**，在工程師點擊 Merge Request 的那一刻，自動化流水線就會幫我們攔截下絕大多數的 Bug 與不合規的寫法。」

### ❓ 面試必殺題預覽
- **Q: 什麼是 Shift-Left (左移)？它對工程團隊有什麼價值？**
  *A: 傳統上找 Bug 或檢查效能，都是等到進入 QA 或 Staging 環境才做 (這在開發週期的右邊)。Shift-Left 就是把這些檢查移到開發週期的最左邊 (例如寫 Code 時或剛發 PR 時)。越早發現問題，修復成本就越低，這就是 CI 自動化最大的商業價值。*
- **Q: 你提到 Global CI Template Library，使用 `include` 有什麼好處？**
  *A: 這是為了達到『單一真相來源 (Single Source of Truth)』。以前每個專案都有自己的 `.gitlab-ci.yml`，規則要改必須去改 10 個 Repo。用了 include 後，我們只要在中央模板庫改一行設定，所有 10 個專案下一次觸發 CI 時就會自動套用最新的檢查標準。*
- **Q: 如果 Static Analysis 太嚴格，導致工程師的 CI 一直過不了而抱怨怎麼辦？**
  *A: (您可以提到漸進式推廣的策略，例如一開始先將 Linting 設定為 Warning 而不 Block Merge，或是開放團隊對特定的 Legacy Code 加入忽略標籤 (Skip rules)，展現您具備柔性的 Engineering Productivity 推廣手腕。)*
