# Architecture: Redfish vs. SMBIOS Information Validation

## Overview
This tool is designed to automate the cross-verification of hardware component information between the legacy **SMBIOS** (System Management BIOS) and the modern **Redfish API** provided by the **BMC** (Baseboard Management Controller).

## Design Pattern: Strategy Pattern
The core of the system uses the **Strategy Pattern** to handle the heterogeneity of BMC web interfaces.
- **`BmcLoginStrategy` (Abstract Base)**: Defines the interface for login, navigation, and data extraction.
- **Concrete Strategies**:
    - `SupermicroBmcAst2500`: Handles X11/X12 generation BMCs.
    - `SupermicroBmcAst2600`: Handles X13 generation BMCs.
    - `SupermicroOpenBmcAst2600`: Handles OpenBMC-based systems (e.g., X14).

## Technical Pipeline
1. **Selection**: Detecting BMC type via Redfish `/redfish/v1/Managers/1` or Page Title.
2. **Extraction (Web)**: Using **Selenium** and **BeautifulSoup** to parse complex, dynamic tables in the BMC GUI.
3. **Extraction (API)**: Fetching direct data via Redfish endpoints.
4. **Validation**: Comparing key fields (Manufacturer, Serial, Part Number, Capacity) across both sources.

## Key Components Checked
- **CPU**: Type 4 SMBIOS vs `/redfish/v1/Systems/1/Processors`
- **Memory**: Type 17 SMBIOS vs `/redfish/v1/Systems/1/Memory`
- **PSU**: Type 39 SMBIOS vs `/redfish/v1/Chassis/1/Power`
- **Network AOC**: Type 9/40 SMBIOS vs `/redfish/v1/Chassis/1/PCIeDevices`
