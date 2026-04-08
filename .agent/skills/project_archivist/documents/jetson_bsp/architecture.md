# Jetson BSP Development & Automation Architecture

## 1. Core Logic & Workflow (Based on `build.sh`)
The build process is deeply automated and "Offline First", removing the need for a live Jetson device during the build phase.

### A. Environment & Pre-checks
*   **Modular Design**: Uses library scripts (`lib_logging.sh`, `lib_env.sh`, `lib_precheck.sh`) for maintainability.
*   **Safety**: Enforces `set -euo pipefail` to fail fast on errors (Critical for CI/CD).
*   **Variables**:
    *   `BOARD_CONFIG_NAME`: `smci-orin-nano-hdmi-nvme` (Custom Config)
    *   `BSP_VERSION`: `R36-4` (JetPack 6.x)

### B. Artifact Extraction
*   Extracts `L4T_RELEASE_PACKAGE`, `SAMPLE_FS_PACKAGE` (RootFS), `KERNEL_SOURCE`, `OOT_MODULE_SOURCE`.
*   **Binaries**: Applies NVIDIA L4T binaries and creates a default user (`l4t_create_default_user.sh`).
*   **Toolchain**: Sets up the AArch64 cross-compilation toolchain on the fly.

### C. Kernel Customization (The Hard Parts)
*   **Goal**: Enable **NVMe**, **PCIe**, **USB Type-C**, and **HDMI** on the custom SMCI board.
*   **Configuration**:
    *   `make defconfig` -> `scripts/config` patching -> `make olddefconfig`.
    *   **Crucial Drivers Enabled**:
        *   `CONFIG_PCIE_TEGRA194` / `CONFIG_PCIE_DW` (PCIe Host/EP)
        *   `CONFIG_BLK_DEV_NVME` (NVMe Boot Support)
        *   `CONFIG_PINCTRL_TEGRA234` (Orin GPIOs)
        *   `CONFIG_USB_XHCI_TEGRA` (USB 3.x)
    *   **Validation**: Script automatically verifies if `.config` actually retained the changes (Anti-Silent-Failure).
*   **Compilation**: Builds `Image` and installs modules (`modules_install`) into the RootFS.

### D. OOT (Out-of-Tree) Modules
*   **NVIDIA OOT**: Compiles Wi-Fi/BT/Display drivers using the compiled kernel headers.
*   **Custom Modules**:
    *   Compiles `smci_test.ko` (likely a hardware validation driver) and injects it into `/lib/modules/.../extra`.
    *   Runs `depmod` and `l4t_update_initrd.sh` to ensure the InitRAMFS sees the new modules.

### E. Device Tree (DTS) Customization
*   **Target**: `tegra234-p3768-0000+p3767-0000` (Orin Nano/NX).
*   **Patching Strategy**:
    *   Copies `smci-carrier-patch.dtsi`.
    *   **Sanitization**: Removes invisible `NBSP (0xA0)` characters (Common copy-paste error from web documentation).
    *   **Injection**: Appends `#include "smci-carrier-patch.dtsi"` to the *end* of the main DTS to override default settings (Last-Write-Wins).
*   **Deployment**: Overwrites the `kernel/dtb` files with the newly compiled blobs.

### F. RootFS Customization
*   **Service Injection**:
    *   `superedge-clientscc.service`: Injected via `scc/install.sh`.
    *   `first-boot-report.service`: One-time telemetry reporter.
*   **OEM Config**: Injects `rootfs_oem` (probably Wi-Fi configs, certs).
*   **systemd**: Disables `nvfancontrol` (likely custom thermal management or fanless design).

### G. Image Generation (MassFlash & OTA)
This is the most critical L4/Senior part.
*   **MassFlash (MFI)**:
    *   Runs `l4t_initrd_flash.sh --no-flash --massflash 5`.
    *   Generates a tarball (`mfi_*.tar.gz`) that factory lines can use to flash 5 boards at a time.
*   **OTA (Over-The-Air)**:
    *   **Patching NVIDIA Scripts**:
        *   Modifies `l4t_generate_ota_package.sh` to recognize `smci-orin-nano-hdmi-nvme` (bypassing the hardcoded DevKit check).
        *   Modifies `nv-l4t-bootloader-config.sh` to force `board_ver="000"` (fixing SKU mismatch issues).
    *   **Board Specs**:
        *   Merges `patch_ota_board_specs.conf` into NVIDIA's whitelist.
        *   Filters based on `BOARDID` and `BOARDSKU` (handling 0000 vs 0001).
    *   **Output**: Produces a rigorous OTA Payload (`ota_payload_package.tar.gz`).

## 2. Technical Highlights for Resume
*   **Deep Linux Knowledge**: Handling `chroot`, `systemd`, `initrd` updates, and Device Tree Overlays.
*   **Embedded Build Systems**: Writing a "Meta-Build System" that orchestrates Kernel, U-Boot (implied via L4T), and RootFS assembly.
*   **Production Readiness**:
    *   **Mass Production**: Supporting MassFlash (parallel flashing).
    *   **FOTA**: Implementing the full capsule update flow (Capsule/Payload generation).
    *   **Reliability**: Automated checks (Kernel config verification, version string parsing).

## 3. Reference Files
*   `/home/jetson/jetson-build-server/storage/script/boards/3767_0001/36_4_4/build.sh` (Source of Truth)
