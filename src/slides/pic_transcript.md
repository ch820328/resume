# 面試備忘錄：工業級特徵探測與文件識別引擎 (Pic Transcript)

這張投影片的核心在於：**利用電腦視覺 (CV) 解決無法透過 API 存取的硬體界面數據提取問題，實現物理界面的數位化治理。**

---

### 1. 💬 口語說明 (Colloquial Explanation)

*   **🇺🇸 English (Simple & Direct):**
    "Some legacy hardware systems don't have APIs, so the only way to get data is by 'looking' at the screen—like the BIOS menu. I built 'Pic Transcript' to automate this. It’s not just a simple OCR tool; I used **OpenCV template matching** to find specific 'anchors' on the screen regardless of lighting or resolution changes. Once it finds the anchor, it crops the exact area needed and turns that image into structured JSON data. This sped up our BIOS validation process by 4 times."
    
*   **🇹🇼 中文 (口語精簡):**
    「有些舊系統沒有 API，唯一獲取數據的方法就是『看』螢幕——像是 BIOS 畫面。我開發了『Pic Transcript』來自動化這個過程。它不只是一個 OCR 工具，我利用 **OpenCV 的模板匹配** 技術在畫面上尋找特定的『錨點』，不論光影或解析度怎麼變都能精準定位。一旦找到錨點，系統就會自動切割出需要的區塊並轉化為結構化的 JSON 數據。這讓我們的 BIOS 驗證速度提升了 4 倍。」

---

### 2. ❓ 模擬問答 (Possible Q&A - Google/Amazon Hybrid Strategy)

1.  **問：「為什麼選 OpenCV 模板匹配而不是 YOLOV8 等深度學習模型？」(Invent and Simplify / Trade-offs)**
    *   **🇺🇸 English**: "In fixed-perspective industrial scenarios, **Template Matching** is superior because it has **zero training cost** and extremely low latency on a CPU. Deep learning requires massive labeling and a GPU. I chose the simpler, more efficient mathematical approach (`TM_CCOEFF_NORMED`) because it delivered 100% accuracy with much lower infrastructure costs."
    *   **🇹🇼 中文**: 「在視角固定的工業場景下，**模板匹配 (Template Matching)** 優於深度學習，因為它具備**零訓練成本**且在 CPU 上的延遲極低。深度學習需要大量標註且依賴 GPU。我選擇了更簡單、高效的數學方法 (`TM_CCOEFF_NORMED`)，因為它在極低的基础設施成本下達成了 100% 的準確度。」

2.  **問：「當你發現環境光影變化導致辨識率下降時，你的內心想法是什麼？」(Inner Monologue)**
    *   **🇺🇸 English**: "I realized that our system was too 'fragile' for a real factory floor. I felt the pressure of having to manually recalibrate for every different production line. This pushed me to think deeper about **Feature Invariance**. I decided to move from simple pixel matching to **Normalized Cross-Correlation**, which focuses on 'patterns' rather than 'brightness.' I wanted a system that was robust enough to 'set it and forget it.'"
    *   **🇹🇼 中文**: 「我意識到我們的系統對於真實的工廠現場來說太過『脆弱』了。想到必須為每一條不同的產線手動重新校準，我就感到壓力很大。這促使我深入思考 **特徵不變性 (Feature Invariance)**。我決定從單純的像素比對轉向 **歸一化互相關 (Normalized Cross-Correlation)**，這更專注於『特徵模式』而非『亮度』。我想要一個足夠強韌、能『一勞永逸』的系統。」

3.  **問：「Tesseract 在處理版本號等特殊數字時常出錯，你如何優化？」(Dive Deep / Performance Awareness)**
    *   **🇺🇸 English**: "OCR isn't perfect, so I built a **Fuzzy Matching Post-Processor**. I used the **Levenshtein Distance** algorithm to compare OCR results against a predefined whitelist of expected engineering strings. This allowed the system to 'self-correct' common misinterpretations (like reading '0' as 'O'), ensuring data integrity in our final reports."
    *   **🇹🇼 中文**: 「OCR 並不完美，所以我建立了一個 **模糊匹配後處理器 (Fuzzy Matching Post-Processor)**。我利用 **Levenshtein Distance (編輯距離)** 演算法將 OCR 結果與預定義的工程白名單進行比對。這讓系統能『自我修正』常見的誤判（例如將 '0' 讀成 'O'），確保最終報告的數據完整性。」

4.  **問：「為什麼不直接對全圖做 OCR，而是要先做錨點定位？」(High Standards / Dive Deep)**
    *   **🇺🇸 English**: "Full-image OCR produces too much 'noise' and unstructured text. For BIOS validation, we need **Deterministic Data Structure**. By locating an anchor first, I can define precise ROIs (Regions of Interest). I know that 'Box A' is always the CPU temperature. This transforms a chaotic image into a clean JSON object that our backend can actually process."
    *   **🇹🇼 中文**: 「全圖 OCR 會產生過多『雜訊』與非結構化文字。對於 BIOS 驗證，我們需要的是**確定性的數據結構**。透過先定位錨點，我可以定義精確的 ROI (感興趣區域)。我知道『A 區塊』永遠代表 CPU 溫度。這將混亂的圖像轉化為乾淨的 JSON 物件，讓我們的後端能真正處理這些數據。」

5.  **問：「這項電腦視覺經驗，在 Google 的大規模資料中心可以怎麼應用？」(Future Pacing)**
    *   **🇺🇸 English**: "Google manages diverse hardware fleets. This project taught me how to extract structured signals from legacy or 'black box' interfaces. I will bring this 'Visual Observability' mindset to Google to help bridge the gap between physical hardware outputs and our automated monitoring systems."
    *   **🇹🇼 中文**: 「Google 管理著多元的硬體集群。這個專案教會我如何從舊系統或『黑盒』界面中萃取結構化訊號。我會將這種『視覺可觀測性』的思維帶到 Google，幫助彌合實體硬體輸出與我們自動化監控系統之間的鴻溝。」

6.  **問：「如何保證產線在離線 (Air-gapped) 環境下也能部署這套工具？」(Ownership / Deliver Results)**
    *   **🇺🇸 English**: "Factory environments are often air-gapped for security. I used **Repomix** to bundle all Python logic and dependencies into a single, auditable package. I took ownership of the entire deployment lifecycle, ensuring that our global nodes were running the exact same version of the algorithm without needing an internet connection."
    *   **🇹🇼 中文**: 「工廠環境基於安全考量通常是離線的 (Air-gapped)。我利用 **Repomix** 將所有 Python 邏輯與依賴打包成單一、可稽核的包。我對整個部署生命週期負責，確保全球節點在無需連網的情況下，都能執行完全相同版本的演算法。」

---

### 3. 📚 技術名詞解析 (Technical Glossary)

*   **🇺🇸 Template Matching / 🇹🇼 模板匹配**:
    A technique in computer vision for finding small parts of an image which match a template image. (電腦視覺中用於在較大圖像中尋找與模板匹配的小區塊之技術。)
*   **🇺🇸 CCOEFF_NORMED / 🇹🇼 歸一化相關係數**:
    A matching method in OpenCV that is resistant to changes in brightness and contrast. (OpenCV 中的一種匹配方法，能抵抗亮度與對比度的變化。)
*   **🇺🇸 ROI (Region of Interest) / 🇹🇼 感興趣區域**:
    A specific area within an image that is selected for processing or analysis. (圖像中被選取出來進行處理或分析的特定區域。)
*   **🇺🇸 Levenshtein Distance / 🇹🇼 編輯距離**:
    A metric for measuring the difference between two sequences (strings) based on the number of edits needed to change one into the other. (衡量兩個序列（字串）間差異的指標，基於將一個轉化為另一個所需的編輯次數。)
*   **🇺🇸 Air-gapped / 🇹🇼 物理隔離**:
    A security measure that ensures a computer network is physically isolated from unsecured networks, such as the public internet. (一種安全措施，確保電腦網路與不安全網路（如公共網際網路）在物理上是隔離的。)
