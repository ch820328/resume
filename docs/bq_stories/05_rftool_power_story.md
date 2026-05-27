# Power Story 05: RFTool Framework (Architecture & Standardization)
## 核心主題：架構設計 (Design)、標準化 (Standardization)、指導他人 (Mentoring)

### 🎭 轉化策略 (BQ Pivot Points)
*   **若問【解決複雜問題/技術深度】**：重點放在你如何設計「Shell 握手機制 (Handshake)」，解決跨進程、跨語言（Python 與 Shell）的狀態一致性問題。
*   **若問【指導他人/影響團隊】**：重點放在你如何建立「共同繼承對象 (Common Base Class)」，並引導團隊成員從寫重複的腳本轉向模組化開發。
*   **若問【提高標準 High Standards】**：重點放在你對代碼複用性與可維護性的堅持，如何將原本破碎的工具整合為工業級框架。

---

### 🚀 STAR Story

#### **1. 結論先行 (High-level Impact)**
我主導了測試框架 RFTool 的架構升級。透過實作 **Shell 握手機制** 與 **物件導向重構 (OO Design)**，我將框架從單純的報告工具提升為全功能的自動化引擎。這套架構減少了 **60% 的代碼重複**，並建立了全公司統一的測試開發標準，讓新工具的開發週期縮短了一半。

#### **2. 技術方案 (Tier - Architecture)**
為了達成可擴展性，我重新定義了框架層次：
*   **抽象層 (Base Layer)**：建立 Common Base Class，封裝了日誌、錯誤處理與資源清理等核心行為。
*   **通信層 (Handshake Layer)**：設計了與底層 Shell 框架同步的信號機制，確保自動化流程的原子性。
*   **模組層 (Library Layer)**：拆分多個專屬 Library，讓不同專案能像樂高一樣組合測試邏輯。

#### **3. 關鍵決策與 Leadership (Layer - Decision & Risk)**
*   **權衡取捨 (Trade-off)**：在重構初期，有同事建議繼續使用簡單的函式調用。但我 **堅持引入物件導向的繼承體系**。我分析過，雖然初期學習曲線較陡，但面對未來數十種硬體平台的差異，只有透過類別繼承才能在保持核心邏輯不變的情況下，快速覆寫 (Override) 特定平台的差異行為。這是一個「短期投入換取長期穩定」的決策。
*   **指導與影響 (Mentoring & Ownership)**：為了讓團隊順利轉型，我 **主動編寫了開發範例與設計手冊**，並進行了多次 Code Review 分享。我觀察到 junior 同事在處理異步信號時常出錯，我便決定在 Base Class 中內建「狀態守衛 (State Guard)」，從架構層面解決了 90% 的常見錯誤。
*   **解決模糊 (Handling Ambiguity)**：面對 Python 與舊有 Shell 框架之間模糊的溝通邊界，我定義了嚴格的 **Exit Code 與回傳格式規範**。這將原本「靠運氣」的交握變成了具備確定性的工程契約。

#### **4. 結果與成果 (Result)**
*   **結果**：代碼冗餘大幅降低，框架成為部門所有硬體自動化專案的底層標準。
*   **影響力**：這種標準化思維不僅提升了品質，更讓跨團隊的代碼貢獻成為可能。
