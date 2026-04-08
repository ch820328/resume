# Architecture: Baby Tracker (Offline-First)

## System Overview
A full-stack mobile application (React Native) designed for caregivers to track infant health and activities. The core value proposition is **reliability in low-connectivity environments**.

## Data Strategy: Offline-First
The system uses **WatermelonDB** as the primary source of truth on the client side.
- **Client**: SQLite-backed local storage (WatermelonDB) ensures UI responsiveness and 100% offline availability.
- **Sync Engine**: Implements a Pull/Push protocol. Changes are tracked via `sync_status` and timestamps.
- **Protocol**: RESTful API with Delta updates to minimize bandwidth.

## Backend & Infrastructure
- **API**: Node.js Express + Prisma ORM.
- **Storage**: PostgreSQL (Main) + Redis (Cache/Locks).
- **Security**: Google OAuth 2.0 integration for seamless onboarding.
- **Scaling**: Deployed on DigitalOcean Droplets with Cloudflare for SSL/WAF.

## Concurrency Control
To handle family members syncing from multiple devices:
1. **Redis Lock**: Prevents race conditions during the final push phase of a sync session.
2. **Optimistic Locking**: Uses PostgreSQL versioning to detect and resolve conflicts at the row level.
