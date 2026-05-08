# 面試備忘錄：嵌入式 BSP 工廠與大規模部署 (Jetson BSP)

這張投影片的核心在於：**透過「自動化生產管線」解決大規模嵌入式設備部署的瓶頸，展現對硬體與量產流程的深度控制力。**

---

### 1. 💬 口語說明 (Colloquial Explanation)

*   **🇺🇸 English (Simple & Direct):**
    "Flashing NVIDIA Jetson modules manually is slow and prone to errors. I built an 'Embedded BSP Factory'—an automated server that handles everything from custom OS builds to mass flashing. I decoupled the specific drivers from the core system so we could reuse the same code for different hardware. This reduced configuration errors by 90% and allowed us to ship high-quality AI edge devices much faster."
    
*   **🇹🇼 中文 (口語精簡):**
    「手動燒錄 NVIDIA Jetson 模組既慢又容易出錯。我做了一套『嵌入式 BSP 工廠』，把從客製化系統編譯到大規模燒錄全部自動化。我把驅動程式跟系統核心解耦，讓同一套代碼能跑在不同型號的硬體上。這減少了 90% 的配置錯誤，讓我們能更快、更穩地出貨高品質的 AI 邊緣設備。」

---

### 2. ❓ 模擬問答 (Possible Q&A - Google/Amazon Hybrid Strategy)

1.  **問：「為什麼不直接用 NVIDIA 官方的 SDK Manager？」(Invent and Simplify)**
    *   **🇺🇸 English**: "SDK Manager is a GUI tool for developers, not for a factory floor. It's not reproducible. I built the build server to ensure every flash is driven by version-controlled scripts (Git), which is the foundation of industrial-scale automation."
    *   **🇹🇼 中文**: 「SDK Manager 是給開發者用的圖形工具，不適合產線。它無法保證『可重複性』。我自建編譯伺服器是為了確保每一次燒錄都是由受版本控制 (Git) 的腳本驅動，這才是工業級自動化的基礎。」

2.  **問：「在開發這套系統時，你遇到的最大壓力是什麼？」(Inner Monologue)**
    *   **🇺🇸 English**: "The production deadline was looming, and a single failed flash could stall the entire assembly line. I felt the weight of that responsibility. I realized that 'reliability' was more important than 'speed,' so I spent extra time building the automated hardware self-test to catch failures early."
    *   **🇹🇼 中文**: 「當時面臨出貨期限，任何一次燒錄失敗都可能讓產線停擺，壓力很大。我意識到『可靠性』比『速度』更重要，所以我花了額外時間實作自動化硬體自檢 (Self-test)，確保問題在出廠前就能被抓到。」

3.  **問：「你是如何處理數十台機器併發燒錄時的硬體衝突？」(Dive Deep / Error Handling)**
    *   **🇺🇸 English**: "Mass flashing can crash the USB bus due to bandwidth limits or current spikes. I implemented an **Isolated Process Model**. Each module has its own monitoring process. If one node fails or times out, the system isolates that specific USB port without interrupting the others."
    *   **🇹🇼 中文**: 「大規模燒錄會因為頻寬限制或電流突波導致 USB 匯流排崩潰。我實作了**隔離式進程模型**，每個模組都有獨立監控。如果某個節點失敗或超時，系統會自動隔離該 USB 埠，不影響其他機器繼續燒錄。」

4.  **問：「你在技術選型上做了什麼取捨？」(Trade-offs / Decision Making)**
    *   **🇺🇸 English**: "I chose **Full Image Flashing** instead of delta patches for the initial production. Even though it's slower, it guarantees a clean state. For a L4 Performance role, I prioritize 'Zero Drift' over saving a few minutes per unit if it prevents unpredictable bugs in the field."
    *   **🇹🇼 中文**: 「在生產初期我選擇了 **Full Image Flash** 而非增量補丁。雖然慢一點，但能保證環境是絕對純淨的。對於 L4 的職位，我認為確保『零漂移』比節省幾分鐘更重要，因為這能防止出貨後出現不可預測的 Bug。」

5.  **問：「這套系統對 Google 的基礎設施建設有什麼啟發？」(Future Pacing)**
    *   **🇺🇸 English**: "At Google, we manage massive fleets of servers. This project taught me how to scale the 'Root of Trust' from one device to thousands. I will apply this automated provisioning mindset to ensure Google's edge nodes are always secure and consistent."
    *   **🇹🇼 中文**: 「在 Google 需要管理龐大的伺服器群。這個專案教會我如何將『信賴根』從一台設備擴展到幾千台。我會將這種自動化預置的思維應用在 Google，確保所有邊緣節點始終保持安全與一致。」

6.  **問：「如果產線明天要增加一倍的產量，你的系統能負荷嗎？」(Scaling)**
    *   **🇺🇸 English**: "The bottleneck would shift to the USB controller bandwidth. I designed the script to be **horizontally scalable**. We can just add more slave build nodes, and the master server will orchestrate the artifacts via a shared hash-verified storage."
    *   **🇹🇼 中文**: 「瓶頸會轉向 USB 控制器的頻寬。我設計的腳本支持**水平擴展**，我們只需要增加 Slave 節點，Master 會透過雜湊驗證的共享儲存來統籌所有編譯產物。」

---

### 3. 📚 技術名詞解析 (Technical Glossary)

*   **🇺🇸 BSP (Board Support Package) / 🇹🇼 板級支持包**:
    The software layer that allows an operating system to run on a specific piece of hardware. (讓作業系統能在特定硬體上運行的軟體層。)
*   **🇺🇸 Rootfs / 🇹🇼 根檔案系統**:
    The first file system that is mounted at the root of the file system hierarchy during boot. (系統啟動時掛載的第一個檔案系統。)
*   **🇺🇸 Chroot / 🇹🇼 切換根目錄**:
    A technique to change the apparent root directory for the current running process and its children. (改變當前進程及其子進程外顯根目錄的技術，常用於預置系統環境。)
*   **🇺🇸 Isolated Process Model / 🇹🇼 隔離式進程模型**:
    Running tasks in separate processes so that a failure in one doesn't affect the others. (將任務放在獨立進程運行，確保單一失敗不會影響全局。)
*   **🇺🇸 Decoupling / 🇹🇼 解耦**:
    A design pattern that reduces the dependency between components to increase flexibility. (減少組件間依賴關係的設計模式，用以增加系統靈活性。)
