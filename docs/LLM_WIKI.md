# LLM Project Wiki: Interactive Resume & Interview Strategy

這份文件是本專案的「核心知識庫 (Source of Truth)」，旨在讓任何大語言模型 (LLM) 或開發者能快速理解本專案的架構、邏輯與維護流程。

---

## 1. 專案定位 (Project Identity)
*   **名稱**：Bilingual Interactive Resume & Interview Strategy Repository
*   **用途**：一個基於 Web 的互動式簡報簡歷，專為 Google L4/L5 Performance Infra 面試設計。
*   **核心理念**：結合 **"Technical Depth"**（技術深度）與 **"Strategic Storytelling"**（戰略敘事）。

---

## 2. 技術棧 (Tech Stack)
*   **Frontend**: Vanilla HTML5, CSS3 (Gradients, Animations), JavaScript (ES6).
*   **Tooling**: Node.js (PDF Export), Bash (Automation scripts).
*   **Automation**: 
    *   `push.sh` / `pull.sh`: Git 同步腳本。
    *   `run.sh`: 本地開發環境。
    *   `export_pdf.js`: 使用 Puppeteer 將 HTML 轉換為高品質 PDF。

---

## 3. 目錄結構 (Directory Mapping)

| 目錄/檔案 | 說明 |
| :--- | :--- |
| `index.html` | 主入口，包含所有投影片的容器。 |
| `src/slides/` | **核心內容區**。包含每張投影片的 HTML 片段。 |
| `docs/strategy/` | **面試戰略區**。包含 BQ 指南、LP 對照與題庫。 |
| `docs/stories/` | **專案故事區**。包含 STAR 故事深挖與實戰案例。 |
| `docs/audits/` | **技術審計區**。包含源碼閱讀總結與架構分析。 |
| `.agent/` | **智能體工作區**。包含 Workflows、Skills 與數據集。 |
| `slides_order.json` | 控制投影片顯示順序的設定檔。 |
| `projects.json` | 存放在 `.agent/skills/project_archivist/data/`，為所有專案資料的真理來源。 |

---

### A. 面試戰略 (docs/strategy/)
1.  **BQ 指南**: [BQ_MASTER_GUIDE.md](file:///home/Resume/docs/strategy/BQ_MASTER_GUIDE.md) (核心戰略)
2.  **Google 行為面試**: [GOOGLE_INTERVIEW_BEHAVIOR.md](file:///home/Resume/docs/strategy/GOOGLE_INTERVIEW_BEHAVIOR.md) (實戰腳本)
3.  **系統設計與取捨**: [SYSTEM_DESIGN_TRADE_OFFS.md](file:///home/Resume/docs/strategy/SYSTEM_DESIGN_TRADE_OFFS.md) (技術深度參考)
4.  **面試題庫**: [interview_repository_bilingual.md](file:///home/Resume/docs/strategy/interview_repository_bilingual.md) (分類題庫)
5.  **LP 對照表**: [LP_MAPPING.md](file:///home/Resume/docs/strategy/LP_MAPPING.md) / [AMAZON_LEADERSHIP_PRINCIPLES.md](file:///home/Resume/docs/strategy/AMAZON_LEADERSHIP_PRINCIPLES.md)

### B. 專案故事深挖 (docs/stories/)
1.  **Ansible Dive Deep**: [ANSIBLE_DIVE_DEEP.md](file:///home/Resume/docs/stories/ANSIBLE_DIVE_DEEP.md)
2.  **Baby Tracker Sync**: [BABY_TRACKER_SYNC_LOCK.md](file:///home/Resume/docs/stories/BABY_TRACKER_SYNC_LOCK.md)
3.  **Customer Obsession**: [BABY_TRACKER_CUSTOMER_OBSESSION.md](file:///home/Resume/docs/stories/BABY_TRACKER_CUSTOMER_OBSESSION.md)
4.  **Secure Python.efi**: [SECURE_PYTHON_EFI.md](file:///home/Resume/docs/stories/SECURE_PYTHON_EFI.md)
5.  **GitLab Governance**: [GITLAB_GOVERNANCE.md](file:///home/Resume/docs/stories/GITLAB_GOVERNANCE.md)
6.  **OpenClaw Matrix**: [OPENCLAW_ARCH.md](file:///home/Resume/docs/stories/OPENCLAW_ARCH.md)
7.  **RFTool Refactor**: [RFTOOL_REFACTOR.md](file:///home/Resume/docs/stories/RFTOOL_REFACTOR.md)
8.  **故事範例集**: [BQ_STORY_EXAMPLES.md](file:///home/Resume/docs/stories/BQ_STORY_EXAMPLES.md)

### C. 源碼閱讀總結 (docs/audits/)
*此區塊包含對現有系統的深度技術審核 (Technical Audit)，用於回答 Dive Deep 類型的追問。*
*   **Infrastructure**: [ansible_audit.md](file:///home/Resume/docs/audits/ansible_audit.md), [gitlab_ci_audit.md](file:///home/Resume/docs/audits/gitlab_ci_audit.md), [gitlab_quality_gate_audit.md](file:///home/Resume/docs/audits/gitlab_quality_gate_audit.md)
*   **Systems**: [jetson_bsp_audit.md](file:///home/Resume/docs/audits/jetson_bsp_audit.md), [redfish_smbios_audit.md](file:///home/Resume/docs/audits/redfish_smbios_audit.md), [secure_python_efi_audit.md](file:///home/Resume/docs/audits/secure_python_efi_audit.md)
*   **Web & Tools**: [central_dashboard_audit.md](file:///home/Resume/docs/audits/central_dashboard_audit.md), [nvssvt_portal_audit.md](file:///home/Resume/docs/audits/nvssvt_portal_audit.md), [openclaw_matrix_audit.md](file:///home/Resume/docs/audits/openclaw_matrix_audit.md), [rftool_framework_audit.md](file:///home/Resume/docs/audits/rftool_framework_audit.md)

### D. 項目管理 (docs/)
1.  **Wiki 主頁**: [LLM_WIKI.md](file:///home/Resume/docs/LLM_WIKI.md)
2.  **開發者指南**: [DEVELOPMENT.md](file:///home/Resume/docs/DEVELOPMENT.md) (基礎 UI 修改)

---

## 5. 強制執行規則 (Mandatory Rules)

### A. 內容撰寫規則 (Content Rules)
*   **拒絕「層級堆疊」 (No Tier and Layer)**：步驟之間必須有邏輯連貫，而非簡單的條列。
*   **量化影響 (Quantified Impact)**：每個專案必須包含具體的數據（如：40% 效率提升、30% 體積縮減）。
*   **STAR-L 強化**：Action 部分必須強調 **"I"** (個人貢獻) 而非 "We"，並在 Result 後加入 **Learning**。
*   **中英雙語一致性**：投影片文字以英文為主，Markdown 備忘錄與 Speaker Notes 應提供雙語對照。

### B. 代碼與結構規則 (Coding Rules)
*   **嚴格的 HTML 結構**：專案投影片必須使用 `star-grid` 佈局。
    *   左側：`.star-content` (包含 Challenge, Solution, Impact)。
    *   結構：必須包含 `.star-card` 包裹 `.star-item`。
    *   右側：`.star-visual` (包含圖片或架構圖)。
*   **數據先行 (Data-First)**：修改專案內容時，必須先更新 `projects.json`，再同步更新 `src/slides/`。
*   **組件化開發**：禁止直接在 `index.html` 修改大量內容，應修改 `src/slides/` 下的獨立文件，再執行 `npm run build`。

### C. 檔案命名與順序 (Naming & Ordering)
*   **檔案命名**：`src/slides/` 下的文件應以數字開頭 (如 `01_ansible.html`)，這不代表最終順序。
*   **順序控制**：最終顯示順序由 `slides_order.json` 決定。


---

## 4. 內容架構思維 (Content Philosophy)

### A. 投影片結構 (Slide Structure)
每張投影片通常包含：
1.  **Visual Column**: 展示技術架構圖或成果截圖。
2.  **Text Column**: 精簡的 Bullet points。
3.  **Speaker Notes**: 隱藏內容，僅在打印時顯示，用於記錄面試時的腳本。

### B. BQ 敘事框架 (BQ Strategy)
所有故事遵循 **STAR-L** 升級版：
*   **Inner Monologue**: 展現決策時的考量與抗壓性。
*   **Future Pacing**: 說明該經驗如何轉化為對 Google 的貢獻。
*   **Technical Signals**: 埋入特定關鍵字（如：Idempotency, Drift, Race Condition）。

---

## 6. 智能體指令與工作流 (Agentic Layer)

本專案定義了專屬的指令集，供 AI 助手執行：
*   **`/add_project`**: 遵循「數據先行」原則，先更新 `projects.json`，再生成 HTML 投影片。
*   **`/tailor_resume`**: 根據 JD 與 `slides_order.json` 調整投影片組合，實現高度定制。
*   **Skills**: 
    *   `project_archivist`: 所有專案經驗的「保管人」，負責維護 `projects.json`。
    *   `resume_generator`: 負責執行 `npm run build` 與 `export_pdf.js` 的主要角色。

---

## 7. 維護流程 (Operational Procedures)

### 如何更新專案？
1.  修改 `.agent/skills/project_archivist/data/projects.json`。
2.  使用 `resume_generator` Skill 更新 `src/slides/` 下對應的 `.html` 與 `.md`。
3.  執行 `npm run build` 重新編譯 `index.html`。
4.  執行 `node export_pdf.js` 驗證 PDF 渲染效果。

### PDF 導出規範
*   使用 Puppeteer 渲染，模擬 `screen` 媒體類型但套用 `@media print` 樣式。
*   確保所有 `.animate-in` 在打印模式下為 `opacity: 1` 且無位移。

---

## 7. 重要技術指標 (Key Metrics)
*   **Performance**: 所有動畫需保持 60fps。
*   **Accessibility**: 支援鍵盤導航 (Arrows, Home, End)。
*   **Print Quality**: PDF 必須保證每張投影片佔據一頁 A4，不發生斷頁。

---

> [!TIP]
> **給 LLM 的建議**：
> 當你在修改本專案時，請優先參考 `docs/strategy/BQ_MASTER_GUIDE.md` 以確保敘事風格的一致性。任何技術更動都應在 `styles.css` 中考慮到打印模式的兼容性。
