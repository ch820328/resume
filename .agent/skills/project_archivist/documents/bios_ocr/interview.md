# Issue Analytics Dashboard - Interview Guide

## STAR Questions

### Q1: "Why did you build this dashboard?"
**Situation**:
Our Department Heads had a "blind spot". They knew we had 500+ open tickets, but they didn't know which ones were *stuck*. Redmine lists everything, but it doesn't highlight "This ticket hasn't moved in 2 weeks".
**Task**:
Create a "Health Monitor" that aggregates data from Redmine, our internal Project Board, and Excel logs into a single view for management.
**Action**:
I built a Laravel application that runs nightly ETL jobs. It pulls data from all sources, normalizes the status fields (mapping "Feedback" and "To-Do" to a common state), and applies an "Unhealthy Logic" (e.g., no update for 7 days).
**Result**:
Management gained clarity. We identified that 20% of our "Open" backlog was actually "Zombie Tickets" (abandoned). This tool became the primary slide for the Weekly Sync meeting.

### Q2: "How did you handle data from different systems?"
**Action**:
I implemented the **Adapter Pattern**.
- Example: Redmine has `API`, Project Board has `Direct DB Access`, Excel has `File Upload`.
- I created a `DataSourceInterface` with a method `fetchTickets()`.
- Each system had its own implementation (`RedmineAdapter`, `SqlAdapter`).
- The Main Importer didn't care where the data came from; it just processed the unified Metric objects.

### Q3: "Communicating with Management?" (Soft Skill)
**Situation**:
Managers didn't want raw data tables; they wanted "Am I in trouble?".
**Action**:
I focused heavily on **Data Visualization**.
- I used Traffic Light colors (Red/Yellow/Green).
- I created a "Criteria = 90%" metric (seen in the screenshot).
- If a team's healthy rate dropped below 90%, the row turned Red.
**Result**:
This drove immediate action. Managers hated seeing "Red" on the dashboard, so they started chasing their team members to close stalled tickets *before* the Monday meeting.

### Q4: "Why Laravel?"
**Action**:
Laravel's **Eloquent ORM** and **Task Scheduler** were perfect for this.
- **Scheduler**: Easy to set up nightly syncs (`$schedule->command('sync:redmine')->daily()`).
- **Eloquent**: Made it incredibly fast to query complex relationships (e.g., "Get all Unhealthy Tickets for Team X where Pending > 5 days").
