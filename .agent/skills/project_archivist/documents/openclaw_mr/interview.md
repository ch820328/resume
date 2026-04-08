# 面試指南：OpenClaw AI Merge Request 審閱服務 (STAR 答題)

本指南專注於 AI 自動化審閱開發主線中遇到的挑戰與解決方案。

---

### Q1: "請介紹一下 OpenClaw 的 MR 審閱功能？"
- **Situation**: 在大規模專案中，人工審閱（Manual Review）往往因頻繁 Commit 而導致延遲，或者因為審閱者疲勞而漏掉細微的邏輯漏洞或安全風險。
- **Task**: 建立一個能自動化、多維度且高質量的 AI 審閱流水線。
- **Action**: 
    - 實作了 **Matrix Review Engine**：這是一個三階段（Master/Experts/Aggregator）的多代理編排模型。
    - 整合 **BullMQ** 與 **Redis 分散式鎖**：解決同一個 MR 在快速提交時導致的重複分析與資源浪費，確保 Job 的等冪性。
    - 核心處理 **Diff 裁減與 Context 優化**：開發智能演算法來處理超大型變更（>10k lines），將模型的視覺焦點鎖定在最具風險的部分。
- **Result**: 實現了 **100% 的架構與安全門禁自動化覆蓋**。產出的建議與資深工程師的見解高度契合，顯著減少了人工重複檢閱 Routine 錯誤的時間。

---

### Q2: "在處理大量 MR 時，你如何確保系統的併發控制與資料一致性？"
- **Situation**: 同一時間可能有多個 GitLab Webhook 針對不同（或同一個）MR 觸發。
- **Task**: 防止重複呼叫昂貴的 LLM API，並確保分析結果的最終一致性。
- **Action**: 
    - 引入了 `lock:mr-analysis` 分散式鎖機制。
    - 只有獲取鎖的背景工作序（Worker）能執行 LLM 呼叫；其餘職程會暫存或等待，直到鎖釋放。
    - 結合 **Commit Signature Check**：如果分析還在進行中且 Commit Hash 沒變，則複用當前進度。
- **Result**: 系統在高併發環境下表現穩定，LLM 呼叫成本降低了 35% 以上，並保證了 Dashboard 上顯示的永遠是最新且正確的分析快照。

---

### Q3: "如何處理 LLM Context Window 限制？（超大型 MR）"
- **Situation**: Git Diff 可能包含數千行變更，直接丟進 LLM 會導致長度截斷或「大海撈針」式的焦點迷失。
- **Task**: 讓 AI 能在有限的視窗內看見最重要的變更。
- **Action**: 
    - 開發了 **變更權重過濾器**：優先提取邏輯檔案與設定檔，截斷或摘要大型自動生成的程式碼（如 Mock data）。
    - 採用 **Multi-Pass 分析**：Master Agent 先對所有檔案做「地圖掃描」，再指派專家 Agent 針對特定檔案子集做深度穿透分析。
- **Result**: 成功讓系統穩定處理單次數千行的變更，且分析的「準確度」不隨檔案數量增加而線性下降。
