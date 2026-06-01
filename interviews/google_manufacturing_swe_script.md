# Google L4 SWE (Smart Manufacturing) - English Scripts (Backend/Test Automation Focus)

---

## 🎙️ Introduction (自我介紹與開場白)
**"Hi everyone, thank you for having me today. I’m Sepan, a Software Engineer at Supermicro, where my team specializes in firmware test automation."**
*(嗨，謝謝您今天的時間。我是 Sepan，Supermicro 的軟體工程師。我們團隊專注於韌體測試自動化。)*

**"Within the team, my primary role involves designing test automation, developing internal web services, and deploying testing infrastructure such as KMS and OCR."**
*(在團隊中，我的主要角色是設計測試自動化、開發內部網頁服務，以及架設像是 KMS 和 OCR 這類的測試基礎設施。)*

**"Today, I'd like to share 3 projects I worked on over the past year."**
*(今天我想分享一下我過去一年多做的一些專案。)*

---

## 🏭 Slide 1: OpenClaw Semantic Log Diagnostics
**【重點】：AI, RAG, 解決 firmware 測試日誌的痛點**

"First, in firmware testing, we typically spend a lot of time parsing logs to identify root cause."
(首先，在韌體測試中，我們通常需要花很多時間解析日誌來找出根本原因。)

"To solve this, I developed a RAG-based AI system that analyzes error messages with past issues and source code to determine the failure cause."
(為了解決這個問題，我開發了一個基於 RAG 的 AI 系統，對比過去的紀錄與原始碼來分析錯誤訊息，進而判定失敗原因。)

"By automating this, we successfully cut initial analysis time by 80%."
(透過將此流程自動化，我們成功縮短了 80% 的初次分析時間。)
---

## 🚦 Slide 2: OpenClaw Validation Monitor
**【重點】：利用 BMC/Redfish API 解決硬體卡死問題**

"Next is the Validation Monitor. During validation, the machines would often hang due to unexpected errors."
(接下來是驗證監控器。在驗證期間，機台常因為意外狀況而卡死。)

"To solve this, I built a web service that monitors logs from Jenkins, MySQL, and real-time data via the Redfish API."
(為了解決這個問題，我寫了一個 web service，透過 Redfish API 即時監控來自 Jenkins、MySQL 的日誌以及硬體數據。)

"If a freeze is detected, it automatically triggers a restore mechanism to recover the system and logs the sequence for analysis."
(如果偵測到卡死，它會自動觸發安全的 restore 機制來復原系統，並記錄整個流程以供分析。)

---

## 🎨 Slide 3: Unified Engineering Console
**【重點】：強調後端 (Go) 整合能力，把前端 (UI) 當作輔助**

"Finally, the Unified Engineering Console. In the past, our team used too many different tools and commands for debugging, which were too complex for new engineers and testers, causing delays and confusion."
(最後是統一工程控制台。過去，我們團隊用太多不同的工具和指令來 debug，對新來的工程師與 tester 來說太複雜，也不熟悉，導致延遲和混亂。)

"To fix this, I brought up a web service to integrate all these tools and commands."
(為了解決這個問題，我架設了一個 web service 來整合所有這些工具和指令。)

"By putting everything into a single interface, we successfully cut setup time significantly."
(透過把所有東西放進單一介面，我們成功大幅縮短了建置時間。)
---