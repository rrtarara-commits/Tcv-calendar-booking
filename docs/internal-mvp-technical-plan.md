# Internal MVP Technical Implementation Plan

## Purpose

Turn this project into a usable internal MVP scheduling tool for TCV Studio.

The MVP should allow Ray and one additional internal user to:

- Connect their own Google Calendar
- Create branded booking links
- Automatically block off busy calendar time
- Manually override availability
- Send public booking links to clients
- Let clients book without login
- Automatically create calendar invites
- Allow clients to reschedule or cancel using a secure link

The goal is not to build a full Calendly competitor yet. The goal is a stable internal scheduling workflow for low-volume real client usage.

---

# Current Architecture Review

## Frontend Stack

The frontend is already fairly mature.

### Technologies Found

- Vite
- React
- TypeScript
- TanStack Router
- TanStack Query
- Tailwind-style utility CSS
- Caffeine / Internet Identity auth
- Generated backend actor bindings
- Google OAuth PKCE flow

Frontend location:

```txt
src/frontend
```

The app already includes:

- Login flow
- Internal protected routes
- Public booking routes
- Public management routes
- Booking link management
- Calendar availability UI
- Google Calendar integration scaffolding
- Team/user management

---

## Backend Architecture

The project appears to use a Caffeine / Internet Computer canister-style backend.

Important finding:

The frontend is NOT standalone.

It depends on backend actor methods generated into:

```txt
src/frontend/src/backend.ts
src/frontend/src/declarations/backend.did.d.ts
```

The frontend `env.json` currently contains placeholder values:

```json
{
  "backend_host": "undefined",
  "backend_canister_id": "undefined",
  "project_id": "undefined",
  "ii_derivation_origin": "undefined"
}
```

This means:

- Vercel can host the frontend
- BUT the backend must still exist separately
- The app cannot fully function until real backend values are configured

---

# Existing Features Already Present

## 1. Authentication and Internal Users

Already implemented:

- Protected internal pages
- User roles
- Invite flow
- Active/inactive users
- Admin checks

This is enough for the MVP requirement of:

- Ray
- One additional trusted user

Potential issue:

Need to verify backend access control actually protects all internal routes and methods.

---

## 2. Booking Link Management

Already implemented:

- Create booking links
- Edit booking links
- Delete booking links
- Enable/disable booking links

Current fields:

- Name
- Description
- Duration
- Active state

This is a strong foundation.

Missing:

- Branding
- Scheduling rules
- Timezone support
- Link ownership verification

---

## 3. Public Booking Flow

Already implemented:

Public route:

```txt
/book/:linkId
```

Current booking flow already supports:

- Date selection
- Slot selection
- Client name
- Client email
- Purpose/notes
- File uploads

This matches the desired MVP direction very closely.

---

## 4. Google Calendar Integration

Already scaffolded:

- Google OAuth
- Free/busy fetching
- Calendar event scopes
- Credential status
- Refresh flow

Current scopes:

- calendar.readonly
- calendar.events

This is sufficient for MVP.

---

## 5. Availability Calculation

Already implemented conceptually:

- Free/busy lookup
- Slot generation
- Existing booking checks
- Manual overrides

Backend methods already exist:

- fetchGoogleCalendarFreeBusy
- getAvailableSlots
- toggleBusyOverride

This is a major amount of work already completed.

---

## 6. Manual Availability Overrides

Already partially implemented.

Current behavior:

- Busy slot can be force-opened

Missing behavior:

- Open slot cannot be manually blocked yet

This is important because your requested workflow requires BOTH:

- Override holds/open busy time
- Block time manually even if Google says free

---

## 7. Public Appointment Management

Already implemented conceptually.

Public route:

```txt
/manage/:managementToken
```

Current UI already includes:

- Appointment details
- Reschedule flow
- Cancel flow
- Token lookup
- Availability checking

This is already very close to the requested MVP.

---

# Biggest Technical Risks

## Risk 1: Backend Deployment Unknowns

The frontend clearly expects a backend actor/canister.

Biggest unknown:

- Where is the backend deployed?
- Is it already live?
- Is it local-only?
- Can it work from Vercel?

This must be solved before treating the app as production-usable.

Recommendation:

Treat Vercel as frontend hosting only.

---

## Risk 2: Google Token Storage Security

Current implementation appears to store Google credentials in browser storage.

Security concerns:

- Refresh tokens are sensitive
- localStorage is vulnerable to XSS
- Browser storage is not ideal for production credential handling

For a two-user internal MVP:

This may be acceptable short-term IF:

- The app stays private
- OAuth scopes remain minimal
- No broad public usage

Long-term recommendation:

Move refresh token handling fully server-side.

---

## Risk 3: Availability Race Conditions

Frontend currently passes busy intervals into booking mutations.

Potential issue:

Two clients could book simultaneously if backend validation is weak.

Recommendation:

Backend MUST perform final availability validation during:

- createBooking
- rescheduleBookingByToken

---

## Risk 4: Multi-User Calendar Ownership

Need to verify:

- Booking links belong to specific users
- Google credentials are stored per user
- Ray cannot accidentally use User 2 calendar
- User 2 cannot affect Ray links

This is critical for MVP correctness.

---

## Risk 5: Public Token Security

Management tokens allow modifying appointments without login.

Recommendations:

- Tokens must be long and random
- Tokens should never be sequential
- Expired/cancelled bookings should invalidate actions

---

# MVP Scope Recommendation

## Recommended MVP Scope

Keep the MVP intentionally small.

Do NOT build:

- Teams scheduling
- Round-robin scheduling
- Payment systems
- Advanced workflows
- Complex branding systems
- AI features
- SMS reminders
- Full analytics

Focus ONLY on:

- Reliable booking
- Reliable calendar sync
- Reliable reschedule/cancel
- Manual availability control

---

# Recommended MVP Features

## Feature Set

### Internal Users

- Ray account
- One additional user
- Invite flow
- Login/logout

### Calendar Integration

- Google Calendar connect
- Free/busy sync
- Event creation
- Event updates
- Event cancellation

### Booking Links

- Link name
- Description
- Duration
- Working hours
- Timezone
- Active/inactive

### Availability

- Google busy blocks
- Existing bookings
- Manual force-open
- Manual force-block

### Public Booking

- Client booking page
- Client name/email
- Confirmation page
- Calendar invite

### Appointment Management

- Secure manage link
- Reschedule
- Cancel
- Calendar update propagation

---

# Recommended Implementation Phases

# Phase 0 — Deployment Stabilization

## Goal

Get the frontend loading correctly from Vercel.

## Tasks

### Add SPA routing support

Create:

```txt
src/frontend/vercel.json
```

Contents:

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

This prevents routes like:

- /book/:id
- /manage/:token
- /host/calendar/:id

from breaking on refresh.

---

### Configure Vercel

Recommended settings:

```txt
Framework: Vite
Root Directory: src/frontend
Install Command: pnpm install
Build Command: pnpm build
Output Directory: dist
```

---

### Resolve env.json

Need to determine:

- real backend host
- real backend canister ID
- project ID
- Internet Identity origin

Without these values the app cannot fully function.

---

# Phase 1 — Internal User Setup

## Goal

Get Ray and one other user functioning.

## Tasks

### Verify admin bootstrap

Need a reliable way to:

- create first admin
- avoid lockout

---

### Verify invite flow

Test:

- invite generation
- accepting invite
- role assignment
- active user state

---

### Verify ownership model

Each booking link must belong to:

- one specific user
- one specific Google Calendar

This is critical.

---

# Phase 2 — Google Calendar Sync

## Goal

Each user can connect their own Google Calendar.

## Tasks

### Verify OAuth flow

Need to verify:

- token exchange
- refresh flow
- persistence
- reconnect handling

---

### Verify calendar ownership

Need to confirm:

- Ray links use Ray calendar
- User 2 links use User 2 calendar

---

### Improve status UI

Add clearer states:

- Connected
- Expired
- Reconnect required
- Missing permissions

---

# Phase 3 — Booking Link Enhancements

## Goal

Links become genuinely usable.

## Add fields

### Scheduling Rules

- timezone
- work days
- work hours
- minimum notice
- slot increments

### Branding

MVP branding only:

- TCV logo
- brand color
- host display name

Do NOT build advanced theming yet.

---

# Phase 4 — Availability Engine

## Goal

Make availability trustworthy.

## Required Logic Inputs

Availability should combine:

- Google Calendar busy blocks
- Existing bookings
- Working hours
- Manual overrides
- Minimum notice
- Active/inactive link status

---

## Override Improvements

Current behavior:

- busy -> open

Needed behavior:

- busy -> force-open
- open -> force-block

Recommendation:

Use explicit override states instead of generic booleans.

Suggested model:

```txt
force_open
force_block
```

This will be easier to maintain.

---

# Phase 5 — Real Calendar Events

## Goal

Bookings create actual Google Calendar events.

## Required Booking Flow

### On booking

Backend should:

1. Validate availability again
2. Create Google Calendar event
3. Add client as attendee
4. Store event ID
5. Include management URL in description
6. Enable Google notifications

---

## Event Description Should Include

- meeting title
- client name
- purpose
- reschedule/cancel link
- host information

---

# Phase 6 — Reschedule and Cancel

## Goal

Management links update real calendar events.

## Reschedule Flow

Backend should:

1. Validate token
2. Validate new slot
3. Update Google Calendar event
4. Update booking record
5. Trigger Google notifications

---

## Cancel Flow

Backend should:

1. Validate token
2. Cancel/delete calendar event
3. Mark booking cancelled
4. Trigger notifications

---

# Phase 7 — MVP Hardening

## Goal

Reduce obvious operational risk.

## Security Improvements

### Move refresh tokens server-side

Highest-priority long-term improvement.

---

### Add server-side validation

All booking operations must validate:

- slot availability
- link active state
- ownership
- time validity

---

### Add audit logging

Recommended events:

- booking created
- booking cancelled
- booking rescheduled
- calendar connected
- override changed

---

### Add abuse protection

Even internal tools can get spammed.

Add:

- lightweight rate limiting
- request throttling
- invalid token protection

---

# Recommended Immediate Next Steps

## Highest Priority

1. Determine real backend deployment status
2. Configure working env.json values
3. Deploy frontend to Vercel
4. Verify login flow
5. Verify Google Calendar connection
6. Verify free/busy sync
7. Verify booking creates actual calendar event

Do NOT spend time polishing UI before those work.

---

# Recommended Non-Developer Priorities

If prioritizing as a founder/operator instead of engineer:

## Focus on proving these workflows

### Workflow 1

Can Ray connect Google Calendar?

### Workflow 2

Can a client book time successfully?

### Workflow 3

Does a real calendar invite get sent?

### Workflow 4

Can the client reschedule?

### Workflow 5

Can the client cancel?

### Workflow 6

Can Ray manually override availability?

Once those six things work reliably, the MVP is already valuable.

Everything else is secondary.
