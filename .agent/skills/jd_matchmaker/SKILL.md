---
name: JD Matchmaker
description: 互動式的履歷媒合助理。當使用者提供 Job Description 時，進行分析、挑選能在 5 分鐘內講完的投影片（3-4 張），並在取得使用者核准後自動實裝客製化履歷。
---

# Interactive JD Matchmaker Skill

這個 Skill 讓 Agent 扮演使用者的「求職面試軍師」。核心邏輯是：**絕不盲目產生檔案，必須先與使用者討論戰略並取得同意。**

## Phase 1: JD 解析 (JD Analysis)

當使用者貼上 Job Description (JD) 時，Agent 必須先分析並萃取出：
- **硬核技術 (Core Tech Stack)**: 例如 K8s, Go, 分散式系統、CI/CD 等。
- **職級要求 (Seniority Signals)**: 例如帶領團隊、架構設計能力、解決模糊問題等。
- **領域知識 (Domain Knowledge)**: 例如 DevOps, Backend, Embedded, Data 等。

## Phase 2: 戰略提案與討論 (Strategy Proposal)

👉 **強制規則 (CRITICAL RULE)**：在此階段，Agent **絕對不能**修改任何檔案或產生 HTML。必須先向使用者提出一份「戰略企劃書」。

企劃書內容必須包含：
1. **Slide 篩選清單**：從現有的 12 個黃金專案 (`slides_order.json`) 中，精挑細選出能**在 5 分鐘內口頭報告完畢**的專案組合（強烈建議只挑選 **3~4 個**最符合 JD 的核心專案）。
2. **媒合原因 (Why it matches)**：具體且精準地說明挑選每個專案的原因（例如：JD 要求 CI/CD 與自動化，因此挑選 `gitlab_ci` 展現 DevOps 實力）。
3. **客製化建議 (Tailoring Suggestions)**：針對挑選出的專案，建議應如何微調標題、Tech Tags 或是 Impact 數據來迎合 JD 的關鍵字。

⚠️ 提出企劃書後，Agent 必須**明確詢問使用者**：「您是否同意這個專案組合與客製化策略？如果有想替換的專案請告訴我。」並**停止執行**等待回覆。

## Phase 3: 落地實裝 (Execution)

👉 **強制規則**：只有在獲得使用者明確的「同意」或「核准」後，Agent 才能進入此階段。

1. 修改 `slides_order_tailored.json` (或類似的設定檔)，寫入選定的 3-4 個 HTML 檔案。
2. 若有客製化需求，請將該 HTML 複製一份（例如 `tailored_gitlab_ci.html`）並寫入對應的 JD 關鍵字。
3. 自動執行終端機指令 `./run.sh release`，觸發自動化腳本打包出專屬於該 JD 的 PDF。
4. 提醒使用者檔案已經產出完畢。
