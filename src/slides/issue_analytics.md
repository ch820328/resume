# Data-Driven Governance: Issue Analytics

### 💬 口語講稿 (Pitch Script)
「過去我們的專案經理或主管在評估『專案健康度』時，往往只能依賴直覺或是單純看 Bug 的總數量，這其實非常不客觀。很多時候真正的雷點在於『一個 Issue 卡在某個工程師手上兩個禮拜都沒動靜』。為了解決這個管理盲點，我開發了一套 **資料驅動治理 (Data-Driven Governance)** 儀表板。我不只算總數，還加入了『Aging (總老化時間)』與『Processing Duration (單站停留時間)』的演算法。只要某個 Ticket 卡住超過閥值，系統就會觸發自動化強制提醒機制。這套系統上線後，不但賦予管理層客觀的指標來先發制人地拯救危機專案，更從根本上改變了團隊文化，培養出及時回應的習慣，大幅縮短了嚴重 Bug 的平均生命週期。」

### ❓ 面試必殺題預覽
- **Q: 什麼是 Aging 跟 Processing Duration 的差別？**
  *A: Aging 是這個 Issue 從開單到現在活了多久 (總時間)，代表這個問題對客戶的影響期；Processing Duration 是它在「當前這個狀態 (例如 In Progress 或 Blocked)」卡了多久。這能幫助我們抓出具體是『哪個關卡』或『哪個人』卡住了整個流程。*
- **Q: 當強制提醒 (Forced Reminder) 發出時，如果工程師還是不理怎麼辦？**
  *A: 系統會有 Escalation (升級) 機制。第一次是 Slack/Email 提醒本人，超過第二次就會 CC 他的主管 (Manager)，把暗處的卡點攤在陽光下，強制啟動對話。這就是 Governance (治理) 的核心。*
- **Q: 你為什麼覺得 Bug 總數是 Misleading (具備誤導性的)？**
  *A: 一個有 100 個 Minor 介面 Bug 的專案，可能比一個只有 2 個但會導致 Kernel Panic 且長達一個月無法修復的專案健康多了。只看數量無法反映出『被忽視的工程技術債』。*
