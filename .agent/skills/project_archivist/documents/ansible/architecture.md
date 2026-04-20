# SRMS Infrastructure Automation with Ansible

## Project Overview
Internal DevOps project to standardize multi-node cluster provisioning for SRMS (Server Remote Management System) development and client environments.

## Architecture

### System Topology
```
┌─────────────────────────────────────────────────────────┐
│                  Ansible Control Node                   │
│                  (Docker Container)                      │
│                                                          │
│  ├── playbooks/                                         │
│  │   ├── centos.yml                                    │
│  │   ├── ubuntu.yml                                    │
│  │   └── roles/                                        │
│  │       ├── base/                                     │
│  │       ├── golang/                                   │
│  │       └── docker/                                   │
│  └── inventory/hosts.ini                               │
└─────────────────────────────────────────────────────────┘
               │
               ├──────────────┬──────────────┬─────────────
               │              │              │
               ▼              ▼              ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ srms_dev │   │ client1  │   │ client2  │
        │ CentOS   │   │ CentOS   │   │ CentOS   │
        │          │   │          │   │          │
        │ Go 1.25.x│   │ Go 1.25.x│   │ Go 1.25.x│
        │ Docker   │   │ Docker   │   │ Docker   │
        └──────────┘   └──────────┘   └──────────┘
```

## Technical Design

### 1. **Modular Role-Based Architecture**
Ansible roles are structured to be OS-agnostic:
- **base**: Installs essential packages (git, curl, etc.)
- **golang**: 
  - Fetches latest Go version from `go.dev`
  - Parses tarball URL dynamically
  - Extracts to `/usr/local/go`
  - Sets environment variables in `/etc/profile.d/go_env.sh`
- **docker**: 
  - Adds Docker CE repository
  - Installs Docker Engine + Compose plugin
  - Enables and starts `dockerd` service

### 2. **OS Abstraction Layer**
Playbooks use conditional includes to handle CentOS vs. Ubuntu:
```yaml
- include_tasks: "{{ item }}"
  with_first_found:
    - "{{ ansible_distribution | lower }}.yml"
    - "ubuntu.yml"
```

### 3. **Idempotency & State Management**
- Uses `stat` module to check existing installations
- Removes old Go versions before installing new ones
- Verifies Docker installation with `docker --version`

## Key Implementation Details

### Dynamic Go Version Detection
```yaml
- name: Get latest Go version from go.dev
  uri:
    url: https://go.dev/VERSION?m=text
    return_content: yes
  register: go_version_response

- set_fact:
    go_version: "{{ go_version_response.content | regex_findall('go([0-9.]+)') }}"
    go_download_url: "https://go.dev/dl/go{{ go_version[0] }}.linux-amd64.tar.gz"
```

### Docker Group Management
Automatically adds non-root users to the `docker` group to enable rootless Docker commands.

## Challenges & Solutions

### Challenge 1: Version Drift
**Problem**: Manually installed Go/Docker versions varied across nodes, causing build failures.  
**Solution**: Centralized version management via Ansible facts and templating.

### Challenge 2: SELinux Interference
**Problem**: Docker containers failed to start due to SELinux policies on CentOS.  
**Solution**: Added optional task to set SELinux to permissive mode (commented out by default for security).

## Deployment Workflow

```bash
# Run from Ansible container
docker compose exec ansible env ANSIBLE_CONFIG=/ansible/ansible.cfg \
  ansible-playbook -i inventory/hosts.ini playbooks/centos.yml
```

## Results
- **Provisioning Time**: Reduced from 2-3 hours (manual) to ~5 minutes (automated)
- **Consistency**: 100% environment parity across all nodes
- **Maintainability**: New dependencies can be added via role extension

## Technology Stack
- **Ansible**: 2.14+
- **Docker**: 27.x
- **Golang**: 1.25.x (dynamically fetched)
- **Target OS**: CentOS 7/8, potentially Ubuntu (role prepared)

## Future Enhancements
- Add Dockerized deployment role
- Integrate with GitLab CI for auto-provisioning on commit
- Add monitoring agent installation (Prometheus node_exporter)
