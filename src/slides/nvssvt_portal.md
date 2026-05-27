# NVSSVT: Automation Orchestration Portal

### 💬 口語講稿 (Pitch Script)
「在針對單一伺服器進行 NVIDIA 嚴苛的合規性驗證 (NVSSVT) 時，我們過去高度依賴人工。最大的痛點是『測試設定檔』非常複雜，對 QA 人員來說很難編輯，這導致各個跨部門團隊在測試時，標準經常不統一，造成驗證結果混亂。為了解決這個問題，我用 Go 和 Angular 開發了這個調度平台。我把原本艱澀的設定檔完全 GUI 化，讓 QA 只要在網頁上點選就能產生標準化的 Config。此外，我還實作了強健的任務佇列 (Job Queuing) 系統，並利用 WebSocket 讓 QA 能即時監看底層測試的 Log。這套系統成功強制統一了跨團隊的測試標準，讓人工介入大幅降低了 90%，並將驗證吞吐量推升了 200%，讓我們的伺服器能更快速地取得 NVIDIA 的認證。」

### ❓ 面試必殺題預覽
- **Q: 什麼是 Job Queuing System？你是怎麼實作它的？**
  *A: (您可以提到使用 Go 的 Goroutines 搭配 Channel，或是整合 Redis/RabbitMQ 來做任務排程，確保伺服器一次只跑一個測試，避免資源搶佔。)*
- **Q: 為什麼選擇把設定檔 GUI 化？這解決了什麼本質上的問題？**
  *A: 這解決了「防呆」跟「標準化」的問題。過去 QA 手動改檔容易發生 Syntax Error 或是漏掉特定參數。透過網頁前端的 Form Validation，我們在送出任務前就確保參數是 100% 絕對合法且符合跨團隊標準的，從源頭解決了驗證失敗的問題。*
- **Q: WebSocket 在這個專案扮演什麼角色？**
  *A: NVSSVT 的測試時間可能很長，QA 需要知道目前進度。我透過 Go 攔截底層測試指令的 stdout，再透過 WebSocket 即時串流 (Stream) 回 Angular 前端，讓 QA 有一種「就在本機看 Console」的真實感，卻不需實際 SSH 進機器。*
