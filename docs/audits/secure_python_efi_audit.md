# Technical Audit: Secure Python.efi & Web Encryption Pipeline

這份文件總結了對 `Python.efi` 加密保護機制與 Web 端加密服務的源碼閱讀與流程分析。

---

## 1. 核心流程分析 (Pipeline Overview)

整個保護機制分為 **Web 端加密分發** 與 **UEFI 端動態解密執行** 兩個部分。

### A. Web 端加密 (Server-Side)
*   **Controller**: `RsaEncryptController.php`
*   **Service**: `RsaEncryptService.php` / `SmcPythonEncrypt.php`
*   **加密行為**:
    1.  用戶透過 Web 介面（RSA Encrypt Page）上傳 `.py` 或 `.zip` 檔案。
    2.  系統調用後端工具 `FileSecure` 進行加密。
    3.  加密後的檔案會加上 `SUPERMICRO` 作為 Header 識別字。
    4.  如果是 `.zip` 檔案，系統會自動解壓、加密其中的 `.py` 檔案，並順便放入一份最新的 `Python.efi`。
*   **加密算法**: 程式碼中雖然類名為 `RsaEncrypt`，但底層實作為 `aesOperationFile`。推測流程為：使用 **AES-CBC/GCM** 進行大數據（腳本內容）加密，而 **RSA-1024** 則用於金鑰交換或身分驗證。

### B. UEFI 端解密 (Client-Side)
*   **組建環境**: EDK II (EFI Development Kit)
*   **載體**: `Python.efi` (自定義編譯版)
*   **解密行為**:
    1.  UEFI Shell 執行 `Python.efi script.py`。
    2.  `Python.efi` 在加載腳本內容至內存前，先檢查檔案頭部是否包含 `SUPERMICRO` 字樣。
    3.  若匹配，則調用內置的解密邏輯（使用 RSA 公鑰驗證或私鑰解密 AES Key，再進行 AES 流解密）。
    4.  解密後的緩衝區直接送入 Python 解析器執行，不產生臨時檔案。

---

## 2. 技術亮點 (Technical Highlights)

1.  **無文件加載 (File-less Loading)**: 解密後的內容直接在 Memory 中執行，防止了工廠端透過磁碟掛載讀取原始碼的風險。
2.  **EDK II 整合**: 成功將加密庫整合進 Pre-boot 環境，這涉及到對 UEFI Shell 內存管理與協議的深入理解。
3.  **自動化打包**: Web 端在處理 ZIP 時會自動帶入 `Python.efi`，降低了測試工程師的環境配置難度。

---

## 3. Dive Deep 可能的問題與準備

*   **Q: 為什麼不直接用編譯過的 `.pyc`？**
    *   *A*: `.pyc` 很容易被反編譯回近乎原始的源碼。使用強對稱加密（AES）配合非對稱金鑰（RSA）保護，安全性遠高於 bytecode。
*   **Q: 在 UEFI 中解密的效能如何？**
    *   *A*: 由於 Python 腳本體積通常在幾百 KB 以內，使用硬體加速或優化過的 C 語言加密庫，解密時間在毫秒級，對使用者無感。
*   **Q: 如果金鑰洩漏了怎麼辦？**
    *   *A*: 系統設計中可以考慮將金鑰綁定在特定版本的 `Python.efi` 中，或者透過簽名機制確保只有特定的 EFI 執行檔能解密。

---

## 4. 關鍵檔案索引
*   **Web 邏輯**: `app/SmcPythonEncrypt.php`
*   **Entry Point**: `app/Http/Controllers/Dash/RsaEncryptController.php`
*   **EFI 端**: 需參考 EDK II 專案下的 Python 修改源碼 (C 語言實作)。
