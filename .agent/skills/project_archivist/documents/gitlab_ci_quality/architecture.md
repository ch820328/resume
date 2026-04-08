# GitLab CI Quality Gate - Architecture

## Project Overview
**Stack**: GitLab CI (`.gitlab-ci.yml`), Docker, Bash, Python
**Goal**: Enforce coding standards and git hygiene automatically before Code Review.

---

## 2. Pipeline Design
The pipeline is designed as a **Fail-Fast** sequence of gates.

```mermaid
graph LR
    Push[Git Push / MR] --> Stage1[Build/Setup]
    Stage1 --> Stage2[Git Verify]
    Stage2 --> Stage3[File Check]
    Stage3 --> Stage4[Code Lint]
    
    subgraph "Git Verify"
        C1[Commit Msg Format]
        C2[Rebase Check]
        C3[Unexpected Merge]
    end
    
    subgraph "File Check"
        F1[JSON Syntax]
        F2[Non-ASCII Chars]
        F3[Changelog Update]
    end
    
    subgraph "Code Lint"
        L1[Pylint (Python)]
        L2[ShellCheck (Bash)]
    end
```

### 3. Component Details

#### A. Git Verification (`git-verify`)
- **Semantic Commits**: regex validation to ensure messages follow `Category: Summary` format (e.g., `Refactor: Improve middleware`).
- **Rebase Enforcement**: Checks if the branch is behind `main` by > 0 commits. Forces developers to `git rebase` before merging, keeping history linear.

#### B. File Integrity (`file-check`)
- **Changelog Gate**: Scans `git diff` to ensure `CHANGELOG.md` is modified if source code is changed. No more "Ghost Updates".
- **ASCII Guard**: Greps for non-printable characters that often creep in from copy-pasting (smart quotes, invisible spacers).

#### C. Dockerized Linting
- **Architecture**: Instead of installing `pylint` on the CI Runner (Shell Executor), we use specific Docker images for each job.
- **Benefit**:
  - Isolation: Python 3.8 linting doesn't conflict with Python 3.11 runner.
  - Reproducibility: Developers can run the exact same Docker container locally to debug lint errors.

---

## 4. Technical Challenges

### Challenge: Speed vs. Isolation
- **Issue**: Spinning up 10 different Docker containers for 10 checks is slow.
- **Solution**:
  - **Base Image**: Created a custom `ci-tools:latest` Alpine image pre-baked with `git`, `jq`, `pylint`, and `shellcheck`.
  - **Parallelism**: Stages run in parallel where possible, reducing total time from 5m to 1m.

### Challenge: False Positives in Rebase Check
- **Issue**: Standard `git merge-base` checks sometimes failed on shallow clones used by GitLab CI.
- **Solution**: Configured `GIT_DEPTH: 0` (unshallow) or explicitly fetched the target branch to ensure the commit graph was complete for analysis.
