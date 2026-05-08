# 面試備忘錄：統一數位指揮中心與全棧門戶 (Central Dashboard)

這張投影片的核心在於：**將碎片化的運維工具整合為單一窗口體驗，透過架構設計降低開發者的認知負荷。**

---

### 1. 💬 口語說明 (Colloquial Explanation)

*   **🇺🇸 English (Simple & Direct):**
    "Our engineering tools were scattered everywhere, making it hard for teams to focus. I architected a 'Central Dashboard' as a single entry point for everything—from logs to deployment status. I used a Micro-Frontend approach so teams could update their own tools without breaking the whole site. This reduced cognitive load by 40% and made it much easier for everyone to stay on top of their systems."
    
*   **🇹🇼 中文 (口語精簡):**
    「我們的開發工具散落在各處，讓團隊很難專注。我設計了一個『統一數位指揮中心』作為所有工具（從日誌到部署狀態）的單一入口。我採用了類微前端架構，讓各團隊可以獨立更新自己的工具而不影響整個平台。這減少了 40% 的認知負擔，讓每個人都能更輕鬆地掌控自己的系統狀態。」

---

### 2. ❓ 模擬問答 (Possible Q&A - Google/Amazon Hybrid Strategy)

1.  **問：「為什麼要花力氣做整合，而不直接給各服務獨立網址？」(Customer Obsession / Invent and Simplify)**
    *   **🇺🇸 English**: "To reduce **Context Switching**. Jumping between tabs with different styles and logins is exhausting. A unified portal enforces a single security policy and provides a cohesive UX. For a developer, simplicity is a feature that directly boosts productivity."
    *   **🇹🇼 中文**: 「為了減少**上下文切換 (Context Switching)**。在不同風格與登入機制的頁面跳轉是很累人的。統一門戶能強制推行安全性策略並提供一致的體驗。對開發者來說，『簡潔』就是直接提升生產力的功能。」

2.  **問：「當初要整合這麼多異質系統時，你擔心的點是什麼？」(Inner Monologue)**
    *   **🇺🇸 English**: "I was worried about creating a **Monolithic Bottleneck**. If the dashboard goes down, I didn't want it to take everything else with it. I felt that 'Availability' was the biggest risk. This pushed me to implement an asynchronous loading pattern and ensure that the backend services remained decoupled."
    *   **🇹🇼 中文**: 「我擔心會造成**單體瓶頸**。如果門戶掛掉，我不希望它連累到其他服務。我意識到『可用性』是最大風險，這促使我實作了非同步載入模式，並確保後台服務保持解耦。」

3.  **問：「你是如何處理不同專案組之間的權限隔離？」(Dive Deep / Security)**
    *   **🇺🇸 English**: "I implemented **RBAC (Role-Based Access Control)** integrated with our LDAP. The system dynamically renders the UI based on the user's role. If you don't have access to a specific tool, it's either hidden or disabled in the navigation logic, ensuring zero unauthorized exposure."
    *   **🇹🇼 中文**: 「我實作了與 LDAP 整合的 **RBAC (角色存取控制)**。系統會根據角色動態渲染 UI。如果你沒有特定工具的權限，它在導航選單中就會被隱藏或禁用，確保沒有未經授權的暴露。」

4.  **問：「類微前端架構在這個專案中解決了什麼具體技術問題？」(Dive Deep / Performance Awareness)**
    *   **🇺🇸 English**: "It solved the **Build Time and Dependency Conflict** issues. Different tools use different versions of libraries (e.g., React vs Vue). By using a micro-frontend style, we can load individual modules as separate bundles, preventing global namespace pollution and keeping initial page loads light."
    *   **🇹🇼 中文**: 「它解決了**構建時間與依賴衝突**的問題。不同工具有不同版本的庫。透過微前端風格，我們可以將各模組作為獨立 Bundle 載入，防止全局命名空間污染，並保持初始頁面加載的輕量化。」

5.  **問：「這項工作體現了你對 Google 產品價值的什麼理解？」(Future Pacing)**
    *   **🇺🇸 English**: "Google excels at organizing information. This project was about organizing 'Engineering Information.' I will bring this focus on UX and information architecture to Google's internal infra, making our complex systems feel intuitive for every engineer."
    *   **🇹🇼 中文**: 「Google 擅長組織資訊，而這個專案就是在組織『研發資訊』。我會將這種對 UX 與資訊架構的專注帶到 Google 的內部基礎設施，讓複雜的系統對每位工程師來說都顯得直覺。」

6.  **問：「整合後的 40% 效率提升是怎麼計算出來的？」(Data-Driven / Deliver Results)**
    *   **🇺🇸 English**: "We measured the **Time-to-Action**. Before, an engineer took an average of 5 minutes to find and log into three different tools during an incident. Now, it takes less than 3 minutes. This reduction in 'friction' translates directly to a faster MTTR (Mean Time To Recovery)."
    *   **🇹🇼 中文**: 「我們測量了 **Time-to-Action (行動耗時)**。以前工程師在處理事故時，平均要花 5 分鐘來尋找並登入三個不同工具。現在只要不到 3 分鐘。這種『摩擦力』的減少直接轉化為更快的 MTTR (平均修復時間)。」

---

### 3. 📚 技術名詞解析 (Technical Glossary)

*   **🇺🇸 Single-pane-of-glass / 🇹🇼 單一窗口/玻璃**:
    A management console that integrates data from multiple sources into a single display. (將來自多個來源的數據整合進單一顯示界面的管理主機。)
*   **🇺🇸 Micro-Frontend / 🇹🇼 微前端**:
    An architectural style where a frontend app is decomposed into individual, semi-independent micro-apps. (將前端應用分解成多個獨立微應用的架構風格。)
*   **🇺🇸 RBAC (Role-Based Access Control) / 🇹🇼 角色存取控制**:
    A method of regulating access to computer or network resources based on the roles of individual users. (根據使用者角色來管制電腦或網路資源存取權的方法。)
*   **🇺🇸 Token Propagation / 🇹🇼 令牌傳遞**:
    Passing identity tokens across different services to maintain a user's session without re-authenticating. (在不同服務間傳遞身份令牌，以維持連線而不需要重複登入。)
*   **🇺🇸 Context Switching / 🇹🇼 上下文切換**:
    The time and cognitive effort required to move from one task or environment to another. (從一個任務或環境移至另一個時所需的時間與心理開銷。)
