# BIOS Preserve Configuration Test - Architecture Documentation

## Project Overview

**Tool Name**: `CheckBIOSPreserveSetupConfigurationX64.efi`  
**Version**: 1.00  
**Framework**: EDK (EFI Development Kit)  
**Platform**: UEFI Shell  
**Purpose**: Automated validation of BIOS configuration preservation after firmware flash

---

## System Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│               UEFI Shell Environment                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  CheckBIOSPreserveSetupConfigurationX64.efi          │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Checkpoint Manager                            │  │  │
│  │  │  - State Persistence (restart.flg/reboot.flg)  │  │  │
│  │  │  - Progress Tracking                           │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐      │  │
│  │  │  CP1   │→ │  CP2   │→ │  CP3   │→ │  CP4   │      │  │
│  │  │ Modify │  │ Flash  │  │ Verify │  │Restore │      │  │
│  │  │Settings│  │  BIOS  │  │Settings│  │Defaults│      │  │
│  │  └────────┘  └────────┘  └────────┘  └────────┘      │  │
│  │      │            │            │           │          │  │
│  │  [NVRAM]    [SAA.efi]    [NVRAM]    [IPMI]          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
            │               │               │
            ▼               ▼               ▼
     SceEfi Tool      BMC/Redfish      IPMI Commands
```

---

## Core Components

### 1. **Checkpoint Engine**

Implements state machine for multi-reboot test execution:

```c
typedef enum {
    CP_UPDATE_CONFIG    = 1,  // Modify BIOS settings
    CP_FLASH_BIOS       = 2,  // Flash with preserve flags
    CP_VERIFY_PRESERVE  = 3,  // Verify configuration retention
    CP_RESTORE_DEFAULTS = 4   // CMOS clear
} CheckPoint;
```

**State Persistence**:
- `restart.flg`: Contains tool name, date, time, execution metadata
- `reboot.flg`: Tracks current checkpoint and reboot reason
- Survives power cycles via filesystem storage

### 2. **NVRAM Parser**

Extracts and compares BIOS setup variables:

**Monitored Settings**:
- **PXE Configuration**: IPv4/IPv6 PXE Support (GUID offsets: AA, B1, AC, B3)
- **NVMe Firmware Source**: Vendor Defined vs. Inbox (GUID offset: C6)
- **Boot Order**: Fixed Boot Option #1-9 (GUIDs: 2080-2088)
- **USB Priority**: UEFI USB Key Boot Options (GUIDs: 2544-2545)
- **Application Boot**: UEFI AP Boot Option (GUID: 25DC)

**Comparison Logic**:
```
NVRAM_Expected.txt  ←→  NVRAM_Download.txt
     (Baseline)              (Actual)
         │                       │
         └───────┬───────────────┘
                 ▼
           Diff Engine
                 │
           ┌─────┴─────┐
           │           │
          PASS        FAIL
```

### 3. **Flash Integration**

**Tool**: SAA (Supermicro Automation Assistant)  
**Command Structure**:
```bash
SAA.efi -I Redfish_HI \
        -u ADMIN \
        -p PASSWORD \
        -c UpdateBios \
        --file BIOS_ROM.bin \
        --reboot \
        --preserve_setting \  # Critical flag
        --preserve_nv         # NVRAM preserve
```

**Upload Mechanism**:
1. Load BIOS binary from local filesystem
2. Upload to BMC via Redfish API
3. BMC triggers flash process
4. System auto-reboots into new firmware

### 4. **IPMI Interface**

**CMOS Clear Command**:
```c
// Raw IPMI: NetFn=0x00, Cmd=0x08
UINT8 request[] = {0x05, 0x80, 0x80, 0x00, 0x00, 0x00};
SendRawIPMI(0x00, 0x08, request, sizeof(request));
```

**Purpose**: Restore all BIOS settings to manufacturing defaults

---

## Test Execution Flow

### Checkpoint 1: Update BIOS Setup Config

1. **Download Current Settings**:
   ```
   SceEfi.efi -d > NVRAM_Download.txt
   ```

2. **Parse Baseline**:
   - Extract boot option groups
   - Identify modifiable settings

3. **Apply Modifications**:
   - IPv4/IPv6 PXE Support → `Disabled`
   - NVMe FW Source → `Vendor Defined`
   - Boot Order → Shuffled sequence
   - Boot Priority → `Disabled`

4. **Create Expected State**:
   - Write `NVRAM_Expected.txt` with new values
   - Copy to log directory for audit trail

5. **Trigger Reboot**:
   - Generate `reboot.flg` with reason="Update NVRAM"
   - Return code 0 to initiate restart

### Checkpoint 2: Flash BIOS

1. **Load Configuration**:
   - Read `SUT.ini` for platform details
   - Identify BIOS ROM file path

2. **Execute Flash Command**:
   ```bash
   SAA.efi -I Redfish_HI \
           -u $BMC_ACCOUNT \
           -p $BMC_PASSWORD \
           -c UpdateBios \
           --file $BIOS_ROM_NEW \
           --reboot \
           --preserve_setting \
           --preserve_nv \
           > FlashLog.txt 2>&1
   ```

3. **Verify Flash Status**:
   - Parse `FlashLog.txt` for success indicators
   - Check for error codes

4. **Trigger Reboot**:
   - Generate `reboot.flg` with reason="Flash BIOS"
   - System reboots into new firmware

### Checkpoint 3: Check BIOS Preserve

1. **Load Expected Configuration**:
   ```
   NVRAM_Expected.txt (from CP1)
   ```

2. **Download Actual Settings**:
   ```
   SceEfi.efi -d > NVRAM_Download.txt
   ```

3. **Perform Validation**:
   ```
   For each setting in Expected:
       IF Actual[GUID] != Expected[GUID]:
           Log mismatch
           FAIL
       ELSE:
           Log match
   ```

4. **Report Results**:
   - All matches → `PASS`
   - Any mismatch → `FAIL` with detailed diff

### Checkpoint 4: Restore Configuration

1. **Execute IPMI CMOS Clear**:
   ```c
   NetFn: 0x00
   Command: 0x08
   Data: [0x05, 0x80, 0x80, 0x00, 0x00, 0x00]
   ```

2. **Trigger Reboot**:
   - Generate `reboot.flg` with reason="Restore"
   - System reboots with factory defaults

3. **Verify Restoration**:
   - Confirm default settings loaded
   - Mark test complete

---

## Data Structures

### Configuration File: `SUT.ini`

```ini
[BIOS_INFO]
BIOS_PLATFORM = BirchStream
PROJECT = X14SBW-TF
BIOS_ROM_NEW = BIOS_X14SBW-1D49_20251212_1.5_STDsp.bin

[BMC_INFO]
BMC_IP = 10.140.178.137
BMC_ACCOUNT = ADMIN
BMC_PASSWORD = PASSWORD
SAA_PATH = /var/www/storage/app/TestTool/RFTool/Production/SAA/saa
```

### NVRAM Entry Format

```
[Example Entry]
GUID Offset: AA (IPv4 PXE Support)
Value (Hex): 00  → Disabled
Value (Hex): 01  → Enabled

GUID Offset: 2080 (Boot Option #1)
Value (String): "UEFI USB Key"
```

---

## Error Handling

### Retry Mechanism

```c
#define MAX_RETRIES 3

Status = FlashBIOS(...);
if (Status == ERROR) {
    for (i = 0; i < MAX_RETRIES; i++) {
        Delay(5000);  // 5 seconds
        Status = FlashBIOS(...);
        if (Status == SUCCESS) break;
    }
}
```

### Failure Recovery

| Checkpoint | Failure Scenario | Recovery Action |
|------------|------------------|-----------------|
| CP1 | SceEfi tool not found | Skip test, log error |
| CP2 | Flash timeout | Retry 3x, then FAIL |
| CP3 | Settings mismatch | Log diff, continue to CP4 |
| CP4 | IPMI command failure | Manual CMOS clear required |

---

## Logging System

### Log File Naming

```
CheckBIOSPreserveSetupConfigurationX64.efi_[PROJECT]_[TIMESTAMP].log
Example:
CheckBIOSPreserveSetupConfigurationX64.efi_X14SBW-TF_20260127_141754.log
```

### Log Levels

```c
typedef enum {
    INFO,   // General flow information
    WARN,   // Non-critical issues
    ERROR,  // Test failures
    DEBUG   // Detailed state dumps
} LogLevel;
```

### Structured Output

```
15:09:47.080  INFO  ----------------------------------------------------------------
  List of Test Points                                                 | Status  
--------------------------------------------------------------------------------
  01. Update BIOS Setup Config By SceEfi Tool                         | PASS
  02. Flash BIOS By FlashScript                                       | PASS
  03. Check BIOS Preserve Setup Configuration                         | PASS
  04. Restore BIOS Configuration                                      | PASS
--------------------------------------------------------------------------------
```

---

## Performance Metrics

| Checkpoint | Duration | Key Operations |
|------------|----------|----------------|
| CP1 | ~30 seconds | NVRAM download, parsing, modification |
| CP2 | ~10 minutes | BIOS upload to BMC, flash, reboot |
| CP3 | ~20 seconds | NVRAM download, validation |
| CP4 | ~1 minute | IPMI command, CMOS clear, reboot |

**Total Test Time**: ~12-15 minutes per platform

---

## Integration with CI/CD

### Pipeline Trigger

```yaml
# Example GitLab CI
test_bios_preserve:
  stage: validation
  script:
    - scp CheckBIOSPreserveSetupConfigurationX64.efi SUT:/automation/
    - ssh SUT "cd /automation && ./startup.nsh"
    - parse_log_for_result.sh
  artifacts:
    paths:
      - logs/*.log
```

### Result Aggregation

```python
# ResultDB polling
if "PASS" in result_field:
    status = "SUCCESS"
    metrics["preserve_test_pass"] += 1
else:
    status = "FAILURE"
    alert_team(log_url)
```

---

## Security Considerations

1. **BMC Credentials**: Stored in `SUT.ini`, not hardcoded
2. **IPMI Access**: Restricted to internal network only
3. **BIOS Binary Integrity**: SHA256 verification before flash
4. **Audit Trail**: All NVRAM changes logged to centralized server

---

## Future Enhancements

- [ ] Add XML/JSON output for programmatic parsing
- [ ] Support for incremental BIOS updates (preserve delta only)
- [ ] Parallel execution across multiple platforms
- [ ] Integration with OOB (Out-of-Band) management systems
- [ ] Real-time dashboard for test progress

---

**Architecture Version**: 1.0  
**Last Updated**: 2026-01-29  
**Author**: Chun-Yu, Tsai
