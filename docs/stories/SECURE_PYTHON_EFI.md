# BQ Story: Secure Python.efi & Pre-boot Execution Integrity (Security / Depth)

這張投影片展現了在極限環境（UEFI）下的安全解決方案，強調對自動化工具分發鏈的完整性控制。

---

## 🎭 STAR Story (English)

*   **Situation / Task**: 
    Our automated testing infrastructure relied on a vast library of Python scripts executed in the UEFI Shell. However, distributing these scripts across global factory sites and third-party partners created a high risk of **unauthorized modification and leakage**. Standard Python execution was "too open," and we needed a way to ensure that only authenticated, encrypted scripts could be executed on our platforms.
*   **Action**:
    *   **Inner Monologue**: *"I knew that traditional obfuscation was insufficient. If someone can read the code, they can bypass our validation gates. I realized we needed a hardware-anchored trust model, even in the pre-boot phase where traditional OS-level security doesn't exist."*
    *   **System Design**: I architected a dual-layered security pipeline. In the **Cloud/Web tier**, I implemented an RSA-1024 / AES encryption service that wraps every validated Python script with a secure header (`SUPERMICRO`).
    *   **Firmware Engineering**: I modified the **EDK II Python.efi** C source code to implement a "Safe-Load" mechanism. I integrated a decryption engine directly into the interpreter's file-IO stack.
    *   **Secure Execution**: The modified EFI driver performs in-memory decryption using a secure key-exchange flow. The decrypted code is executed directly from a protected memory buffer, ensuring that the source code never touches the disk in an unencrypted state.
*   **Result**:
    *   Established a **Secure Execution Gate** for all automation tools across the global supply chain.
    *   Successfully prevented unauthorized script modifications, ensuring 100% testing integrity.
    *   Zero performance overhead, with decryption completed in milliseconds during the boot sequence.
*   **Learning (Future Pacing)**: 
    *"This project taught me how to bridge high-level web services with low-level firmware protocols. At Google, this experience in building 'Zero Trust' delivery pipelines for resource-constrained environments will be invaluable for securing our infrastructure-level automation and fleet-wide deployment tools."*

---

## 🎭 STAR Story (中文)

*   **S/T (情境/任務)**: 
    我們的自動化測試架構依賴大量的 Python 腳本在 UEFI Shell 下執行。然而，將這些腳本分發到全球工廠與第三方合作夥伴時，面臨著**未授權修改與外洩**的高風險。標準的 Python 執行過於透明，我們需要一種機制來確保只有經過授權、加密的腳本才能在我們的平台上運行。
*   **Action (行動)**:
    *   **內心獨白**: 「我知道傳統的代碼混淆是不夠的。如果有人能讀懂代碼，他們就能繞過我們的驗證門檻。我意識到我們需要一個硬體錨定的信任模型，即使是在還沒有操作系統保護的 Pre-boot 階段。」
    *   **系統設計**: 我架構了一套雙層安全流水線。在 **Web 端**，我實作了 RSA-1024 / AES 加密服務，為每個驗證過的腳本加上安全標記 (`SUPERMICRO`)。
    *   **韌體開發**: 我修改了 **EDK II Python.efi** 的 C 語言源碼，實作了「安全加載 (Safe-Load)」機制。我將解密引擎直接整合進解釋器的檔案 IO 堆疊中。
    *   **安全執行**: 修改後的 EFI 驅動程式透過安全金鑰交換進行內存中解密。解密後的代碼直接從受保護的緩衝區執行，確保源碼在任何時候都不會以明文形式出現在磁碟上。
*   **Result (結果)**:
    *   為全球供應鏈中的所有自動化工具建立了**安全執行門禁**。
    *   成功防止了未經授權的腳本修改，確保 100% 的測試完整性。
    *   解密過程在毫秒內完成，對生產線的啟動時間零影響。
*   **Learning (未來投射)**: 
    「這個專案教會了我如何將高層級的 Web 服務與低層級的韌體協議對接。在 Google，這種在資源受限環境下建立『零信任 (Zero Trust)』交付流水線的經驗，對於保障基礎設施自動化與全機房部署工具的安全至關重要。」
