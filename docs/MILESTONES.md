# MILESTONES

This document tracks the sequential roadmap for turning TCV Calendar Booking into a usable internal MVP.

---

# Guiding Principle

The goal is NOT to build a massive scheduling SaaS.

The goal is:

- Reliable scheduling
- Reliable Google Calendar sync
- Manual availability control
- Smooth client booking experience
- Stable internal usage for TCV Studio

---

# MVP Success Criteria

The MVP is considered successful when:

1. Ray can connect Google Calendar
2. One additional user can connect Google Calendar
3. Both users can create booking links
4. Clients can book without login
5. Google Calendar events are created automatically
6. Clients can reschedule/cancel via secure links
7. Hosts can manually override availability
8. Double-booking protection works reliably

---

# Milestone 0 — Environment Stabilization

## Goal

Get the app reliably deployable and connected to its backend.

## Tasks

### Add Vercel SPA routing support

Create:

```txt
src/frontend/vercel.json
```

Required contents:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### Configure Vercel

Expected settings:

```txt
Framework: Vite
Root Directory: src/frontend
Install Command: pnpm install
Build Command: pnpm build
Output Directory: dist
```

---

### Resolve Environment Values

Need real values for:

- backend_host
- backend_canister_id
- project_id
- ii_derivation_origin

---

### Verify Routes

Need working direct refresh support for:

- /
- /login
- /host
- /host/links
- /host/settings
- /book/:linkId
- /manage/:token

---

## Exit Criteria

- frontend deploys successfully
- frontend can reach backend
- direct route refreshes work
- login initializes correctly

---

# Milestone 1 — Internal User System

## Goal

Enable Ray and one additional internal user.

## Tasks

### Verify Admin Bootstrap

Need stable method to:

- create first admin
- avoid accidental lockout

---

### Verify Invite Flow

Test:

- invite creation
- invite acceptance
- role assignment
- activation flow

---

### Verify Protected Routes

Ensure:

- non-authenticated users blocked
- inactive users blocked
- public routes remain accessible

---

### Verify Ownership Model

Need to confirm:

- booking links belong to users
- Google calendars belong to users
- users are isolated correctly

---

## Exit Criteria

- Ray can log in
- second user can log in
- invite flow works
- ownership is isolated correctly

---

# Milestone 2 — Google Calendar Integration

## Goal

Reliable per-user Google Calendar connectivity.

## Tasks

### Verify OAuth Flow

Need to confirm:

- token exchange
- refresh flow
- reconnect flow
- persistence

---

### Verify Free/Busy Sync

Ensure:

- busy slots match Google Calendar
- timezone handling works
- stale cache issues are minimized

---

### Verify Per-User Credential Isolation

Critical requirement:

- Ray links use Ray calendar
- User 2 links use User 2 calendar

---

### Improve Connection Status UI

Add clear states:

- connected
- disconnected
- expired
- reconnect required

---

## Exit Criteria

- both users can connect calendars
- availability sync works
- credential ownership is correct

---

# Milestone 3 — Booking Link MVP

## Goal

Turn booking links into fully usable client-facing scheduling links.

## Existing Fields

Already present:

- name
- description
- duration
- active state

---

## Add Scheduling Rules

### Required MVP Fields

- timezone
- work days
- work hours
- slot increments
- minimum notice

Optional later:

- buffers
- max bookings/day
- date ranges

---

## Add Basic Branding

MVP only:

- TCV logo
- host display name
- basic brand color

Avoid advanced theming for now.

---

## Exit Criteria

- users can create usable branded booking links
- booking pages clearly identify the host
- scheduling rules affect availability

---

# Milestone 4 — Availability Engine

## Goal

Make scheduling logic trustworthy.

## Availability Sources

Availability must combine:

- Google Calendar busy blocks
- existing bookings
- working hours
- minimum notice
- active/inactive links
- manual overrides

---

## Add Force-Block Overrides

Current behavior:

- busy -> force-open

Needed behavior:

- busy -> force-open
- open -> force-block

---

## Improve Slot Generation

Move away from:

- fixed hourly slots

Toward:

- configurable increments
- duration-aware slots
- timezone-aware generation

---

## Exit Criteria

- hosts can fully control availability
- booking pages reflect overrides correctly
- slot generation is reliable

---

# Milestone 5 — Real Calendar Event Lifecycle

## Goal

Bookings create real Google Calendar events.

## Required Booking Flow

### On Booking

Backend should:

1. validate availability
2. create Google Calendar event
3. add client attendee
4. enable notifications
5. store event ID
6. include manage URL in description

---

## Event Description Should Include

- meeting title
- client name
- purpose
- management link
- host information

---

## Exit Criteria

- booking creates real calendar event
- client receives invite
- host receives invite
- event contains management link

---

# Milestone 6 — Reschedule and Cancel

## Goal

Management links modify real calendar events.

## Reschedule Requirements

Backend should:

1. validate token
2. validate slot
3. update calendar event
4. update booking record
5. trigger notifications

---

## Cancel Requirements

Backend should:

1. validate token
2. cancel/delete calendar event
3. update booking state
4. trigger notifications

---

## Exit Criteria

- reschedule updates real invite
- cancel removes real invite
- notifications propagate correctly

---

# Milestone 7 — MVP Hardening

## Goal

Reduce operational and security risk.

## Tasks

### Move Refresh Tokens Server-Side

Highest-priority security improvement.

---

### Add Stronger Validation

Server-side validation required for:

- booking availability
- ownership
- link activity
- token validity
- past times

---

### Add Logging

Recommended audit events:

- booking created
- booking cancelled
- booking rescheduled
- override changed
- calendar connected

---

### Add Abuse Protection

Add:

- rate limiting
- token abuse prevention
- request throttling

---

## Exit Criteria

- safe enough for internal real-world usage
- major scheduling failures minimized
- obvious security gaps reduced

---

# Future Features (NOT MVP)

Do not prioritize these yet.

## Future Ideas

- round robin scheduling
- team scheduling
- payment support
- advanced branding
- analytics
- CRM integration
- Slack notifications
- AI scheduling assistance
- SMS reminders
- advanced workflows
- public SaaS onboarding

These should only happen AFTER:

- scheduling reliability is proven
- Google sync is reliable
- reschedule/cancel works consistently

---

# Current Highest Priority

The single most important engineering priority is:

## Prove the complete booking lifecycle works end-to-end

Meaning:

1. connect calendar
2. show availability
3. create booking
4. create invite
5. reschedule invite
6. cancel invite

Everything else is secondary.
