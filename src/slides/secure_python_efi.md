<<<<<<< HEAD
# 面試備忘錄：Secure Python in UEFI (IP 保護方案)

這張投影片的核心在於：**安全性與底層開發——如何在一個完全開放且受限的 Pre-boot 環境中，保護公司的核心演算法不外洩。**
=======
# 面試備忘錄：加密 Python 執行環境與源碼保護 (Secure Python EFI)

這張投影片的核心在於：**在極端受限的 Pre-OS 環境中實作強加密機制，保護公司核心知識產權 (IP)，展現對資安與底層架構的深度掌控。**
>>>>>>> 6ac877e57a8770d1d1af3a6f87271899d375fc71

---

### 1. 💬 口語說明 (Colloquial Explanation)

*   **🇺🇸 English (Simple & Direct):**
<<<<<<< HEAD
    "We use Python scripts in the EFI Shell for automated hardware validation, but we had a serious security vulnerability: Python source code is **plain-text**, and even compiled **.pyc files** are very easy to reverse-engineer. This meant our proprietary manufacturing logic was completely exposed. To solve this, I architected a **Secure In-Memory Decryption** pipeline. I developed a tool to encrypt the scripts for storage, and I modified the C source of the **python.efi** interpreter to include a decryption engine. Now, the code is only decrypted directly in RAM during execution. It never touches the disk in plaintext, ensuring our IP is 100% protected while keeping the flexibility of Python."
    
*   **🇹🇼 中文 (口語精簡):**
    「我們在 EFI Shell 中使用 Python 腳本進行自動化硬體驗證，但我們面臨嚴重的安全漏洞：Python 源碼是**明碼**，且即使是編譯後的 **.pyc 檔案** 也非常容易被反編譯。這意味著我們的核心生產邏輯是完全暴露的。為了解決這個問題，我架構了一套 **安全記憶體解密** 流水線。我開發了一個工具在儲存時加密腳本，並修改了 **python.efi** 直譯器的 C 源碼以整合解密引擎。現在，代碼僅在執行時於 RAM 中直接解密，源碼全程不落地，在保留 Python 靈活性的同時，確保我們的 IP 得到 100% 的保護。」
=======
    "We had a serious security incident where a former engineer took our proprietary diagnostic tools to a competitor. To prevent this, I developed an **Encrypted Python Runtime** by modifying the **`PyImport_ImportModule`** function. This solution uses **RSA Asymmetric Encryption** to keep the code encrypted on the disk. Since the decryption only happens within our authorized runtime, the code is effectively protected against unauthorized usage or reverse-engineering."
    
*   **🇹🇼 中文 (口語精簡):**
    「我們曾發生過嚴重的資安事件：有離職員工將公司的診斷工具帶到了競爭對手那裡。為了防止這種情況，我透過修改 **`PyImport_ImportModule`** 函數，開發了一套 **加密 Python 執行環境**。這個方案採用 **RSA 非對稱加密技術**，讓程式碼在硬碟上保持加密。因為解密過程只發生在我們授權的執行環境內，這有效地防止了原始碼被盜用或反向工程。」
>>>>>>> 6ac877e57a8770d1d1af3a6f87271899d375fc71

---

### 2. ❓ 模擬問答 (Possible Q&A - Google/Amazon Hybrid Strategy)

<<<<<<< HEAD
1.  **問：「既然 pyc 容易被破解，為什麼不乾脆用 C++ 寫所有的邏輯？」(Trade-offs)**
    *   **🇺🇸 English**: "Speed of development. Hardware validation logic changes frequently. Writing everything in C++ for UEFI is extremely slow and hard to maintain. By securing the Python layer, we got the **'Best of both worlds'**: the high-speed iteration of a scripting language and the robust IP protection of a compiled binary."
    *   **🇹🇼 中文**: 「是為了開發速度。硬體驗證邏輯變動頻繁，在 UEFI 中用 C++ 編寫所有內容非常緩慢且難以維護。透過保護 Python 層，我們獲得了 **『兩全其美』** 的方案：既有腳本語言的高速迭代，又有編譯二進位檔案的強大 IP 保護。」

2.  **問：「在 EFI 這種記憶體受限的環境做解密，你如何保證性能？」(Deep Dive / Efficiency)**
    *   **🇺🇸 English**: "I used a symmetric encryption standard like **AES** for the payload to ensure minimal CPU overhead during decryption. The RSA key was only used to protect the AES session key. This hybrid approach allowed us to perform the decryption in milliseconds, adding no noticeable delay to the boot-up or testing process."
    *   **🇹🇼 中文**: 「我使用了像 **AES** 這樣的對稱加密標準來處理數據負載，確保解密期間的 CPU 開銷降到最低。RSA 僅用於保護 AES 會話密鑰。這種混合方法讓我們能在毫秒內完成解密，不會對啟動或測試過程造成明顯延遲。」

3.  **問：「你是如何修改 python.efi 來支援這個功能的？」(Technical Depth)**
    *   **🇺🇸 English**: "I modified the **interpreter's file-loading logic** in the C source code. Instead of reading the file buffer directly into the execution engine, I inserted a hook that checks for an 'encrypted flag.' If detected, the buffer is passed through the decryption engine in RAM before being handed over to the Python VM for execution."
    *   **🇹🇼 中文**: 「我修改了 C 源碼中 **直譯器的檔案載入邏輯**。我插入了一個鉤子 (Hook) 來檢查是否存在『加密標記』，而不是將檔案緩衝區直接讀入執行引擎。如果偵測到標記，緩衝區會在交給 Python VM 執行前，先在 RAM 中通過解密引擎處理。」
=======
1.  **問：「為什麼選擇技術加密而不是單純的法律合約約束？」(High Standards / Ownership)**
    *   **🇺🇸 English**: "Legal contracts are reactive; technical enforcement is proactive. After the theft incident, we realized that our most valuable intellectual property—the diagnostic logic—needed a physical safeguard. By implementing **RSA Encryption and an authorized runtime**, we ensured that the IP is technically 'non-portable' even if the files are copied."
    *   **🇹🇼 中文**: 「法律合約是事後反應，而技術強制則是事前主動防禦。在發生盜取事件後，我們意識到公司最珍貴的資產——診斷邏輯——需要物理性的保護。透過實作 **RSA 加密與授權的執行環境**，我們確保了即便檔案被拷貝，IP 在技術上也是『無法攜帶』的。」

2.  **問：「在 EFI 這種受限環境下實作解密，你遇到的最大挑戰是什麼？」(Dive Deep / Technical Complexity)**
    *   **🇺🇸 English**: "The biggest challenge was navigating an unfamiliar and massive architecture. I had to trace the entire module-loading execution flow within the **Python C-API** to find the exact point where the import happens. Once I identified **`PyImport_ImportModule`**, I implemented a custom decryption hook to ensure the sensitive logic remains secure until execution."
    *   **🇹🇼 中文**: 「最大的挑戰是在一個不熟悉的龐大架構下進行開發。我必須追蹤 **Python C-API** 內整個模組載入的執行流程，找出導入發生的確切位置。當我最終鎖定 **`PyImport_ImportModule`** 後，我實作了一個自定義解密掛鉤，確保敏感邏輯直到執行前都保持安全。」

3.  **問：「你是如何確保 RSA 私鑰 (Private Key) 本身的安全性？」(Earn Trust / Security Mindset)**
    *   **🇺🇸 English**: "We follow strict operational security. The **Private Key is stored on a secure server**, accessible only to designated maintainers. The encryption process is centralized on the server side; this ensures that the secret key never exists on general developer machines or end devices, significantly reducing the attack surface."
    *   **🇹🇼 中文**: 「我們遵循嚴格的運作安全規範。**私鑰存放在安全伺服器上**，僅限指定的維護人員存取。加密過程是在伺服器端集中完成的；這確保了私鑰不會出現在一般開發者的電腦或終端設備上，大幅縮小了攻擊面。」
>>>>>>> 6ac877e57a8770d1d1af3a6f87271899d375fc71

---

### 3. 📚 技術名詞解析 (Technical Glossary)

<<<<<<< HEAD
*   **🇺🇸 In-Memory Decryption / 🇹🇼 記憶體解密**:
    The process of decrypting data directly in RAM so it never exists on the storage device in a readable format. (直接在 RAM 中解密數據，使其永遠不會以可讀格式存在於儲存裝置中。)
*   **🇺🇸 Reverse Engineering / 🇹🇼 反向工程**:
    The process of analyzing a system to identify its components and their interrelationships, often to extract source code from binaries. (分析系統以識別其組件及其相互關係，通常是為了從二進位檔案中提取源碼。)
*   **🇺🇸 EDK II**:
    A modern, feature-rich, cross-platform firmware development environment for the next generation of UEFI. (用於開發下一代 UEFI 的現代、功能豐富、跨平台韌體開發環境。)
=======
*   **🇺🇸 AES Encryption / 🇹🇼 AES 進階加密標準**:
    A symmetric block cipher used globally to protect sensitive data. (全球通用的對稱密鑰加密標準，用於保護敏感數據。)
*   **🇺🇸 Bytecode / 🇹🇼 字節碼**:
    Program code that has been compiled from source code into an intermediate software-compatible code. (從原始碼編譯成的中間代碼，.pyc 就是 Python 的字節碼。)
*   **🇺🇸 In-Memory Decryption / 🇹🇼 記憶體解密**:
    A security technique where data is decrypted only within the RAM during execution, leaving no traces of unencrypted data on the storage device. (數據僅在執行期間於記憶體中解密，不會在儲存設備上留下未加密痕跡的技術。)
*   **🇺🇸 Root of Trust / 🇹🇼 信賴根**:
    A source that is always trusted within a computer system, often implemented in hardware like a TPM. (電腦系統中始終被信任的來源，通常實作在 TPM 等硬體中。)
>>>>>>> 6ac877e57a8770d1d1af3a6f87271899d375fc71
