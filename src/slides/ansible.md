# Stress Test Environment Automation (Ansible)

### 💬 口語講稿 (Pitch Script)
「在進行大規模的分散式壓力測試時，我們遇到了嚴重的『環境漂移 (Environment Drift)』問題。因為測試節點包含了 Ubuntu 跟 CentOS 等不同的作業系統，手動部署造成工具版本不一致，進而污染了測試數據。為了解決這個痛點，我利用 Ansible 設計了一套具備 **『冪等性 (Idempotent)』** 的自動化架構。更進一步，我導入了 **Test-Driven Infrastructure (測試驅動基礎設施)** 的概念，結合 Molecule 和 Testinfra，在部署前就利用 Docker 進行組態測試。這個專案不但把部署時間縮減了 90%，更徹底消除了環境漂移，確保我們每一次的效能迴歸測試都能拿到 100% 乾淨、可重現的數據。」

### ❓ 面試必殺題預覽
- **Q: 什麼是 Idempotent (冪等性)？為什麼在 Ansible 裡很重要？**
  *A: 冪等性是指無論這個腳本執行多少次，系統最終的狀態都會是一致的，不會因為重複執行而引發錯誤或產生副作用。這對於維護叢集的基礎設施極度重要，因為我們隨時可以針對所有節點套用設定，確信只有發生偏差的節點會被修正。*
- **Q: 你如何實作 Test-Driven Infrastructure (TDI)？**
  *A: 我使用了 Molecule 來驅動測試流程。當我們修改 Ansible Roles 時，Molecule 會自動起一個乾淨的 Docker Container，將 Ansible 腳本套用上去，然後再跑 Testinfra 的 Python 測試來驗證檔案權限、套件版本、服務狀態是否如預期。測試通過後才會允許這個變更合併 (Merge) 並套用到真實環境。*
- **Q: 面對不同 OS (Ubuntu / CentOS)，你是怎麼處理相容性的？**
  *A: 透過 Ansible 的 `ansible_os_family` 變數來做條件判斷，將特定 OS 的套件管理 (APT vs YUM) 和設定檔路徑進行抽象化 (Abstraction)，寫成通用的 Task，達到一套 Code 跨平台部署的效果。*
