# Interview Guide: Secure CD & Automated Release Engineering

## 🎤 Elevator Pitch (1-Minute)
*   **🇺🇸 English:** "I eliminated high-risk manual SSH deployments from our release engineering process. I designed a zero-trust, Webhook-driven CD pipeline where GitLab can never directly SSH into production. A hardened internal Deployment Agent verifies HMAC signatures and executes atomic symlink swaps for instant rollbacks. Combined with Semantic Versioning enforcement via CHANGELOG parsing, releases now take 30 seconds instead of 15 minutes across 20+ microservices."
*   **🇹🇼 中文:** 「我從根本上消滅了高風險的手動 SSH 部署流程。我設計了一套零信任、Webhook 驅動的 CD 管線：GitLab 永遠無法直接 SSH 進正式主機。一個經過加固的內部部署 Agent 驗證 HMAC 簽章，並執行原子性的軟連結切換以實現瞬間回滾。搭配從 CHANGELOG 解析驅動的語意版本控制，超過 20 個微服務的發布時間從 15 分鐘縮短到了 30 秒。」

## 🚀 Google L4/L5 Behavioral & Architecture Deep Dive

### [L4/L5 Behavioral] Improving Security Posture Proactively (主動改善安全態勢)
*   **❓ Question:** "Tell me about a time you identified a significant security risk and took ownership of fixing it."
*   **🇺🇸 English Response:**
    *   **Context:** The original deployment process stored SSH private keys as GitLab CI environment variables—a critical vulnerability. If CI was compromised, all production servers were at risk.
    *   **Action:** I proposed and built a Deployment Agent model from scratch. The agent lives on the server, listens only to a specific internal webhook, and verifies every request with HMAC. GitLab CI holds only the webhook secret—never an SSH key.
    *   **Impact:** Eliminated persistent privileged credentials from CI entirely, reducing the blast radius of a potential CI compromise from "all servers owned" to "zero servers owned."
*   **🇹🇼 中文回應:**
    *   **情境:** 原本的部署流程把 SSH 私鑰存在 GitLab CI 環境變數裡——一個嚴重的漏洞。如果 CI 被攻陷，所有正式主機都會暴露。
    *   **行動:** 我從零設計並構建了部署 Agent 模型。Agent 常駐在伺服器上，只監聽特定的內部 Webhook，並用 HMAC 驗證每個請求。GitLab CI 只持有 Webhook 密鑰——永遠不持有 SSH 金鑰。
    *   **影響:** 徹底消除了 CI 中的常駐特權憑證，將潛在 CI 遭攻陷的爆炸半徑從「所有伺服器淪陷」縮小至「零伺服器淪陷」。

### [L4 Architecture] Zero-Trust Webhook Security (零信任 Webhook 安全架構)
*   **❓ Question:** "Your Webhook endpoint is inside the VPN, but if a malicious actor inside the VPN sends a custom HTTP request, can they force a rogue deployment?"
*   **🇺🇸 English Defense:**
    *   "**VPN is not trust.** Every request, regardless of origin, must be cryptographically verified."
    *   "GitLab signs the entire request payload with a **HMAC-SHA256** using a shared secret and includes it in the `X-Gitlab-Token` header. The Agent recomputes the hash using the same secret. If they don't match to the byte, the request is rejected with HTTP 401 before any code executes."
    *   "**Trade-off:** This adds ~1ms of hashing overhead per request—completely negligible for a deployment trigger that fires a few times a day."
*   **🇹🇼 中文防禦:**
    *   「**VPN 不等於信任。** 每個請求，不論來源，都必須通過密碼學驗證。」
    *   「GitLab 使用共享密鑰對整個請求 Payload 進行 **HMAC-SHA256** 簽章，並包含在 `X-Gitlab-Token` 標頭中。Agent 用相同密鑰重新計算雜湊值。如果對不上，請求在任何程式碼執行之前就被拒絕（HTTP 401）。」
    *   「**取捨:** 每個請求增加約 1ms 的雜湊計算開銷——對於每天只觸發幾次的部署事件來說，完全可以忽略不計。」

### [L5 Architecture] Atomic Rollback & Progressive Delivery (原子回滾與漸進式交付)
*   **❓ Question:** "Your symlink swap is atomic at the filesystem level, but what if the new version deploys successfully and passes health checks, yet still has a subtle bug discovered 10 minutes later by users?"
*   **🇺🇸 English Defense:**
    *   "Atomic symlink swap is not a replacement for Progressive Delivery—it's a last-resort protection."
    *   "The ideal next step is **Canary Deployments**. Route 5% of production traffic to the new version, monitor error rates and latency via Prometheus/Grafana, and only proceed to 100% if metrics stay within SLO bounds."
    *   "The Deployment Agent can be extended to call the load balancer's API to control traffic weights—enabling automated rollback if the canary's error rate exceeds threshold."
*   **🇹🇼 中文防禦:**
    *   「原子性 Symlink 切換不是漸進式交付的替代品——它只是最後一道保護。」
    *   「理想的下一步是 **金絲雀部署 (Canary Deployments)**。先將 5% 的正式流量導向新版本，透過 Prometheus/Grafana 監控錯誤率與延遲，只有當指標維持在 SLO 範圍內時，才推進到 100%。」
    *   「部署 Agent 可以擴展為呼叫負載均衡器的 API 來控制流量權重——如果金絲雀的錯誤率超過閾值則自動觸發回滾。」
