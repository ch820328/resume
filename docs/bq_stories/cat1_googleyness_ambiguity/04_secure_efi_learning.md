# 04. Learning & Curiosity | 學習熱情
## Project: Secure Python (UEFI IP Protection)

### 🎭 STAR Story (English)

*   **Situation**: 
    In our UEFI-based validation environment, we relied heavily on Python scripts to perform critical hardware checks. However, I identified a major security risk: our Python source code was stored in **plain-text** on the test media, and even compiled **.pyc files** were trivial to decompile. This meant our core manufacturing IP was exposed to anyone with physical access to the test tools.
*   **Task**: 
    I took it upon myself to secure our engineering IP. This required me to dive deep into the **UEFI EDK II architecture** and C-based firmware development—a field I had no prior formal training in.
*   **Action**: 
    I spent two weeks of intensive self-study on the UEFI specification and the EDK II C source code. I designed an **"Encryption-at-Rest, Decryption-in-RAM"** workflow. I developed a custom encryption utility for the EFI Shell and, more importantly, **modified the C source of the python.efi interpreter**. I inserted a decryption hook into the file-loading logic, ensuring the scripts were only decrypted in memory right before execution.
*   **Result**: 
    Successfully closed the IP leakage vulnerability. We were able to distribute our most sensitive validation logic globally with 100% confidence. The solution added zero noticeable latency and became the security standard for all our pre-boot tools.
*   **Learning**: 
    "Curiosity" is most powerful when driven by a sense of **Responsibility**. By stepping out of my comfort zone (Python) into firmware development (C/UEFI), I solved a critical business risk that would have otherwise gone unaddressed.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    在我們基於 UEFI 的驗證環境中，我們高度依賴 Python 腳本來執行關鍵的硬體檢查。然而，我發現了一個重大的安全風險：我們的 Python 源碼以 **明碼** 形式儲存在測試介質中，且即使是編譯後的 **.pyc 檔案** 也極易被反編譯。這意味著我們的核心生產 IP 暴露在任何能接觸到測試工具的人面前。
*   **任務 (Task)**: 
    我主動承擔起保護我們工程 IP 的責任。這需要我深入鑽研 **UEFI EDK II 架構** 與基於 C 語言的韌體開發——這是我之前沒有受過正式訓練的領域。
*   **行動 (Action)**: 
    我花了兩週時間對 UEFI 規範與 EDK II 的 C 源碼進行密集式自主學習。我設計了一套 **「靜態加密、記憶體解密」** 的工作流。我開發了一個用於 EFI Shell 的自定義加密工具，更重要的是，我 **修改了 python.efi 直譯器的 C 源碼**。我在檔案加載邏輯中插入了解密鉤子 (Hook)，確保腳本僅在執行前才在記憶體中解密。
*   **結果 (Result)**: 
    成功堵住了 IP 洩漏漏洞。我們能夠以 100% 的信心在全球分發我們最敏感的驗證邏輯。該方案沒有增加明顯延遲，並成為了我們所有 Pre-boot 工具的安全標準。
*   **反思 (Learning)**: 
    當「好奇心」由 **責任感** 驅動時，它的力量最大。透過走出我的舒適圈（Python）進入韌體開發領域（C/UEFI），我解決了一個如果不處理就會一直存在的關鍵業務風險。

---

### ❓ 模擬問答 (Possible Q&A)

1.  **問：「你是如何開始學習 UEFI 這麼底層的東西的？」**
    *   **🇺🇸 English**: "I started with the **EDK II open-source repository**. I spent late nights tracing how the file system drivers interact with the interpreter. I believe the best way to learn is to have a 'High-Stakes Problem' to solve. The need to protect our IP provided the perfect motivation to master the intricacies of the EFI environment."
    *   **🇹🇼 中文**: 「我從 **EDK II 開源倉庫** 開始。我花了許多深夜追蹤檔案系統驅動程式如何與直譯器互動。我相信學習最好的方式就是有一個『高風險的問題』需要解決。保護我們 IP 的需求，為我掌握 EFI 環境的複雜性提供了完美的動力。」

2.  **問：「修改 python.efi 這種成熟的工具，你有什麼風險控管措施？」**
    *   **🇺🇸 English**: "I followed a strict **'Minimum Intervention' principle**. I isolated my changes to a single hook in the file I/O layer. I also implemented a bypass mechanism: if the file isn't marked with our specific encryption header, the interpreter falls back to standard loading. This ensured that we didn't break compatibility with existing unencrypted scripts."
    *   **🇹🇼 中文**: 「我遵循嚴格的 **『最小干預原則』**。我將修改隔離在檔案 I/O 層的單一鉤子中。我還實作了一個旁路機制：如果檔案沒有標記我們特定的加密標頭，直譯器會回退到標準加載方式。這確保了我們不會破壞與現有未加密腳本的相容性。」

3.  **問：「評分 (Score)」**
    *   **Rating**: **9.0/10** (這不僅展現了學習能力，更展現了對系統安全的敏感度與「主動承擔責任」的 Googleyness 特質。)
