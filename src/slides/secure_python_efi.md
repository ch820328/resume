# 面試備忘錄：Secure Python in UEFI (IP 保護方案)

這張投影片的核心在於：**安全性與底層開發——如何在一個完全開放且受限的 Pre-boot 環境中，保護公司的核心演算法不外洩。**

---

### 1. 💬 口語說明 (Colloquial Explanation)

*   **🇺🇸 English (Simple & Direct):**
    "We use Python scripts in the EFI Shell for automated hardware validation, but we had a serious security vulnerability: Python source code is **plain-text**, and even compiled **.pyc files** are very easy to reverse-engineer. This meant our proprietary manufacturing logic was completely exposed. To solve this, I architected a **Secure In-Memory Decryption** pipeline. I developed a tool to encrypt the scripts for storage, and I modified the C source of the **python.efi** interpreter to include a decryption engine. Now, the code is only decrypted directly in RAM during execution. It never touches the disk in plaintext, ensuring our IP is 100% protected while keeping the flexibility of Python."
    
*   **🇹🇼 中文 (口語精簡):**
    「我們在 EFI Shell 中使用 Python 腳本進行自動化硬體驗證，但我們面臨嚴重的安全漏洞：Python 源碼是**明碼**，且即使是編譯後的 **.pyc 檔案** 也非常容易被反編譯。這意味著我們的核心生產邏輯是完全暴露的。為了解決這個問題，我架構了一套 **安全記憶體解密** 流水線。我開發了一個工具在儲存時加密腳本，並修改了 **python.efi** 直譯器的 C 源碼以整合解密引擎。現在，代碼僅在執行時於 RAM 中直接解密，源碼全程不落地，在保留 Python 靈活性的同時，確保我們的 IP 得到 100% 的保護。」

---

### 2. ❓ 模擬問答 (Possible Q&A - Google/Amazon Hybrid Strategy)

1.  **問：「既然 pyc 容易被破解，為什麼不乾脆用 C++ 寫所有的邏輯？」(Trade-offs)**
    *   **🇺🇸 English**: "Speed of development. Hardware validation logic changes frequently. Writing everything in C++ for UEFI is extremely slow and hard to maintain. By securing the Python layer, we got the **'Best of both worlds'**: the high-speed iteration of a scripting language and the robust IP protection of a compiled binary."
    *   **🇹🇼 中文**: 「是為了開發速度。硬體驗證邏輯變動頻繁，在 UEFI 中用 C++ 編寫所有內容非常緩慢且難以維護。透過保護 Python 層，我們獲得了 **『兩全其美』** 的方案：既有腳本語言的高速迭代，又有編譯二進位檔案的強大 IP 保護。」

2.  **問：「在 EFI 這種記憶體受限的環境做解密，你如何保證性能？」(Deep Dive / Efficiency)**
    *   **🇺🇸 English**: "I used a symmetric encryption standard like **AES** for the payload to ensure minimal CPU overhead during decryption. The RSA key was only used to protect the AES session key. This hybrid approach allowed us to perform the decryption in milliseconds, adding no noticeable delay to the boot-up or testing process."
    *   **🇹🇼 中文**: 「我使用了像 **AES** 這樣的對稱加密標準來處理數據負載，確保解密期間的 CPU 開銷降到最低。RSA 僅用於保護 AES 會話密鑰。這種混合方法讓我們能在毫秒內完成解密，不會對啟動或測試過程造成明顯延遲。」

3.  **問：「你是如何修改 python.efi 來支援這個功能的？」(Technical Depth)**
    *   **🇺🇸 English**: "I modified the **interpreter's file-loading logic** in the C source code. Instead of reading the file buffer directly into the execution engine, I inserted a hook that checks for an 'encrypted flag.' If detected, the buffer is passed through the decryption engine in RAM before being handed over to the Python VM for execution."
    *   **🇹🇼 中文**: 「我修改了 C 源碼中 **直譯器的檔案載入邏輯**。我插入了一個鉤子 (Hook) 來檢查是否存在『加密標記』，而不是將檔案緩衝區直接讀入執行引擎。如果偵測到標記，緩衝區會在交給 Python VM 執行前，先在 RAM 中通過解密引擎處理。」

---

### 3. 📚 技術名詞解析 (Technical Glossary)

*   **🇺🇸 In-Memory Decryption / 🇹🇼 記憶體解密**:
    The process of decrypting data directly in RAM so it never exists on the storage device in a readable format. (直接在 RAM 中解密數據，使其永遠不會以可讀格式存在於儲存裝置中。)
*   **🇺🇸 Reverse Engineering / 🇹🇼 反向工程**:
    The process of analyzing a system to identify its components and their interrelationships, often to extract source code from binaries. (分析系統以識別其組件及其相互關係，通常是為了從二進位檔案中提取源碼。)
*   **🇺🇸 EDK II**:
    A modern, feature-rich, cross-platform firmware development environment for the next generation of UEFI. (用於開發下一代 UEFI 的現代、功能豐富、跨平台韌體開發環境。)
