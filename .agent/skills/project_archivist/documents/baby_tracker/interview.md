# Interview Guide: Baby Tracker (Offline-First)

## STAR: The Offline Sync Challenge
**Situation**: In mobile parenting apps, users often record data (like midnight feedings) in rooms with poor Wi-Fi. Many apps fail or lose data if the request times out.
**Task**: Build a system that allows 100% offline operation while supporting seamless data sharing between parents/nannies.
**Action**: I implemented an **Offline-First architecture** using **WatermelonDB**. Unlike simple local storage, WatermelonDB uses RxJS for reactive UI updates and handles complex relations. I developed a custom sync engine on the Express backend that uses **Optimistic Locking**. This allowed me to detect if a specific record (e.g., a diaper log) was modified by both parents while offline and merge the changes intelligently.
**Result**: Achieved zero data loss across 1,000+ local records. The app remains fully functional in airplane mode and syncs instantly when a connection is restored.

## Deep Dive Questions
- **Why Choose WatermelonDB over SQLite or Realm?**
  - Performance and React integration. WatermelonDB is designed for "reactive" performance—it only loads the data actually needed for the current screen, which is critical for smooth scrolling on older Android devices.
- **How do you resolve sync conflicts?**
  - We use a 'last-write-wins' strategy for simple fields, but for critical growth data, we keep a version history in PostgreSQL. If a conflict is detected (mismatched version ID), the backend prompts a manual merge or follows pre-defined business rules.
- **How did you manage the deployment on DigitalOcean?**
  - I used Docker Compose to orchestrate the Express server, PostgreSQL, and Redis. I configured a CI/CD pipeline that builds the image and triggers a deployment via a secure webhook upon pushing to the main branch.
