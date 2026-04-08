# GitLab CD & Release Automation - Interview Guide

## STAR Questions

### Q1: "How did you automate the release process?"
**Situation**:
Engineers were manually creating git tags. Often, they would tag `v2.0` but forget to update the `CHANGELOG.md`, or worse, deploy code that wasn't tagged at all.
**Task**:
Enforce a "Documentation First" approach where the code version is derived strictly from the Changelog.
**Action**:
I wrote a GitLab CI script that:
1.  Reads `CHANGELOG.md` using `grep/sed` to find the latest version.
2.  Checks if that tag exists. Use `git ls-remote` to avoid conflicts.
3.  Automatically creates and pushes the tag with the Changelog description as the annotation.
**Result**:
100% consistency between Git Tags and Documentation. If you don't update the Changelog, the pipeline creates no tag, and no deployment happens.

### Q2: "Why use a Webhook instead of SSH?"
**Situation**:
Our security team flagged that storing SSH Private Keys in GitLab CI variables was a risk. If a runner was compromised, the attacker would have root access to production.
**Action**:
I implemented a **Webhook-based architecture**.
- The CI pipeline makes a simple CURL request to our Deployment API.
- The API (running inside the firewall) validates the token and triggers the update locally.
**Result**:
We removed all SSH keys from GitLab. Security audit passed with flying colors.

### Q3: "How do you handle special characters in the deploy message?"
**Challenge**:
The Changelog description often contains special characters (newlines, ampersands, quotes) that break the CURL command URL parameters.
**Solution**:
I added a small Python snippet inside the shell script:
```bash
python3 -c "import urllib.parse; print(urllib.parse.quote('''$description'''))"
```
This ensures the message is properly URL-encoded (e.g., Space -> `%20`) before being sent to the API.

### Q4: "What happens if the tag already exists?"
**Action**:
The script is idempotent. It checks `git ls-remote`. If the tag is there, it says "Using existing tag" and proceeds to trigger the webhook. This prevents pipeline failures when we retry a job.
