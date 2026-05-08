# Google 面試：問題與專案映射地圖 (實戰版)

這份清單幫你快速定位：面試官問什麼問題時，你該搬出哪一個專題故事。

## 1. System Design & Architecture (聊架構)

| 面試官問什麼？ | 用哪一個專案回？ | 技術亮點 / 攻防重點 (Senior Signals) |
| :--- | :--- | :--- |
| **如何設計一個高併發的任務調度系統？** | **NVSSVT Portal** | 聊 Redis 鎖怎麼防止大家搶同一台機器、以及如何用 Job Queue 來解耦。 |
| **網路不穩或斷線時，資料怎麼同步？** | **Baby Tracker** | 聊 CAP 定理的抉擇，以及如何用 LWW (Last-Write-Wins) 處理版本衝突。 |
| **如何優化大規模下載的頻寬與速度？** | **Jetson BSP** | 聊為什麼把 Gzip 換成 Zstd，以及這對工廠產線產量 (UPH) 的實質幫助。 |
| **系統掛掉時，怎麼讓它自動復原？** | **NVSSVT / UEFI Shell** | 聊自動過期的租用式鎖 (Lease-based locks)，以及 OOB (Redfish) 的遠端自癒。 |
| **如果流量突然變 100 倍，你會怎麼改？** | **Central Dashboard** | 聊為什麼讀取要用 Polling (省資源) 而不是全部用 WebSocket 的務實考量。 |

---

## 2. Behavioral Questions (聊人和事 / BQ)

| Googleyness / 領導力指標 | 建議調用的專案 | 關鍵劇情 (拿分點) |
| :--- | :--- | :--- |
| **處理模糊需求 (Handling Ambiguity)** | **Central Dashboard** | 主動發現大家除錯效率太低，沒人教你做，你主動去聊出需求並做出 Portal。 |
| **沒有職權的影響力 (Influence)** | **Jetson BSP (Zstd)** | 跨部門反對改動，你用具體的效能測試報告數據，說服他們接受新演算法。 |
| **承認並從錯誤中學習 (Failure)** | **Project Baby Tracker** | 實誠地聊早期同步機制沒設計好導致掉資料，後來你如何研究分散式理論來重構。 |
| **解決團隊技術衝突 (Conflict)** | **NVSSVT / Jenkins** | 處理自動化腳本搶佔硬體資源的問題，導入公平排隊機制 (Fair Queueing)。 |
| **工程品質與卓越 (Engineering Excellence)** | **UEFI Shell / Ansibe** | 主動發現手動佈署會造成環境偏移，所以導入了 Docker 沙盒驗證機制。 |

---

## 3. 被面試官深挖 (Deep-Dive) 的防禦劇本

如果你被問到「為什麼不選別的技術」，不要背課本，要講「實務上的取捨」：

### Q1: "為什麼不用 AI/DL 做 OCR？"
*   **關鍵詞：決定性 (Deterministic)**
*   **說法**：AI 模型太慢且容易有不確定的誤判。BIOS UI 很固定，用 OpenCV Template Matching 速度快（<10ms），且精準度是 100%，對自動化測試來說比較可靠。

### Q2: "離線同步為什麼不用最嚴謹的 2PC (Two-Phase Commit)？"
*   **關鍵詞：可用性 (Availability)**
*   **說法**：育兒 App 在家裡 Wi-Fi 弱的地方一定要能動。2PC 如果網路斷了 App 就會卡死，所以我們選 Eventual Consistency，保證 App 永遠能寫入，資料等連網再對齊。

### Q3: "安全性怎麼保證？"
*   **關鍵詞：憑證保護 (Vault)**
*   **說法**：所有的帳號密碼都鎖在 AES 加密庫裡，只有後端需要呼叫 API 時才會在記憶體裡解密，前端或瀏覽器完全拿不到明文。
