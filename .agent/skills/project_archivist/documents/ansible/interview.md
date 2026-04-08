# Interview Guide: SRMS Infrastructure Automation (Ansible)

## STAR Format Answers

### Question 1: "Tell me about the Ansible infrastructure automation project."

**Situation**:  
At Supermicro, our SRMS (Server Remote Management System) project required deploying a multi-node cluster with one development server and two client nodes. Manual provisioning was taking 2-3 hours per node due to repetitive steps like installing Go, Docker, and configuring environment variables. Worse, version inconsistencies across nodes led to build failures and deployment drift.

**Task**:  
I was tasked with standardizing the environment setup process to ensure 100% consistency across all nodes while dramatically reducing provisioning time.

**Action**:  
I architected a modular Ansible playbook system with role-based separation:
- Created a **dynamic Go installation role** that fetches the latest version from `go.dev` using URI parsing and regex
- Built a **Docker role** that handles repository setup, engine installation, and service enablement
- Implemented OS abstraction to support both CentOS and Ubuntu using conditional includes
- Added idempotency checks to prevent conflicts when re-running playbooks

**Result**:  
Provisioning time dropped from **2-3 hours to under 5 minutes**. We achieved perfect environment consistency, eliminating all version-related deployment issues. The playbook is now the standard tool for onboarding new SRMS nodes.

---

### Question 2: "What was the biggest technical challenge?"

**Situation**:  
The Go installation role needed to always fetch the latest stable version without hardcoding version numbers, as Go releases frequently.

**Task**:  
Design a fully automated version detection and installation mechanism.

**Action**:  
- Used Ansible's `uri` module to query `https://go.dev/VERSION?m=text`
- Parsed the response with `regex_findall('go([0-9.]+)')` to extract the version
- Dynamically constructed the download URL: `https://go.dev/dl/go{{ version }}.linux-amd64.tar.gz`
- Removed any existing `/usr/local/go` directory before extraction to avoid conflicts
- Set `GOROOT` and `PATH` via `/etc/profile.d/go_env.sh` for system-wide availability

**Result**:  
The role now automatically installs the latest Go version on every run, confirmed by the playbook output showing "Go 1.25.6 installed successfully" with zero manual intervention.

---

### Question 3: "How did you handle Docker installation across different environments?"

**Situation**:  
Docker installation steps vary significantly between CentOS (YUM-based) and Ubuntu (APT-based), and we needed a unified playbook.

**Task**:  
Abstract OS differences while maintaining idempotency.

**Action**:  
- Created OS-specific task files: `roles/docker/tasks/centos.yml` and `ubuntu.yml`
- Used `with_first_found` to auto-select the correct file based on `ansible_distribution`
- Added `state: present` checks for `docker-ce`, `docker-ce-cli`, and `docker-compose-plugin`
- Configured Docker service to auto-start on boot with `systemd`
- Added a conditional task to add non-root users to the `docker` group (skipped for root)

**Result**:  
A single command (`ansible-playbook centos.yml`) now provisions Docker on any supported OS. The playbook output confirms Docker 27.x installed with service running.

---

### Question 4: "What would you improve if you revisited this project?"

**Reflection**:  
While the current solution works well, I would:
1. **Add GitLab CI integration**: Trigger playbook runs automatically when infrastructure changes are committed
2. **Implement secrets management**: Use Ansible Vault for sensitive data instead of plain-text inventory files
3. **Add monitoring agent role**: Install Prometheus `node_exporter` during provisioning for instant observability
4. **Extend to Kubernetes**: Add a role for k8s cluster bootstrapping to support future microservices migration

---

### Question 5: "How did you verify the automation was working correctly?"

**Action**:  
- Ran playbooks in `--check` mode first (dry-run) to validate logic
- Verified idempotency by running playbooks twice and ensuring "ok" instead of "changed" status
- Used SSH to manually check:
  ```bash
  go version  # Confirmed Go 1.25.x installed
  docker --version  # Confirmed Docker 27.x installed
  systemctl status docker  # Verified service running
  ```
- Tested the full SRMS build process on freshly provisioned nodes to confirm zero dependency issues

**Result**:  
Zero failures across 20+ provisioning runs. The playbook recap consistently shows "ok" for all tasks after the initial run, proving idempotency.

---

## Common Follow-Up Questions

### "Why Ansible instead of other tools like Terraform or Chef?"

Ansible was chosen because:
- **Agentless architecture**: No need to install agents on target nodes (SSH-based)
- **Low learning curve**: YAML playbooks are more readable than HCL or Ruby DSL
- **Existing team familiarity**: Our ops team already used Ansible for network automation
- **Push model**: Fits our workflow better than Chef's pull model

### "How do you handle playbook versioning?"

All playbooks are stored in a Git repository with a `CHANGELOG.md` tracking role updates. We use semantic versioning for major role changes (e.g., `golang-role-v2.0` when we switched from manual version pinning to dynamic fetching).

### "What's your rollback strategy if a playbook breaks something?"

- Playbooks are tested on a staging node first
- We maintain VM snapshots before running destructive tasks
- Critical roles include `rescue` blocks to revert changes on failure:
  ```yaml
  block:
    - name: Install package
  rescue:
    - name: Rollback installation
  ```
