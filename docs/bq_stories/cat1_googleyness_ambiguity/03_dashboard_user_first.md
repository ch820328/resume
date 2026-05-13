# 03. User First | 用戶至上 (Variant 2)
## Project: Central Dashboard (Developer & Tester Tool Hub)

### 🎭 STAR Story (English)

*   **Situation**: 
    Our RDs and Testers were forced to operate in a "fragmented" tool environment. To manage a single task, they had to jump between Redmine for issues, GitLab for code tickets, and multiple manual scripts to control the SUT (System Under Test). This high entry barrier and constant context-switching were major productivity killers, especially for new team members.
*   **Task**: 
    My goal was to put the **Developer Experience (DX)** first by building a "Single Window" engineering hub that made tool usage "Simple, Fast, and Easy."
*   **Action**: 
    I designed and developed the **Central Dashboard**. I integrated APIs from **Redmine and GitLab** to aggregate all tickets and issues into a unified task view. Most importantly, I developed a **Remote SUT Control** module within the web interface, allowing users to power-cycle or reset hardware without leaving the browser. I focused on a clean, intuitive UI that abstracted away the complex backend configurations.
*   **Result**: 
    Significantly lowered the tool barrier for the entire team. We reduced cross-platform switching time by **60%** and shortened the onboarding time for new hires from days to hours. The portal became the primary workspace for all engineering activities.
*   **Learning**: 
    "User First" in an engineering context means respecting the **Engineer's Time**. By centralizing fragmented tools into a single, cohesive UX, you eliminate cognitive load and allow the team to focus on solving actual engineering problems rather than fighting with the infrastructure.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    我們的 RD 和 Tester 過去被迫在「碎片化」的工具環境中工作。為了處理單一任務，他們必須在 Redmine（看 Issue）、GitLab（看 Ticket）以及多個手動控制 SUT（受測系統）的腳本之間來回切換。這種高進入門檻和不斷的上下文切換是生產力的巨大殺手，對於新團隊成員來說尤其如此。
*   **任務 (Task)**: 
    我的目標是以 **「開發者體驗 (DX)」** 為優先，建立一個「單一窗口」的工程中心，讓工具的使用變得「簡單、快速、輕鬆」。
*   **行動 (Action)**: 
    我設計並開發了 **「中央工具門戶 (Central Dashboard)」**。我串接了 **Redmine 與 GitLab** 的 API，將所有 Ticket 和 Issue 聚合到統一的任務視圖中。最重要的是，我在網頁介面中開發了 **「遠端 SUT 控制」** 模組，讓使用者無需離開瀏覽器即可對硬體進行電源循環或重置。我專注於簡潔、直觀的 UI 設計，抽象化了複雜的後端配置。
*   **結果 (Result)**: 
    顯著降低了整個團隊的工具門檻。我們減少了 **60%** 的跨平台切換時間，並將新人的入職培訓時間從數天縮短到數小時。該門戶網站成為了所有工程活動的主要工作空間。
*   **反思 (Learning)**: 
    在工程情境中的「用戶至上」意味著尊重 **「工程師的時間」**。透過將碎片化的工具整合進單一且一致的 UX 中，可以消除認知負荷，讓團隊專注於解決真正的工程問題，而不是與基礎設施糾纏。

---

### ❓ 模擬問答 (Possible Q&A)

1.  **問：「你是如何決定哪些工具應該優先整合進來的？」**
    *   **🇺🇸 English**: "I took a **'Friction-Based' approach**. I surveyed the team and identified that SUT control and issue tracking were the two most frequent context-switch triggers. By prioritizing these 'high-friction' areas, we achieved the highest immediate impact on team productivity."
    *   **🇹🇼 中文**: 「我採用了 **『摩擦力導向』的方法**。我調查了團隊，發現 SUT 控制與議題追蹤是觸發上下文切換頻率最高的兩個點。透過優先處理這些『高摩擦』領域，我們對團隊生產力產生了最大的即時影響。」

2.  **問：「整合這麼多異質系統，你是如何保證系統的穩定性與擴展性的？」**
    *   **🇺🇸 English**: "I used a **Service-Oriented Architecture (SOA)**. The dashboard acts as a thin client that consumes specialized backend microservices. This decoupling ensured that if the GitLab API was slow, it wouldn't freeze the SUT control module, keeping the overall tool responsive and reliable."
    *   **🇹🇼 中文**: 「我使用了 **面向服務的架構 (SOA)**。儀表板作為一個瘦客戶端，調用專門的後端微服務。這種解耦確保了即使 GitLab API 響應緩慢，也不會凍結 SUT 控制模組，保持了整體工具的響應性與可靠性。」

3.  **問：「評分 (Score)」**
    *   **Rating**: **8.5/10** (展現了極強的「開發者體驗 (DX)」意識，這是資深工具開發者或 DevOps 工程師非常加分的特質。)
