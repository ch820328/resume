# BQ Story: Refactoring RFTool for Scalability & Maintainability (Complexity / Long-term Impact)

這個故事展現了您對代碼質量的堅持，以及如何解決「技術債」來支撐更大規模的業務需求。

---

## 🎭 STAR Story (English)

*   **Situation / Task**: 
    As our RFTool (System Testing Tool) grew to support hundreds of test cases, we hit a "maintenance wall." Each test script contained redundant hardware-level code, making updates extremely high-risk and slow. I took the initiative to refactor the entire RFTool into a **Modular Test Framework** to ensure long-term scalability.
*   **Action**:
    *   **The Framework Shift**: I refactored RFTool from a collection of standalone scripts into a **Robot Framework-integrated platform**. I implemented a `listener.py` to bridge our custom logic with the standard automation ecosystem.
    *   **Library Extraction & OOP**: I identified and extracted 30+ core functions into a centralized `library/`. Using the **Inheritor Pattern** (Multiple Inheritance), I enabled test scripts to gain multi-dimensional capabilities (OCR, SSH, Stress) with minimal code.
    *   **Interface Standardization**: I designed shared interfaces for log reporting and Redfish/IPMI communication, ensuring the framework remains protocol-agnostic.
    *   **Version Governance**: Implemented a comprehensive version management system (Repo/Service pattern) to ensure consistent tool deployments across global factory sites.
*   **Result**:
    *   Reduced new test case development time by **50%** by leveraging pre-built library modules.
    *   Eliminated over **60% of redundant code**, significantly improving maintainability.
    *   Enabled seamless migration from legacy IPMI to modern Redfish/SAA tools without modifying existing test logic.
*   **Learning (Future Pacing)**: 
    *"This experience taught me that 'Good Code' is not just about functionality, but about how easily it can be evolved. At Google, I will continue to champion 'Platform Thinking' to build tools that are robust, reusable, and developer-friendly."*

---

## 🎭 STAR Story (中文)

*   **S/T (情境/任務)**: 
    隨著 RFTool（系統測試工具）擴展到支持數百個測試案例，我們遇到了「維護牆」。每個測試腳本都包含冗餘的底層硬體通訊代碼，導致任何更新都極具風險且緩慢。我主動發起並實作了 RFTool 的全面重構，將其轉化為一個**模組化測試框架**，以確保長期的可擴展性。
*   **Action (行動)**:
    *   **內心獨白**: 「如果我現在不解決這個問題，我們 80% 的時間都會花在修復壞掉的腳本，而不是開發新功能。我們需要一個抽象層，將 IPMI/Redfish 的複雜度對測試開發者隱藏起來。」
    *   **庫文件抽取**: 我識別並提取了 30 多個核心功能到中央化的 `library/` 中，包括硬體通訊、日誌標準化和結果驗證邏輯。
    *   **接口標準化**: 我設計了標準化的日誌報告接口，實現了與中央儀表板和 AI 審核系統的視覺化整合。
    *   **版本治理**: 實作了完整的版本管理系統（Repo/Service 模式），確保全球工廠端的工具部署保持一致。
*   **Result (結果)**:
    *   透過利用預構建的庫模組，將**新測試案例的開發時間縮短了 50%**。
    *   消除了 **60% 以上的冗餘代碼**，顯著提升了可維護性。
    *   實現了從舊版 IPMI 到現代 Redfish/SAA 工具的無縫遷移，且無需修改現有的測試邏輯。
*   **Learning (未來投射)**: 
    「這次經驗教會我，『好的代碼』不僅在於功能，還在於它進化的容易程度。在 Google，我將繼續倡導『平台化思維』，構建健壯、可複用且對開發者友善的工具。」
