# START HERE — Agent Instructions
_Last updated: 2026-05-11 by ChatGPT_

## Your Role
You are building and maintaining the TCV Calendar Booking app, an internal scheduling MVP for TCV Studio. Read this file first every session.

## Session Start Protocol
1. Read this file
2. Read `APP-OVERVIEW.md`
3. Read `MILESTONES.md`
4. Give the user a concise status update before beginning work

## Operating Rules
- Work one milestone at a time
- Validate milestone functionality before marking complete
- Update docs proactively after meaningful changes
- Security first: patch obvious vulnerabilities immediately
- Use env vars for all secrets and tokens
- Never commit credentials, refresh tokens, or `.env` files
- Treat this as an internal MVP, not a public SaaS product

## Current Product Goal
Create a lightweight internal Calendly-style tool for TCV Studio where:

- Ray and one additional internal user can connect Google Calendars
- Hosts can create branded booking links
- Google Calendar busy blocks automatically affect availability
- Hosts can manually override availability
- Clients can book without login
- Calendar invites are automatically created
- Clients can reschedule/cancel using secure management links

## Stack Quick Reference
- Frontend: Vite + React + TypeScript
- Routing: TanStack Router
- Data Fetching: TanStack Query
- Auth: Caffeine / Internet Identity
- Backend: Caffeine / ICP-style actor/canister backend
- Calendar: Google Calendar API + OAuth PKCE
- Hosting Target: Vercel (frontend only)
- Package Manager: pnpm

## Key Risks
- Backend deployment/environment values are still unclear
- Google refresh token handling currently appears browser-side
- Need to verify per-user Google credential ownership
- Need stronger server-side availability validation to prevent double-booking

## Key Files
- `docs/APP-OVERVIEW.md` — full app architecture and flow
- `docs/MILESTONES.md` — sequential implementation roadmap
- `docs/internal-mvp-technical-plan.md` — detailed technical review and MVP strategy

## Current Priority
Highest priority is proving the full booking lifecycle works end-to-end:

1. Google Calendar connection
2. Availability sync
3. Booking creation
4. Calendar invite creation
5. Reschedule propagation
6. Cancel propagation

UI polish is secondary until those workflows are reliable.
