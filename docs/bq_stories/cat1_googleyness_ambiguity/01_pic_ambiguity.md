# 01. Dealing with Ambiguity | 處理模糊 (Variant 2)
## Project: PIC Transcript (OpenCV vs. LLM Decision)

### 🎭 STAR Story (English)

*   **Situation**: 
    Our team was tasked with automating data extraction from BIOS setup screens using BMC screenshots. The initial project direction was to use a "Modern LLM/Deep Learning" approach because it was the trending technology. However, we had no labeled training data, no GPUs at the factory edge, and the LLM response time was far too slow for our real-time validation needs.
*   **Task**: 
    I had to navigate the ambiguity of choosing a technology path: stick with the "hyped" AI path that was failing, or pivot to a simpler, unproven alternative under a tight deadline.
*   **Action**: 
    I took the initiative to conduct a **48-hour "Reality Check" Prototype**. I built a parallel version using **OpenCV Template Matching**. I manually curated a library of 50 core BIOS UI elements and proved that the classic CV approach could achieve **99.9% accuracy with millisecond latency**—all without any training data or expensive hardware. I presented the comparison data to the stakeholders, arguing that "The right tool is better than the trendy tool."
*   **Result**: 
    The team pivoted to the OpenCV path. We launched the tool across global sites 3 weeks ahead of schedule. It became 100% stable, replacing human data entry with zero maintenance overhead.
*   **Learning**: 
    Dealing with ambiguity means having the courage to **challenge the "hype"** when the data doesn't support it. Technical leadership is about choosing the path that provides the highest reliability and ROI for the user, not just the most popular technology.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    我們團隊的任務是利用 BMC 截圖自動化 BIOS 設定畫面的數據提取。最初的專案方向是使用「現代 LLM/深度學習」方案，因為那是當時最熱門的技術。然而，我們沒有標註好的訓練數據，產線邊緣端也沒有 GPU，且 LLM 的響應速度遠遠無法滿足我們的即時驗證需求。
*   **任務 (Task)**: 
    我必須在技術路徑的選擇中應對模糊性：是堅持那個已經顯現出失敗跡象的「熱門 AI」路徑，還是在緊迫的期限內轉向一個更簡單、但尚未被驗證的替代方案。
*   **行動 (Action)**: 
    我主動執行了一場 **48 小時的「現況檢驗 (Reality Check)」原型開發**。我用 **OpenCV 模板匹配 (Template Matching)** 建立了另一個並行版本。我手動整理了 50 個核心 BIOS UI 元素的圖庫，並證明了經典的 CV 方法可以在無需任何訓練數據或昂貴硬體的情況下，達成 **99.9% 的準確率與毫秒級延遲**。我向利害關係人展示了對比數據，主張「正確的工具優於熱門的工具」。
*   **結果 (Result)**: 
    團隊果斷轉向 OpenCV 路徑。我們比原定計劃提前 3 週在全球廠端上線了該工具。系統達成了 100% 的穩定性，並以零維護成本取代了人工數據輸入。
*   **反思 (Learning)**: 
    處理模糊性意味著當數據不支持時，要有勇氣 **挑戰「熱門趨勢」**。技術領導力在於選擇能為用戶提供最高可靠性與投資報酬率 (ROI) 的路徑，而不僅僅是選擇最流行的技術。

---

### ❓ 模擬問答 (Possible Q&A)

1.  **問：「為什麼不堅持使用 AI？長遠來看不是更具通用性嗎？」**
    *   **🇺🇸 English**: "Engineering is about trade-offs. Deep Learning requires massive amounts of labeled data and significant GPU resources, which we didn't have at the edge. **Template Matching** gave us 100% stability and sub-second latency *immediately*. For a fixed UI like BIOS Setup, the 'generality' of AI didn't justify the 'cost' of implementation."
    *   **🇹🇼 中文**: 「工程就是一種權衡。深度學習需要大量標註數據與 GPU 資源，而我們在邊緣端並不具備這些。**模板匹配** 立即給了我們 100% 的穩定性與毫秒級延遲。對於 BIOS Setup 這種固定的 UI，AI 的『通用性』並不足以支撐其開發『成本』。」

2.  **問：「你是如何說服團隊放棄已經投入時間的 AI 路徑的？」**
    *   **🇺🇸 English**: "I didn't attack the AI approach; I just provided a **'Working Alternative.'** By building a functional OpenCV prototype in 48 hours, I made it a choice between 'A theoretical AI solution that might work eventually' and 'A practical CV solution that works perfectly right now.' The data made the decision easy for everyone."
    *   **🇹🇼 中文**: 「我沒有攻擊 AI 方案，我只是提供了一個 **『可行的替代方案』**。透過在 48 小時內建立出一個功能齊全的 OpenCV 原型，我讓這變成一個『最終可能可行的理論 AI 方案』與『現在就完美運作的實務 CV 方案』之間的選擇。數據讓大家很容易做出決定。」

3.  **問：「評分 (Score)」**
    *   **Rating**: **9.0/10** (展現了獨立判斷力與對技術本質的追求，而非盲從流行趨勢，這是 Senior 工程師的核心特質。)
