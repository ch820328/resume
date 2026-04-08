# Interview Guide: Jetson Orin BSP & Infrastructure Optimization

## 🎤 Elevator Pitch (1-Minute)
*   **🇺🇸 English:** "When we were porting NVIDIA software to our custom boards, we had an issue where the firmware image was huge—over 5GB—and it took a long time to flash. While we were waiting on fixes, I organized a small cross-team group to look into it. I dug into the build scripts and suggested we switch to Zstd compression. This brought the image size down by 30% and cut our flashing time. It also became our team's standard way of packing images."
*   **🇹🇼 中文:** 「在幫新板子弄 Jetson 映像檔的時候，我們遇到一個問題：映像檔太大（超過 5GB），燒錄要花非常久的時間。在大家等著上面決定的時候，我主動找了硬體和 PM 一起研究。我看了一下原廠的腳本，提議改用 Zstd 壓縮。這讓映像檔縮小了 30%，燒錄時間也變短了。後來這招也順理成章變成我們部門打包映像檔的標準做法。」

## 🚀 Google L4/L5 Behavioral & Architecture Deep Dive

### [L4/L5 Behavioral] Leadership Without Authority (跨部門溝通)
*   **❓ Question:** "Tell me about a time you showed leadership, drove a cross-functional project, or mentored someone senior to you, without having the formal authority."
*   **🇺🇸 English Response:**
    *   **Context:** The project was stuck because the image flashing was too slow, and different teams were waiting on each other to fix it.
    *   **Action (Leadership):** I got everyone together and showed them exactly where the bottleneck was during the file packing process. I then proposed updating the existing NVIDIA scripts to use Zstd compression.
    *   **Impact:** By showing them the math on how much time we'd save on the production line, the senior engineers agreed. I then helped update the CI pipelines to use the new method, keeping the project moving.
*   **🇹🇼 中文回應:**
    *   **情境:** 專案進度卡住了，因為燒錄韌體太慢，各個小組又都在等別人先出手解決。
    *   **行動:** 我主動把大家找來，拉出數據給大家看時間都花在打包的哪一個步驟。接著我提議去改原廠腳本，導入 Zstd 壓縮。
    *   **影響:** 我算給資深同事聽這能幫產線省下多少時間，他們就同意了。後續我還幫忙把 CI 流程改成新的做法，順利推動了專案進展。

### [L4/L5 Architecture] Read-Many vs Write-Once Trade-offs (壓縮演算法與效能權衡)
*   **❓ Question:** "Switching from Gzip to Zstd for the RootFS gave a 30% size reduction. Why not utilize XZ which has a superior compression ratio? How did you approach the architectural trade-off?"
*   **🇺🇸 English Defense:**
    *   "It's about balancing server packing time versus unpacking time on the device."
    *   "XZ compresses files smaller, but it uses a lot of CPU to decompress, which is terrible for edge devices that don't have much power."
    *   "I chose Zstd and turned up the compression level on the server. It takes our build server a few extra minutes to pack it, but it unzips extremely fast on the actual edge device. We trade a bit of server time to make updates much quicker on the actual target devices."
*   **🇹🇼 中文防禦:**
    *   「這主要考量的是『壓縮時間』跟『解壓縮時間』的平衡。」
    *   「XZ 檔案雖然壓得很小，但在終端機器上解壓縮超級吃 CPU，花的時間太長了，這對算力不高的邊緣設備很不友善。」
    *   「所以我選 Zstd，把伺服器端的壓縮等級調高。雖然這會讓我們的 Build Server 多花幾分鐘打包，但在機台上解壓速度非常快。我們寧願讓伺服器多算一下，換取產線設備能更快完成更新。」

### [L4 System Integrity] Handling Deployment Risks (安全部署與容錯)
*   **❓ Question:** "Deploying firmware to multiple hardware SKUs introduces fragmentation. How did you eliminate the risk of bricking a device during Secure Boot signing?"
*   **🇺🇸 English Defense:**
    *   "Before, flashing was done using manual commands, so it was easy to type the wrong key or wrong parameter and brick the board."
    *   "I made a unified script. The script first checks the hardware to see what board is plugged in, and then automatically loads the right keys and settings."
    *   "This takes the guesswork out. The operator just runs one command, and the script handles the specifics, which prevents manual mistakes entirely."
*   **🇹🇼 中文防禦:**
    *   「以前燒錄是靠工程師手動打指令，很容易打錯參數或帶錯金鑰，不小心就把板子刷成磚頭。」
    *   「我寫了一個統一的自動化腳本。這支腳本跑之前會先去偵測現在接的是哪一塊板子，然後自動帶入對應的金鑰跟設定。」
    *   「把這些流程自動化後，操作員只要下一個簡單的指令就好，其他的腳本會自己判斷，從根本上避免了手動打錯字的問題。」
