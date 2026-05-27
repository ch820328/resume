# Baby Tracker: Distributed Sync App

### 💬 口語講稿 (Pitch Script)
「這是我為了解決痛點而發起的 Side Project。當時我發現市面上所有記錄寶寶作息的 App，在網路微弱的情況下體驗都極差，而且當爸爸和媽媽同時記錄同一筆資料時，經常會發生 Race Conditions (競爭危害) 或是直接覆蓋掉對方的紀錄。為了解決這個問題，我決定採用前衛的『Local-First (本地優先)』架構。我實作了 Optimistic UI (樂觀 UI)，讓使用者點擊儲存的瞬間，畫面就能立即更新，達到體感零延遲。而在後端同步機制上，我設計了基於 Optimistic Locking (樂觀鎖) 的同步協議，即使兩台裝置在離線時修改了同一筆紀錄，連上網路後也能優雅地解決衝突，不會遺失任何資料。這套系統把同步延遲壓到了 100 毫秒以內，完美解決了不穩定網路下的多人協作問題。」

### ❓ 面試必殺題預覽
- **Q: 什麼是 Local-First (本地優先)？這跟傳統的 Client-Server 架構有什麼不同？**
  *A: 傳統架構是把資料庫放在雲端，Client 每次讀寫都要等 Network I/O，斷線就不能用。Local-First 則是把「本地端的 Database」視為主資料庫，App 的讀寫都是直接對本地操作 (因此延遲是 0)，然後系統會在背景默默地透過 WebSocket 把資料同步到雲端以及其他設備上。*
- **Q: 你是如何用 Optimistic Locking 解決 Race Condition 衝突的？**
  *A: 每筆資料都會帶有一個 Version Number (版本號)。當爸爸在離線時修改了 Version 1 的資料，準備送上雲端時，如果發現雲端的版本已經被媽媽更新成 Version 2 了，系統就會退回爸爸的請求 (Conflict)。這時 App 會把兩邊的狀態拉回來進行比對或是提示使用者，確保任何一方的辛苦紀錄都不會被無聲無息地覆蓋掉 (Lost Update)。*
- **Q: 什麼是 Optimistic UI (樂觀 UI)？**
  *A: 這是前端 UX 的一種技巧。「樂觀地」假設伺服器一定會成功接受請求，所以在使用者按下按鈕的瞬間，不等待 Server Response 就直接更新前端畫面。萬一背景同步失敗，再把畫面 Rollback 並顯示錯誤提示。這大幅提升了使用者的操作流暢度。*
