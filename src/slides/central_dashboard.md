# Unified Engineering Console

### 💬 口語講稿 (Pitch Script)
「過去我們的工程師在做硬體驗證時，認知負擔非常重。他們必須在 IPMI、Redfish 等四散的 CLI 指令，還有 Redmine、GitLab 這些專案追蹤系統之間來回切換。有時還要開 QEMU 或用 SSH 連線，極度拖垮了生產力。為了解決這個亂象，我主動發起並架構了這個 **Unified Go+Angular Portal**。它不只是一個數據看板，而是深度的全端整合。我在網頁端實作了基於 WebSocket 的 WebSSH、視覺化的檔案系統 (類似 WinSCP)、甚至封裝了跨架構的 QEMU 環境。這把十幾種分散的工具全部統合成一個 **Single Pane of Glass (單一管理介面)**。現在工程師只要透過一個網頁，就能查看 Issue、開啟 Console、甚至一鍵執行 Reboot 或 Clear CMOS。這讓整體環境設定時間縮減了 40%，也大幅降低了資淺工程師進入硬體驗證領域的技術門檻。」

### ❓ 面試必殺題預覽
- **Q: WebSSH 的底層是如何實作的？遇到過什麼延遲 (Latency) 或連線中斷的問題嗎？**
  *A: (您可以說明 Go 後端如何處理 SSH Session，以及如何透過 WebSocket 雙向串流 (Stream) 到 Angular 前端的 xterm.js，並補充斷線重連機制。)*
- **Q: 為什麼要把 QEMU 也整合進去？**
  *A: 為了提供工程師一個完整的 "Virtual Hardware" 測試環境。有時實體機器 (SUT) 被佔用，整合 QEMU 讓他們能在同一個平台上無縫切換到虛擬機進行韌體測試，保持一致的 Developer Experience。*
- **Q: 整合這麼多外部 API (Redmine, GitLab, Redfish)，你怎麼處理錯誤處理 (Error Handling) 跟 Rate Limiting？**
  *A: (可以強調您在 Go 後端做的 API Gateway 設計，像是加入 Retry 機制、Cache 層來減輕外部系統壓力，或是非同步的併發請求 (Goroutines) 來加速 Dashboard 載入。)*
