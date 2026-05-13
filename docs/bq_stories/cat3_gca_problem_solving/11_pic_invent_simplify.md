# 11. Invent & Simplify | 創新與簡化 (Variant 2)
## Project: PIC Transcript (Mathematical CV Approach)

### 🎭 STAR Story (English)

*   **Situation**: 
    To automate legacy hardware testing, the standard suggestion from other teams was to use deep learning models (like YOLO) to identify UI elements. However, this would require massive image labeling and expensive GPU infrastructure at every factory site.
*   **Task**: 
    Find a simpler, more cost-effective way to achieve the same result without the "AI overhead."
*   **Action**: 
    I challenged the assumption that "Deep Learning is the only answer." I realized that for fixed-perspective industrial monitors, we didn't need a neural network. I "invented" a workflow using **pure mathematical Template Matching** (`TM_CCOEFF_NORMED`) from OpenCV. I "simplified" the deployment by bundling everything into a lightweight Python package that runs on a standard CPU. I used **Normalized Cross-Correlation** to handle lighting noise, delivering the same accuracy as a DL model but with **zero training cost** and minimal hardware requirements.
*   **Result**: 
    Reduced infrastructure costs by **90%** compared to a GPU-based solution, while maintaining 100% accuracy for BIOS validation.
*   **Learning**: 
    Innovation is often about "finding the simplest path," not the most complex one. Sometimes, a strong mathematical foundation can simplify a problem more effectively than the latest AI trend.

---

### 🎭 STAR Story (中文)

*   **情境 (Situation)**: 
    為了自動化舊硬體測試，其他團隊的標準建議是使用深度學習模型（如 YOLO）來識別 UI 元素。然而，這需要在每個工廠端進行大量的影像標註，並購置昂貴的 GPU 基礎設施。
*   **任務 (Task)**: 
    在沒有「AI 負擔」的情況下，尋找一種更簡單、更具成本效益的方法來達成同樣的結果。
*   **行動 (Action)**: 
    我挑戰了「深度學習是唯一答案」的假設。我意識到對於視角固定的工業顯示器，我們並不需要神經網路。我「創新」了一個工作流，使用 OpenCV 中 **純數學的模板匹配 (`TM_CCOEFF_NORMED`)**。我透過將所有內容打包成一個能在標準 CPU 上運行的輕量級 Python 包來「簡化」部署。我利用 **「歸一化互相關」** 來處理光影雜訊，提供與深度學習模型相同的準確度，但 **零訓練成本** 且硬體要求極低。
*   **結果 (Result)**: 
    與基於 GPU 的方案相比，基礎設施成本降低了 **90%**，同時維持了 BIOS 驗證的 100% 準確率。
*   **反思 (Learning)**: 
    創新通常在於「尋找最簡單的路徑」，而非最複雜的路徑。有時候，強大的數學基礎比最新的 AI 趨勢更能有效地簡化問題。
