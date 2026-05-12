# Google 軟體工程師 (L4/Senior) 面試核心教戰守則

針對 Google 的軟體工程師 (特別是 L4 / Senior) 面試，除了基本的演算法能力外，面試官 (包含 Hiring Committee) 其實是在尋找特定的 **「職級訊號 (Signals)」**。

結合你目前端出來的專案深度（包含高併發基礎設施、自動化測試架構等），以下是你面試 Google 時**最需要注意的 4 大核心點**：

## 1. 系統設計：擁抱「取捨 (Trade-offs)」，沒有標準答案
在 System Design 或專案深挖 (Deep Dive) 的關卡，面試官看重的不是你能背出多少開源工具，而是你的**決策邏輯**。
*   **🚨 錯誤示範**：「我們這裡用了 Redis 作為快取，因為它很快。」
*   **✅ 滿分回答 (展現 L4 深度)**：「在評估快取層時，我在 Redis 叢集與 Memcached 之間做了抉擇。考量到我們的系統對『最終一致性』的要求極高，且需要依賴資料持久化來防範雪崩效應，儘管 Redis 叢集的維運成本稍高，我還是選擇了 Redis。但我為它加上了 10~60 秒的動態 TTL (就像你在 Baby Tracker 裡做的) 來自動防範分散式死鎖。」
*   **關鍵字**：擴展性 (Scalability)、單點故障 (SPOF)、延遲 vs 吞吐量 (Latency vs. Throughput)。永遠主動向面試官分析 **「如果流量放大 100 倍，我現在的架構哪裡會先炸掉？我會怎麼修？」**。

## 2. 行為面試 (BQ) 與 Googleyness：你是戰力放大器嗎？
Googleyness 關卡不是考你脾氣好不好，而是考你能不能適應改變、解決衝突，並發揮領導力。
*   **展現「處理模糊性 (Navigating Ambiguity)」**：L4 工程師不能只會當「接單仔」。你要準備幾個故事證明：**需求一開始很不清楚/很屎，你是如何釐清它，並主動提出技術方案的。**（例如你主動發現人工驗證太慢，自己從頭架構了 NVSSVT Portal 或 OCR 引擎）。
*   **Focus on 'I', not 'We'**：台灣工程師很容易謙虛說「我們團隊做了什麼」。面試官只在乎 **「你」** 做了什麼。請大膽說 "I architected...", "I decided..."。
*   **指導與影響力 (Mentorship)**：Google 喜歡能夠提升團隊水準 (Force Multiplier) 的人。舉例說明你如何導入 CI/CD 或 Ansible 讓 Junior 工程師不用再手動打指令，甚至教導資深硬體工程師使用新工具。

## 3. 上機 Coding (演算法/資料結構)：溝通大於解題
Google 的 Coding 面試不是 LeetCode 默寫大賽，它是一場 45 分鐘的 **「結對編程 (Pair Programming)」** 模擬。
*   **不要一拿到題目就急著寫 Code**：先花 5 分鐘釐清題意與邊界條件 (Edge cases : 陣列為空？數字為負數？時間複雜度要求？)。
*   **Think Out Loud (邊想邊說)**：「我現在腦中閃過兩個解法，一個是用 Hash Map，時間複雜度 O(N) 但空間也是 O(N)；另一個是用排序，空間 O(1) 但時間 O(NlogN)。考慮到我們可能是處理記憶體受限的設備，我傾向用... 面試官你覺得呢？」
*   **寫完後主動測試**：在面試官抓出 Bug 前，自己帶入一個簡單的測資，一步步人肉 Debug，這會讓你得到超級多加分。

## 4. 履歷深挖 (Domain Deep Dive)：小心「Why」和「How」的連環砲
面試官會挑你履歷上看起來最難的點，往下挖 3 層。
*   針對你的每一張幻燈片 (Slides)，除了背熟電梯簡報 (Elevator Pitch) 之外，一定要對自己問這三個問題：
    1.  **Why not the alternative?** (為什麼不選用別的技術棧？例如為何選 Go 不選 Python 寫 Gateway？)
    2.  **What was the hardest bug?** (這個架構遇過最難的 Bug 或是最嚴重的 Outage 是什麼？怎麼 Debug 的？)
    3.  **How do you test it?** (這麼複雜的東西，你當初怎麼保證它上線不會把系統弄壞？)

---

**💡 總結心法**：
把它當作是一場**專業的技術討論**，而不是考試。Google 面試官被訓練要「找到理由錄取你」，當面試官給你提示時，欣然接受並說："That's a great point..." 然後順著他的提示把設計完善。

你有非常紮實的軟硬體整合與自動化基礎架構經驗，把你在 Slides 裡面的那些 **"Trade-offs" (取捨)** 背熟，你會表現得極具競爭力！

---

## 🎙️ 附件：1-Minute Elevator Pitch (一分鐘電梯簡報)

這段講稿的目標是：定調 Senior 身份、展現技術廣度與深度 (Backend/Data/Infra)，並精準對應你的履歷亮點（不誇大）。

> "Hi, I’m Chun-Yu. I’m a Senior Software Engineer with over 5 years of experience specializing in **Enterprise Automation, Systems Integration, and Infrastructure Optimization**.
> 
> At Supermicro, my core focus is building tools and platforms that drastically reduce friction for engineering teams. For instance, I architected a **Unified Engineering Productivity Portal** using Go and Angular. It aggregates fragmented CLI tools like IPMITool and Redfish, along with online diagnostic scripts, into a single centralized Web UI. This eliminated constant context-switching and cut test setup times by 40%. 
> 
> I also built an **Issue Analytics and Trend Prediction Engine** using Laravel. By designing a custom ETL pipeline and leveraging background summary tables, I was able to transform unstructured data from Redmine and Excel into sub-second aggregated insights, exposing hidden bottlenecks to senior management.
> 
> Beyond building web portals, I’m deeply involved in standardizing our CI/CD and infrastructure. I implemented **Test-Driven Infrastructure** with Ansible and Molecule, and I’ve optimized our core NVIDIA Jetson BSP build flows—migrating the compression to Zstd to save 30% of firmware size while accelerating flashing throughput on the factory floor.
> 
> I enjoy taking ownership of complex problems, deeply analyzing trade-offs, and designing pragmatic, scalable solutions from the backend API down to the deployment infrastructure. That’s the exact engineering mindset I aim to bring to Google. Thank you."
