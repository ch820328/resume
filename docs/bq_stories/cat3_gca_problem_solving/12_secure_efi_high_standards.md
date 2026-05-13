# 12. High Standards | 追求卓越 (Variant 2)
## Project: Secure Python.efi (Encryption vs. Obfuscation)

### 🎭 STAR Story (English)

*   **Situation**: 
    To protect our automation scripts in the UEFI environment, the initial suggestion was to use simple code obfuscators. Many felt that "no one looks at UEFI anyway" and that a basic layer of protection was enough to hit the project deadline.
*   **Task**: 
    I disagreed. I believed that for factory-wide automation, a "High Standard" of security was necessary to prevent supply chain attacks.
*   **Action**: 
    I refused to compromise on a "security by obscurity" approach. Instead, I insisted on a **Hardware-Anchored Encryption model**. I took it upon myself to learn the EDK II C source code and modify the **Python.efi interpreter** to implement in-memory AES decryption. This was significantly harder and took an extra two weeks, but I argued that the "cost of a leak" far outweighed the "cost of a delay." I built a robust delivery pipeline where source code never exists on disk in a readable state.
*   **Result**: 
    Established a **Zero Trust** security standard for the entire department's firmware tools. The system has stood for two years with zero unauthorized script leaks.
*   **Learning**: 
    High Standards mean having the courage to say "No" to an easy but flawed solution. True engineering excellence is found in doing it the *right* way, even when the *easy* way is tempting and "good enough" for others.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    為了保護 UEFI 環境中的自動化腳本，最初的建議是使用簡單的代碼混淆器。許多人覺得「反正沒人會去看 UEFI」，基礎層級的保護就足以應付專案期限了。
*   **任務 (Task)**: 
    我不同意。我認為對於全工廠規模的自動化，必須具備「高標準」的安全防護，以防止供應鏈攻擊。
*   **行動 (Action)**: 
    我拒絕在「透過模糊化達成安全 (Security by Obscurity)」的方法上妥協。相反地，我堅持採用 **「硬體錨定加密模型」**。我自費（時間）研究了 EDK II 的 C 語言源碼，並修改了 **Python.efi 解釋器** 以實作內存中的 AES 解密。這顯然困難得多且多花了兩週時間，但我主張「外洩的成本」遠高於「延遲的成本」。我建立了一個強大的交付管線，確保原始碼永遠不會以可讀狀態存在於磁碟上。
*   **結果 (Result)**: 
    為整個部門的韌體工具建立了 **「零信任 (Zero Trust)」** 安全標準。該系統已運作兩年，未發生任何未經授權的腳本外洩。
*   **反思 (Learning)**: 
    高標準意味著有勇氣對簡單但有缺陷的方案說「不」。真正的工程卓越在於堅持「正確」的做法，即便「簡單」的做法極具誘惑且在他人眼中已「足夠好」。
