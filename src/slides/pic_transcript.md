# 面試備忘錄：PIC Transcript 工業級 OCR 引擎

這張投影片的核心在於：**技術選型的決策能力——為什麼在「AI 熱潮」中，我選擇了更簡單、更高效的 OpenCV 模板匹配 (Template Matching)？**

---

### 1. 💬 口語說明 (Colloquial Explanation)

*   **🇺🇸 English (Simple & Direct):**
    "We needed to extract BIOS data from **BMC and Raspberry Pi screenshots** for automated validation. Initially, the team explored using LLMs or Deep Learning OCR, but the training time and resource requirements were way too high for our real-time factory needs. I made the strategic decision to pivot to **OpenCV Template Matching**. I built a curated image library of BIOS UI elements, which allowed us to achieve sub-second recognition with 99.9% accuracy. It proved that sometimes, the 'classic' engineering approach is much better than the 'buzzy' AI approach."
    
*   **🇹🇼 中文 (口語精簡):**
    「我們需要從 **BMC 和 Raspberry Pi 截圖**中提取 BIOS 數據以進行自動化驗證。最初團隊嘗試使用 LLM 或深度學習 OCR，但發現訓練時間和資源需求對產線即時需求來說太高了。我果斷決定轉向 **OpenCV 模板匹配 (Template Matching)**。我建立了一個 BIOS UI 元素的精確圖庫，這讓我們能以不到一秒的速度達成 99.9% 的準確率。這證明了有時『經典』的工程方法比『熱門』的 AI 方法更有效。」

---

### 2. ❓ 模擬問答 (Possible Q&A - Google/Amazon Hybrid Strategy)

1.  **問：「為什麼不堅持使用深度學習 (Deep Learning)？長遠來看不是更具通用性嗎？」(Decision Making / ROI)**
    *   **🇺🇸 English**: "Engineering is about trade-offs. Deep Learning requires massive amounts of labeled data and significant GPU resources, which we didn't have at the edge. **Template Matching** gave us 100% stability and sub-second latency *immediately*. For a fixed UI like BIOS Setup, the 'generality' of AI didn't justify the 'cost' of implementation."
    *   **🇹🇼 中文**: 「工程就是一種權衡。深度學習需要大量標註數據與 GPU 資源，而我們在邊緣端並不具備這些。**模板匹配** 立即給了我們 100% 的穩定性與毫秒級延遲。對於 BIOS Setup 這種固定的 UI，AI 的『通用性』並不足以支撐其開發『成本』。」

2.  **問：「如果 BIOS UI 稍微改變（例如字體或解析度），你的模板匹配不就失效了嗎？」(Dive Deep / Resilience)**
    *   **🇺🇸 English**: "That's why I implemented a **Multi-Scale matching strategy** and a 'Reference Anchor' system. The system first finds a stable UI element (like the logo) to set the coordinate baseline, and then performs fuzzy matching for content. I also built a simple **Template Update Tool**, so adding support for a new BIOS version takes minutes, not weeks of retraining."
    *   **🇹🇼 中文**: 「這就是為什麼我實作了 **『多尺度匹配策略』** 與『參考錨點』系統。系統先找到穩定的 UI 元素（如 Logo）來設定座標基準，再進行內容的模糊匹配。我還建立了一個簡單的 **模板更新工具**，所以支援新版 BIOS 只需要幾分鐘，而不是幾週的重新訓練。」

3.  **問：「這項經驗如何展現你的『處理模糊性』能力？」(Ambiguity)**
    *   **🇺🇸 English**: "I had to navigate the ambiguity of choosing a technology path. There was pressure to use 'AI' because it was trendy, but the data showed it was failing our performance requirements. I took the responsibility to steer the project toward a simpler, more deterministic path (OpenCV), ensuring the project met its production deadline."
    *   **🇹🇼 中文**: 「我必須在技術路徑的選擇中應對模糊性。當時有使用『AI』的壓力，因為它很流行，但數據顯示它無法滿足我們的性能要求。我承擔起責任，將專案轉向更簡單、更具確定性的路徑 (OpenCV)，確保專案如期上線。」

---

### 3. 📚 技術名詞解析 (Technical Glossary)

*   **🇺🇸 Template Matching / 🇹🇼 模板匹配**:
    A technique in computer vision for finding small parts of an image which match a template image. (視覺辨識中，在影像中尋找與模板圖像匹配的小區塊的技術。)
*   **🇺🇸 Sub-second Latency / 🇹🇼 毫秒級延遲**:
    Processing time that is faster than one second, critical for real-time factory automation. (低於一秒的處理時間，對產線即時自動化至關重要。)
*   **🇺🇸 BMC (Baseboard Management Controller)**:
    A specialized service processor that monitors the physical state of a computer, network server or other hardware device. (專門用於監控電腦或伺服器物理狀態的服務處理器。)
