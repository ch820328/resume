# RFTOOL: Validation Framework Refactor

### 💬 口語講稿 (Pitch Script)
「原本團隊內有一套舊的 Python 驗證工具，但因為長年缺乏架構規劃，已經變成一團難以維護的義大利麵程式碼 (Spaghetti code)。當時最嚴重的問題是『狀態殘留 (Dirty State)』——如果某個硬體測試失敗，它不會把環境復原，這會直接導致後面的十幾個測試也跟著失敗，造成嚴重的連鎖誤判。為了根本解決這個問題，我接手進行了底層重構。我導入了明確的物件導向設計 (OOP) 和 Type Hinting 來規範程式碼，並把核心接上了 Robot Framework。這麼做的唯一目的，就是要利用它內建強大的 Setup 和 Teardown 機制，確保每一次測試結束後，資源一定會被正確釋放 (Clean up)。這次重構我不但幫專案刪減了 60% 的冗餘舊 Code，更徹底消除了環境髒掉導致的誤判問題，讓自動化流水線終於能穩定運作。」

### ❓ 面試必殺題預覽
- **Q: 什麼是 Setup / Teardown 機制？為什麼它對測試很重要？**
  *A: Setup 是在測試前準備環境 (例如建立連線)，Teardown 是在測試後清理環境 (例如關閉連線或重啟硬體)。這非常重要，因為這保證了每個測試案例 (Test Case) 都是獨立且具備「冪等性 (Idempotent)」的，不會被前一個失敗的測試給污染。*
- **Q: 在重構 (Refactoring) 如此龐大且混亂的 Legacy Code 時，你的第一步是什麼？**
  *A: 我的第一步絕對不是直接改 Code，而是先寫 Test。我會先針對既有的行為補齊 Unit Test (或黑箱測試)，建立一層保護網 (Safety Net) 後，才開始動手把底層抽換成 OOP 架構，這樣才能保證重構沒有破壞原有的商業邏輯。*
- **Q: 為什麼特別提到 Type Hinting？Python 不是動態型別嗎？**
  *A: 因為這套工具是給整個團隊 (包含新進人員) 使用的。導入 Type Hinting 加上 MyPy 這類的靜態檢查工具，能大幅降低團隊在使用 API 時傳錯參數的機率，這也是將腳本 (Script) 升級為框架 (Framework) 的關鍵一步。*
