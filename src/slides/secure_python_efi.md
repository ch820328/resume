# 面試備忘錄：加密 Python 執行環境與源碼保護 (Secure Python EFI)

這張投影片的核心在於：**在極端受限的 Pre-OS 環境中實作強加密機制，保護公司核心知識產權 (IP)，展現對資安與底層架構的深度掌控。**

---

### 1. 💬 口語說明 (Colloquial Explanation)

*   **🇺🇸 English (Simple & Direct):**
    "We had a serious security incident where a former engineer took our proprietary diagnostic tools to a competitor. To prevent this, I developed an **Encrypted Python Runtime** by modifying the **`PyImport_ImportModule`** function. This solution uses **RSA Asymmetric Encryption** to keep the code encrypted on the disk. Since the decryption only happens within our authorized runtime, the code is effectively protected against unauthorized usage or reverse-engineering."
    
*   **🇹🇼 中文 (口語精簡):**
    「我們曾發生過嚴重的資安事件：有離職員工將公司的診斷工具帶到了競爭對手那裡。為了防止這種情況，我透過修改 **`PyImport_ImportModule`** 函數，開發了一套 **加密 Python 執行環境**。這個方案採用 **RSA 非對稱加密技術**，讓程式碼在硬碟上保持加密。因為解密過程只發生在我們授權的執行環境內，這有效地防止了原始碼被盜用或反向工程。」

---

### 2. ❓ 模擬問答 (Possible Q&A - Google/Amazon Hybrid Strategy)

1.  **問：「為什麼選擇技術加密而不是單純的法律合約約束？」(High Standards / Ownership)**
    *   **🇺🇸 English**: "Legal contracts are reactive; technical enforcement is proactive. After the theft incident, we realized that our most valuable intellectual property—the diagnostic logic—needed a physical safeguard. By implementing **RSA Encryption and an authorized runtime**, we ensured that the IP is technically 'non-portable' even if the files are copied."
    *   **🇹🇼 中文**: 「法律合約是事後反應，而技術強制則是事前主動防禦。在發生盜取事件後，我們意識到公司最珍貴的資產——診斷邏輯——需要物理性的保護。透過實作 **RSA 加密與授權的執行環境**，我們確保了即便檔案被拷貝，IP 在技術上也是『無法攜帶』的。」

2.  **問：「在 EFI 這種受限環境下實作解密，你遇到的最大挑戰是什麼？」(Dive Deep / Technical Complexity)**
    *   **🇺🇸 English**: "The biggest challenge was navigating an unfamiliar and massive architecture. I had to trace the entire module-loading execution flow within the **Python C-API** to find the exact point where the import happens. Once I identified **`PyImport_ImportModule`**, I implemented a custom decryption hook to ensure the sensitive logic remains secure until execution."
    *   **🇹🇼 中文**: 「最大的挑戰是在一個不熟悉的龐大架構下進行開發。我必須追蹤 **Python C-API** 內整個模組載入的執行流程，找出導入發生的確切位置。當我最終鎖定 **`PyImport_ImportModule`** 後，我實作了一個自定義解密掛鉤，確保敏感邏輯直到執行前都保持安全。」

3.  **問：「你是如何確保 RSA 私鑰 (Private Key) 本身的安全性？」(Earn Trust / Security Mindset)**
    *   **🇺🇸 English**: "We follow strict operational security. The **Private Key is stored on a secure server**, accessible only to designated maintainers. The encryption process is centralized on the server side; this ensures that the secret key never exists on general developer machines or end devices, significantly reducing the attack surface."
    *   **🇹🇼 中文**: 「我們遵循嚴格的運作安全規範。**私鑰存放在安全伺服器上**，僅限指定的維護人員存取。加密過程是在伺服器端集中完成的；這確保了私鑰不會出現在一般開發者的電腦或終端設備上，大幅縮小了攻擊面。」

---

### 3. 📚 技術名詞解析 (Technical Glossary)

*   **🇺🇸 AES Encryption / 🇹🇼 AES 進階加密標準**:
    A symmetric block cipher used globally to protect sensitive data. (全球通用的對稱密鑰加密標準，用於保護敏感數據。)
*   **🇺🇸 Bytecode / 🇹🇼 字節碼**:
    Program code that has been compiled from source code into an intermediate software-compatible code. (從原始碼編譯成的中間代碼，.pyc 就是 Python 的字節碼。)
*   **🇺🇸 In-Memory Decryption / 🇹🇼 記憶體解密**:
    A security technique where data is decrypted only within the RAM during execution, leaving no traces of unencrypted data on the storage device. (數據僅在執行期間於記憶體中解密，不會在儲存設備上留下未加密痕跡的技術。)
*   **🇺🇸 Root of Trust / 🇹🇼 信賴根**:
    A source that is always trusted within a computer system, often implemented in hardware like a TPM. (電腦系統中始終被信任的來源，通常實作在 TPM 等硬體中。)
