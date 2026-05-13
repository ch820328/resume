# 02. Helpfulness / Team First | 團隊精神
## Project: GitLab Runner Enablement (Cross-Department Support)

### 🎭 STAR Story (English)

*   **Situation**: 
    While I was standardizing CI/CD for our main products, I noticed that the Manufacturing Systems team was still relying on slow, manual deployment processes. They had multiple repositories but lacked the infrastructure and bandwidth to set up their own automation environment.
*   **Task**: 
    Even though it wasn't my assigned responsibility, I decided to help them "bridge the gap" by setting up the necessary CI infrastructure for their projects.
*   **Action**: 
    I proactively identified the bottlenecks in their workflow. I took the initiative to **Enable and Configure GitLab Runners** for over 10 of their active projects. I provided them with a standardized, lightweight CI configuration that required zero learning curve for their team. I focused on making the transition "invisible" yet impactful, ensuring their existing developer workflow remained unchanged while adding the power of automation.
*   **Result**: 
    The team successfully moved away from manual deployments, reducing their cycle time from 1 hour to **10 minutes**. This initiative significantly lowered the technical debt across the organization and established a baseline for future automation.
*   **Learning**: 
    Helpfulness in a professional environment is about **reducing friction for others**. By proactively setting up the "unseen" infrastructure (like Runners), you enable other teams to focus on their core logic, leading to better overall company velocity.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    當我在為我們的主力產品標準化 CI/CD 時，我注意到生產系統團隊仍然依賴緩慢的手動部署流程。他們擁有多個代碼庫，但缺乏建立自己自動化環境的基礎設施與人力。
*   **任務 (Task)**: 
    儘管這不是我被指派的職責，我仍決定透過為他們的專案建立必要的 CI 基礎設施，來幫他們「填補這個空缺」。
*   **行動 (Action)**: 
    我主動識別了他們工作流中的瓶頸。我主動為他們超過 10 個活躍專案 **啟用並配置了 GitLab Runner**。我為他們提供了一套標準化、輕量級的 CI 設定，讓他們的團隊幾乎不需要學習成本。我專注於讓這種過渡變得「無形」但具有影響力，確保他們現有的開發流程保持不變，同時加入了自動化的力量。
*   **結果 (Result)**: 
    該團隊成功擺脫了手動部署，將週期時間從 1 小時縮短至 **10 分鐘**。這項舉措顯著降低了整個組織的技術債，並為未來的自動化奠定了基礎。
*   **反思 (Learning)**: 
    職業環境中的「協助精神」在於 **為他人減少摩擦**。透過主動建立那些「看不見」的基礎設施（如 Runner），你讓其他團隊能專注於其核心邏輯，進而提升公司整體的運作速度樣。

---

### ❓ 模擬問答 (Possible Q&A)

1.  **問：「為什麼你要主動去幫其他部門啟用 Runner？這不是你的工作，難道不會耽誤你自己的進度嗎？」(Ownership & Prioritization)**
    *   **🇺🇸 English**: "In a large engineering organization, my work is only as fast as the slowest dependency. I saw their manual process as a potential bottleneck for our future integrated tests. I didn't spend weeks on it; I used my existing automation templates to set up their Runners in a few hours. It was a high-ROI activity that benefited the whole company velocity."
    *   **🇹🇼 中文**: 「在大型工程組織中，我的速度取決於最慢的依賴項。我將他們的手動流程視為我們未來整合測試的潛在瓶頸。我並非花了數週時間，而是利用現有的自動化模板，在幾小時內就幫他們配置好了 Runner。這是一項高投資報酬率 (ROI) 的行動，對全公司的運作速度都有好處。」

2.  **問：「你是如何確保你幫他們配置的 Runner 不會干擾到他們原有的開發流程？」(Impact Awareness)**
    *   **🇺🇸 English**: "I followed a **'Non-Intrusive' approach**. I set up the Runners as 'Tagged Runners' so they would only pick up jobs if specifically requested. I also designed the initial CI scripts to be 'Optional'—if the runner failed for some reason, it wouldn't block their manual deployment path initially. This allowed them to transition to automation at their own pace."
    *   **🇹🇼 中文**: 「我遵循 **『無侵入式』原則**。我將 Runner 設定為『標籤化 (Tagged)』，確保它們僅在被明確要求時才執行任務。此外，我設計的初始 CI 腳本是『可選的』——如果 Runner 因某種原因失敗，最初並不會阻礙他們的手動部署路徑。這讓他們能以自己的節奏過渡到自動化。」

3.  **問：「評分 (Score)」**
    *   **Rating**: **8.5/10** (展現了強大的全局意識與「主動排除阻礙」的特質，這在 Google L4/L5 級別是非常受歡迎的加分項。)
