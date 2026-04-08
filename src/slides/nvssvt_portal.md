# Interview Guide: NVSSVT Enterprise Automation Platform

## 🎤 Elevator Pitch (1-Minute)
*   **🇺🇸 English:** "I identified a productivity bottleneck where 30+ engineers were manually managing fragmented CLI tools and hardware validation setups. I led the architecture of a containerized Go + Vue.js Orchestration Portal. By decoupling the execution environment into immutable Docker containers and exposing a standardized OpenAPI layer, I transition the department to programmatic automation, cutting task setup time by 80% and unblocking upstream CI/CD pipelines."
*   **🇹🇼 中文:** 「我發現一個嚴重的效率問題：部門內 30 幾位工程師當時受限於極度破碎的 CLI 工具，導致上游 CI/CD 無法自動化。我主導設計了以 Go + Vue.js 開發的容器化調度中樞，透過 Docker 容器化執行環境與標準 OpenAPI 介面，將原本的人工流程轉化為系統自動化，最終讓環境設置時間減少了 80%。」

## 🚀 Google L4/L5 Behavioral & Architecture Deep Dive

### [L4/L5 Behavioral] Navigating Ambiguity & Systemic Thinking (化解模糊與系統性痛點)
*   **❓ Question:** "Tell me about a time you solved an ambiguous problem or saw an organizational inefficiency and fixed it."
*   **🇺🇸 English Response:**
    *   **Context:** The existing workflow was fundamentally broken. Engineers wasted hours daily debugging environment drift because everyone had different library versions on their laptops. The instruction from management was just "make the scripts better."
    *   **Action (Ambiguity):** I realized scripts wouldn't solve the root cause—we lacked an abstraction layer. I proactively designed a completely decoupled architecture. The user talks to the Portal (OpenAPI), and the Portal delegates containerized tasks to distributed runner agents.
    *   **Impact:** I achieved a transition from ad-hoc manual scripts to a centralized orchestration model, recovering thousands of engineering hours annually.
*   **🇹🇼 中文回應:**
    *   **情境:** 原本的流程充滿缺陷，工程師每天都在解決「在我的電腦上可以跑」的環境飄移問題。主管給的方向很模糊，只說「讓這些測試腳本穩定一點」。
    *   **行動 (化解模糊):** 我以架構師的視角切入，意識到單純改寫腳本無法解決根本問題——我們缺少一個抽象層。我主動設計了全新的解耦架構：使用者對接 Portal API，而 Portal 負責派發「容器化」的任務給終端 Agent。
    *   **影響:** 我不僅解決了眼前的 Bug，更讓部門的驗證流程從手動腳本轉型為標準化的自動化中心管線。

### [L4/L5 Architecture] Concurrency & Throttling (分散式鎖與排程)
*   **❓ Question:** "If 50 upstream CI pipelines hit your OpenAPI simultaneously asking to validate the same physical server, how do you prevent race conditions or overloading the hardware?"
*   **🇺🇸 English Defense (Trade-offs):**
    *   "We explicitly decoupled Job Submission from Job Execution. The API acts as a synchronous receiver returning HTTP 202 instantly, pushing the payload to a Redis-backed queue."
    *   "For scheduling, I implemented **Distributed Mutex Locks** keyed by the physical server's MAC address. A worker routine must acquire this lock before dispatching a container job."
    *   "**Trade-off:** We traded real-time synchronous feedback for system reliability and hardware protection. Callers must poll their `Task_ID` for status, but the hardware is completely shielded from burst DDoSing."
*   **🇹🇼 中文防禦 (架構取捨):**
    *   「我們在設計上刻意將『任務提交』與『任務執行』徹底解耦。API 收到請求後會秒回 HTTP 202 並丟入 Redis 佇列。」
    *   「在任務派發時，我實作了基於實體機台 MAC 網卡卡號的 **分散式鎖 (Distributed Locks)**。Worker 必須搶到資源鎖才會建立 Container。」
    *   「**架構取捨 (Trade-off):** 我犧牲了 API 同步回傳結果的即時性，換取了系統的極致穩定與硬體保護。呼叫端必須使用 Task_ID 查詢進度，但實體機台完美擋住了瞬間高併發的流量衝擊。」

### [L5 Architecture] Single Point of Failure and Extensibility (單點故障與擴充性)
*   **❓ Question:** "If your Go Portal goes down, does the ecosystem halt? How difficult is it to rip out the underlying Jenkins runners if the company mandates moving to Kubernetes?"
*   **🇺🇸 English Defense:**
    *   "The Go portal is strictly **Stateless**. Deployed behind a Load Balancer, we can scale replica pods instantly; all state lives in highly available PostgreSQL/Redis."
    *   "For extensibility, the backend schedules jobs using the **Adapter Pattern**. The logic depends on an `IRunner` interface. Currently, we inject a `JenkinsAdapter`. Changing to a `KubernetesJobAdapter` requires writing a new class implementing `IRunner`, but exactly zero changes to the core scheduling logic or client-facing REST API."
*   **🇹🇼 中文防禦:**
    *   「Go Portal 本身是 **無狀態 (Stateless)** 的，所有狀態存於外部的高可用 Redis/Postgres 中，隨時可以隨機砍掉 Pod 重新擴展。」
    *   「在未來擴充性上，排程核心實作了 **轉接器模式 (Adapter Pattern)**。業務邏輯只與 `IRunner` 介面互動。現在底層是 `JenkinsAdapter`，如果未來要換成 `K8sAdapter`，核心排程層與對外的 API 合約 (Contract) 一行程式碼都不用改。」
