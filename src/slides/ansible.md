# Interview Guide: Test-Driven Infrastructure as Code (Ansible)

## 🎤 Elevator Pitch (1-Minute)
*   **🇺🇸 English:** "We had a problem where stress tests ran on 4 different machines, but the results didn't match because the environments weren't synced. The tools had different versions everywhere. Instead of fixing them manually one by one, I wrote a test-driven Ansible framework. I used Ansible roles and Testinfra to make sure the environments are always exactly the same. This cut our setup time from over an hour to under 5 minutes, and stopped the version sync issues."
*   **🇹🇼 中文:** 「我們遇到一個問題：在 4 台不同機器上跑壓力測試，但因為環境沒同步好，每台機器的工具版本都不一樣，導致跑出來的數據根本沒法比。與其手動一台一台去修，我直接寫了一套有測試機制的 Ansible 框架。透過 Ansible 的角色設定跟 Testinfra 自動檢查，我們保證了每台機器環境的一致性。這把原本要花一小時以上的建置時間縮短到 5 分鐘內，也解決了版本不同步的問題。」

## 🚀 Google L4/L5 Behavioral & Architecture Deep Dive

### [L4/L5 Behavioral] Proactively Fixing Systemic Problems (主動修復系統性問題)
*   **❓ Question:** "Tell me about a time you saw an organizational inefficiency, took ownership, and fixed it without being asked."
*   **🇺🇸 English Response:**
    *   **Context:** Engineers were arguing about test results because the benchmarking tool gave different numbers on different machines.
    *   **Action (Ownership):** I found out there was no standard way to setup the machines. Instead of just logging a ticket, I built a shared Ansible setup. I also added CI with Testinfra so any changes to the setup are tested before being merged.
    *   **Impact:** It fixed the immediate issue, and going forward, this Ansible setup became the standard way we bring up new machines for the team.
*   **🇹🇼 中文回應:**
    *   **情境:** 大家在吵跑分數據不準，因為同一個工具在不同機器上跑出來的結果差很多。
    *   **行動 (主動承擔):** 我發現根本原因是沒有標準的機器設定流程。所以我沒有只是開個 ticket，而是主動寫了一套共用的 Ansible 腳本來固定版本。我還加了 CI 自動跑 Testinfra 測試，確保以後有人改腳本不會把環境弄壞。
    *   **影響:** 這不只解決了當下的問題，後來這套流程也變成我們部門新人架設環境的標準。

### [L4 Architecture] Idempotency & State Management (狀態管理)
*   **❓ Question:** "How do you strictly enforce that your Ansible roles remain idempotent? Can you walk me through your Testinfra validation strategy?"
*   **🇺🇸 English Defense:**
    *   "I stick to Ansible's built-in modules instead of writing shell scripts, because the built-in ones handle state automatically."
    *   "In our CI, we run the playbook twice. The second time it runs, it has to report zero changes. If it changes something the second time, the CI fails."
    *   "With Testinfra, we really check the system state: making sure the kernel parameters are applied or the service is actually running, not just checking if the script finished without errors."
*   **🇹🇼 中文防禦:**
    *   「我盡量用 Ansible 內建的模組，不用原生的 shell 指令，因為內建模組本來就有防呆（冪等性），跑兩次不會出問題。」
    *   「在 CI 裡面，我會強制腳本跑兩次。第二次跑的時候，必須顯示沒有改變（changed=0），不然 CI 就不放行。」
    *   「Testinfra 主要是用來驗證機器真正的狀態：像是確認系統的參數有沒有設對、服務有沒有真的跑起來，而不是只看腳本有沒有順利跑完。」

### [L5 Architecture] Scaling Config Management (規模化配置管理)
*   **❓ Question:** "If your fleet scaled to 10,000 servers across multiple data centers, where does your current Ansible push-based model break down? How would you redesign it?"
*   **🇺🇸 English Defense:**
    *   "**Bottleneck:** The problem with Ansible's push model is it's heavy on the control node. Over a shaky network, some machines update and some don't, leaving the cluster in a weird state."
    *   "**Redesign:** To fix this, I'd switch to a Pull model like GitOps. Each server runs a small agent that pulls its own config from Git and applies it locally. This spreads out the work and handles network drops easily without overloading one central server."
*   **🇹🇼 中文防禦:**
    *   「**瓶頸:** Ansible 是由一台主控機把設定『推』（Push）出去，機器一多，主控機的 CPU 和網路就會爆。而且只要中間網路一閃斷，有些機器更新了、有些沒更新，狀態就會亂掉。」
    *   「**重新設計:** 要解決這個，我會改成『拉』（Pull）的模式。也就是在每台機器上裝一個輕量的 Agent，定期去 Git 拉設定檔下來自己跑。這樣運算壓力就分散了，就算斷網也能自己恢復，不會卡死單一一台主控伺服器。」
