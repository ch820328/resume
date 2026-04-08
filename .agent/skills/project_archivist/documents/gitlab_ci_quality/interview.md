# GitLab CI Quality Gate - Interview Guide

## STAR Questions

### Q1: "Why did you create this CI pipeline?"
**Situation**:
Our code quality relied entirely on human review. Reviewers spent 50% of their time pointing out basic issues like "bad commit message", "tab indentation", or "this JSON is broken".
**Task**:
Automate these hygiene checks to free up engineering time for logic review.
**Action**:
I implemented a GitLab CI pipeline using Docker. I defined strict "Quality Gates": you cannot merge if your commit message lacks a category, if you haven't rebased, or if `pylint` finds errors.
**Result**:
Code Review steps dropped from 3 rounds to 1.5 rounds on average. The "Changelog Check" ensured our release notes were 100% accurate without manual accounting.

### Q2: "How do you validate a Rebase?"
**Action**:
The script fetches the target branch (`main`) and checks if the merge base is equal to the target branch's `HEAD`. If not, it means the feature branch is "behind" and might result in a conflict or a messy Merge Commit.
- We block the pipeline and instruct the user: "Please run `git rebase main`."

### Q3: "Why use Docker for linting?"
**Situation**:
Different projects used different Python versions. Installing them all on the shared CI Runner machine created dependency hell.
**Action**:
I used the **Docker Executor**. Each lint job specifies `image: python:3.9-alpine` or a custom `ci-tools` image.
**Result**:
Total isolation. I can upgrade the linter for Project A without breaking Project B. Plus, developers can run `docker run ...` locally to reproduce the exact same check.

### Q4: "What is the weirdest check you added?"
**Action**:
**ASCII Verification**.
- We had a bug caused by a "Zero Width Space" copied from a Jira ticket into a config file. Usage crashed, but the file looked fine.
- I added a `grep -P` check to fail the build if any non-ASCII or non-printable character is found in source files.
