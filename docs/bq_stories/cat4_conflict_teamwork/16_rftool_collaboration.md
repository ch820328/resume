# 16. Team Collaboration | 團隊協作 (Variant 2)
## Project: RFTool (Hardware-Software Sync)

### 🎭 STAR Story (English)

*   **Situation**: 
    During the RFTool refactor, I realized our software testing team was "siloed" from the hardware design team. We were often writing test cases for hardware features that were already obsolete, leading to wasted effort and missed bugs.
*   **Task**: 
    Foster a culture of cross-functional collaboration between the software and hardware teams.
*   **Action**: 
    I proposed a **"Common Interface Standard"** project. I invited the hardware engineers to a weekly "Interface Review." Instead of just writing test code, I worked with them to define a shared **YAML-based hardware description schema**. This ensured that any change in hardware registers would automatically update our RFTool library. I also created a shared dashboard where hardware teams could see the "Test Pass Rate" for their specific prototypes in real-time.
*   **Result**: 
    Reduced "interface mismatch" bugs by 70%. The two teams started working as a single unit, with hardware engineers proactively adding test hooks for our software framework.
*   **Learning**: 
    Collaboration is about **Shared Language and Shared Visibility**. By building tools that bridge the gap between different engineering disciplines, you create a more resilient and agile organization.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    在 RFTool 重構期間，我意識到我們的軟體測試團隊與硬體設計團隊是「孤立」的。我們經常為已經過時的硬體功能編寫測試案例，導致徒勞無功且遺漏了 Bug。
*   **任務 (Task)**: 
    在軟體與硬體團隊之間建立一種跨職能協作的文化。
*   **行動 (Action)**: 
    我提議了一個 **「通用介面標準」** 專案。我邀請硬體工程師參加每週的「介面評審」。我不僅僅是編寫測試代碼，還與他們合作定義了一套共享的 **基於 YAML 的硬體描述架構 (Schema)**。這確保了硬體暫存器的任何變更都會自動更新我們的 RFTool 庫。我還建立了一個共享儀表板，讓硬體團隊能即時看到他們特定原型的「測試通過率」。
*   **結果 (Result)**: 
    將「介面不匹配」導致的 Bug 減少了 70%。兩個團隊開始像一個整體一樣運作，硬體工程師甚至開始主動為我們的軟體框架添加測試鉤子 (Hooks)。
*   **反思 (Learning)**: 
    協作在於 **「共享語言與共享可視化」**。透過構建彌合不同工程學科之間鴻溝的工具，你可以建立一個更具韌性且敏捷的組織。
