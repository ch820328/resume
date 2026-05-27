# Power Story 08: Jetson Factory (Custom Board BSP & Ambiguity)
## 核心主題：處理模糊 (Handling Ambiguity)、主人翁精神 (Ownership)、高標準 (High Standards)

### 🎭 轉化策略 (BQ Pivot Points)
*   **若問【解決模糊/不確定性】**：重點放在面對 NVIDIA Orin 客製化板子 (Custom HW Layout) 時，官方文檔僅針對 DevKit，你如何透過「硬體手冊比對」與「實驗」定義出第一套標準 BSP。
*   **若問【主人翁精神 Ownership】**：重點放在開發 BSP 本身充滿不確定性，你主動跳出來將建置流程「Docker 化」與「平台化」，解決團隊配置混亂。
*   **若問【提高標準 High Standards】**：重點放在你對「零漂移 (Zero Drift)」與「環境即代碼」的追求。

---

### 🚀 STAR Story

#### **1. 結論先行 (High-level Impact)**
針對基於 NVIDIA Jetson Orin 模組的 **客製化硬體平台 (Custom Board)**，原本存在 BSP 建置流程碎片化與環境不一致的問題。官方文件僅支援開發板 (DevKit)，無法直接對應我們的 HW Layout。我 **主動發起並實作了 Jetson Factory 自動化建置服務**。透過將複雜的客製化 BSP 編譯流程 Docker 化，我成功消除了 100% 的手動配置錯誤，並將環境部署時間從 4 小時縮短至 **15 分鐘內一鍵啟動**。

#### **2. 技術方案 (Tier - Architecture)**
我將客製化開發過程轉化為標準的工程實踐：
*   **硬體適配層 (HW Adaptation)**：精確管理針對客製化佈局的 Device Tree 與 Pinmux 配置，確保與 Orin 模組正確交握。
*   **建置隔離層 (Containerization)**：封裝所有交叉編譯工具鏈與依賴，避免與宿主機環境衝突。
*   **分發層 (Artifact Management)**：整合 GitLab Registry，確保所有團隊成員都使用同一份「經過驗證」的客製化建置環境。

#### **3. 關鍵決策與 Leadership (Layer - Decision & Risk)**
*   **在資訊不足中定義標準 (Handling Ambiguity)**：面對客製化硬體，官方文檔在 Pinmux 與特定周邊接口上完全沒有指引。為了找出穩定的路徑，我 **決定回歸硬體原始手冊 (Datasheet)** 並進行系統性的信號驗證測試。我不僅解決了當下的建置問題，還將這些「硬體對應關係」轉化為自動化腳本。
*   **堅持高標準的權衡 (Trade-off)**：團隊最初只想用局部腳本修改官方範例。但我 **堅持要實作完整的 Docker 化方案**。雖然這需要額外處理 NVIDIA 專屬驅動在容器內的映射問題，但我分析後指出：只有做到「整包鏡像交付」，我們才能避免在產線測試時，因為不同工程師機器的 Lib 版本微小差異導致的「刷錄失敗」。這是一個「前期投入換取長期良率」的正確決策。
*   **展現 Ownership**：我觀察到每次 HW Layout 微調都要重新手動改配置。**我主動承擔了這個「建置平台化」的任務**，讓團隊能快速應對不同版本的客製化板子，將個人經驗轉化為團隊資產。

#### **4. 結果與成果 (Result)**
*   **數據**：建置一致性達成 100%，環境配置效率提升 16 倍（4小時 -> 15分鐘）。
*   **影響力**：這套系統成為團隊開發客製化嵌入式產品的基石，確保了從研發到產線的一致性。
