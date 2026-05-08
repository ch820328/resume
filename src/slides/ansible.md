# 面試備忘錄：Ansible 壓測環境自動化 (Performance Infrastructure)

這張投影片的核心在於：**透過「基礎設施即代碼 (IaC)」解決數據污染問題，確保效能測試的數據準確性與實驗效率。**

---

### 1. 💬 口語說明 (Colloquial Explanation)

*   **🇺🇸 English (Simple & Direct):**
    "Our web stress tests were giving us inconsistent data because the 10 load generators had different library versions—we call this 'library drift.' I solved this by building an automated setup using Ansible. I turned a 1-hour manual task into a 5-minute one-click process. This didn't just save time; it gave us 'clean data' so we could finally find the real bottlenecks in our service."
    
*   **🇹🇼 中文 (口語精簡):**
    「那時候壓測數據一直對不起來，我發現是因為 10 台壓測機的環境根本不統一（環境漂移）。我直接寫了一套 Ansible 自動化腳本，把原本要弄一小時的手動設定變成五分鐘一鍵搞定。這不只是省時間，更重要的是環境乾淨了，我們才真的抓到系統的效能瓶頸在哪裡。」

---

### 2. ❓ 模擬問答 (Possible Q&A - Google/Amazon Hybrid Strategy)

1.  **問：「為什麼選 Ansible 而不是手動設定或 Bash 腳本？」(Invent and Simplify)**
    *   **🇺🇸 English**: "I wanted **Idempotency**. With Bash, if a script fails halfway, it leaves the system in a messy state. Ansible ensures that no matter how many times I run it, the result is exactly the same. This consistency is crucial for performance benchmarking."
    *   **🇹🇼 中文**: 「我追求的是**冪等性 (Idempotency)**。手動或 Bash 腳本如果執行到一半失敗，環境會變得很髒。Ansible 能確保無論跑幾次，結果都完全一致，這對效能測試的基準點 (Baseline) 至關重要。」

2.  **問：「當初發現環境不一致時，你的內心想法是什麼？」(Inner Monologue)**
    *   **🇺🇸 English**: "I felt a bit frustrated because the team was chasing 'ghost bugs' in the code when the real issue was the test environment. I realized that as an Infra engineer, my job is to provide a 'Source of Truth' for the developers so they can trust their data."
    *   **🇹🇼 中文**: 「當時我覺得有點挫折，因為團隊一直在 Code 裡面抓不存在的 Bug，結果問題出在環境。我意識到作為 Infra 工程師，我的職責是為開發者提供一個『信賴根』，讓他們能百分之百信任數據。」

3.  **問：「如果你要擴展到 200 台壓測機，效能會是問題嗎？」(Dive Deep / Performance Awareness)**
    *   **🇺🇸 English**: "Yes, SSH overhead would be the bottleneck. I would enable **SSH Pipelining** and **Facts Caching** to reduce the number of round-trips. I'd also increase the `forks` parameter to handle more parallel connections without context-switching the control node too heavily."
    *   **🇹🇼 中文**: 「會，SSH 的連線開銷會是瓶頸。我會開啟 **Pipelining** 與 **Facts Caching** 來減少往返次數，並調高 `forks` 參數，在不讓控制節點過度 Context Switch 的情況下進行大規模併發。」

4.  **問：「為什麼不直接用 Docker 容器來跑壓測？」(Trade-offs)**
    *   **🇺🇸 English**: "We needed to tune low-level TCP stack parameters and kernel limits to simulate extreme loads. Running directly on the Host OS minimizes virtualization jitter, ensuring the metrics we collect reflect the hardware's true limits."
    *   **🇹🇼 中文**: 「我們需要調整底層的 TCP 堆疊與核心參數來模擬極限負載。在 Host OS 上跑能把虛擬化帶來的數據干擾 (Jitter) 降到最低，確保數據反映的是硬體真實極限。」

5.  **問：「這項自動化對未來的 Google 工作有什麼幫助？」(Future Pacing)**
    *   **🇺🇸 English**: "This experience taught me that performance is only as good as the environment it's measured in. At Google, I will bring this 'zero-drift' mindset to ensure our infrastructure benchmarks are always reliable and reproducible."
    *   **🇹🇼 中文**: 「這段經驗讓我明白，效能數據的價值取決於測試環境的純淨度。在 Google，我會帶入這種『零漂移』的思維，確保我們所有的架構基準測試都是可靠且可重複的。」

6.  **問：「有沒有過別人覺得環境差不多就好，但你堅持要自動化的經驗？」(High Standards)**
    *   **🇺🇸 English**: "Some thought manual setup for 10 nodes was 'fine', but I saw it as a risk. Manual steps invite human error. I insisted on automation to build a system that guards itself against drift, which is the only way to achieve high-quality results at scale."
    *   **🇹🇼 中文**: 「有些人覺得 10 台手動弄一下就好，但我認為那是風險。人工操作一定會出錯。我堅持自動化是為了建立一個能自我防禦漂移的系統，這也是大規模產出高品質結果的唯一方法。」

---

### 3. 📚 技術名詞解析 (Technical Glossary)

*   **🇺🇸 Library Drift / 🇹🇼 環境漂移**:
    When software dependencies across different machines become inconsistent over time. (不同機器上的軟體依賴版本隨時間變得不一致。)
*   **🇺🇸 Idempotency / 🇹🇼 冪等性**:
    The property of an operation that can be applied multiple times without changing the result beyond the initial application. (操作執行多次與執行一次的結果相同，確保狀態穩定。)
*   **🇺🇸 Jitter / 🇹🇼 數據干擾/抖動**:
    Unexpected variations in performance metrics, often caused by virtualization or background OS tasks. (效能指標的異常波動，通常由虛擬化或系統背景任務引起。)
*   **🇺🇸 SSH Pipelining / 🇹🇼 SSH 管線化**:
    An Ansible optimization that reduces the number of network connections needed to execute tasks. (減少執行任務時所需網路連線次數的優化技術。)
*   **🇺🇸 Facts Caching / 🇹🇼 資訊快取**:
    Storing system information locally to avoid redundant collection during multiple runs. (將系統資訊暫存在本地，避免重複收集以提升效率。)
