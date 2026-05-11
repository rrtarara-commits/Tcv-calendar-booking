# APP OVERVIEW

## Product Summary

TCV Calendar Booking is an internal scheduling MVP being developed for TCV Studio.

The app is intended to function similarly to a lightweight internal Calendly-style system.

The primary use case is:

- Internal hosts connect their Google Calendars
- Hosts create branded booking links
- Clients book time without creating accounts
- Google Calendar availability determines open slots
- Hosts can manually override availability
- Calendar invites are automatically managed
- Clients can reschedule/cancel using secure links

This is currently intended for low-volume internal production usage, not mass public SaaS usage.

---

# Current Architecture

## Frontend

Location:

```txt
src/frontend
```

### Frontend Stack

- React
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Tailwind utility styling
- Lucide icons

### Frontend Responsibilities

- Authentication UI
- Internal dashboard pages
- Booking link management
- Public booking flow
- Public appointment management
- Google OAuth flow
- Calendar availability UI
- Slot override UI

---

## Backend

The app appears to use a Caffeine / Internet Computer style backend architecture.

The frontend communicates with backend actor methods generated into:

```txt
src/frontend/src/backend.ts
src/frontend/src/declarations/backend.did.d.ts
```

Important:

The frontend is NOT standalone.

The app depends on backend actor methods for:

- Bookings
- Booking links
- User management
- Calendar integration
- Availability
- Overrides
- Google credential handling

---

# Environment Configuration

Current environment config:

```txt
src/frontend/env.json
```

Current values are placeholders.

This must eventually contain:

- backend_host
- backend_canister_id
- project_id
- ii_derivation_origin

Without real values:

- frontend may render
- but backend functionality will fail

---

# Authentication Model

## Current Auth

The app currently uses:

- Internet Identity
- Protected routes
- User roles
- Invite-based onboarding

## User Roles

Current known roles:

- admin
- user
- guest

## Internal Access Goal

The MVP only needs:

- Ray
- one additional trusted user

Public clients should NEVER need login.

---

# Public Routes

## Booking Route

```txt
/book/:linkId
```

Purpose:

Client-facing booking page.

Current functionality:

- select date
- select time slot
- enter name/email
- enter purpose
- upload files
- create booking

---

## Management Route

```txt
/manage/:managementToken
```

Purpose:

Allow clients to:

- reschedule
- cancel
- review appointment details

without login.

---

# Internal Routes

## Host Dashboard

```txt
/host
```

Purpose:

Internal landing/dashboard area.

---

## Booking Link Management

```txt
/host/links
```

Purpose:

Create/edit/manage booking links.

---

## Calendar Management

```txt
/host/calendar
```

Purpose:

Review availability and manage manual overrides.

---

## Settings

```txt
/host/settings
```

Purpose:

- Google Calendar connection
- Team/user management
- App settings

---

# Existing Feature Inventory

## Already Implemented

### Authentication

- Login
- Protected routes
- Role checks
- Invite flow
- Active/inactive users

### Booking Links

- Create links
- Edit links
- Delete links
- Activate/deactivate links

### Booking Flow

- Public booking page
- Slot selection
- Client info capture
- Booking creation

### Calendar Features

- Google OAuth scaffolding
- Free/busy lookup
- Slot generation
- Busy overrides

### Appointment Management

- Token lookup
- Reschedule UI
- Cancel UI

---

# Missing or Incomplete Features

## Manual Force-Block Overrides

Currently implemented:

- busy slot -> force-open

Missing:

- open slot -> force-block

This is required for real-world scheduling flexibility.

---

## Booking Ownership Validation

Need to verify:

- links belong to specific users
- Google credentials belong to correct users
- calendars cannot accidentally cross over

---

## Real Google Calendar Event Lifecycle

Need to verify whether backend currently:

- creates events
- updates events
- deletes/cancels events
- stores event IDs
- syncs reschedules

This is one of the highest-priority investigations.

---

## Server-Side Availability Validation

Need stronger backend validation during:

- booking creation
- reschedule

to prevent double-booking.

---

## Branding System

Currently minimal.

Needed MVP additions:

- TCV logo
- host display name
- basic brand color
- timezone support

Avoid overbuilding this initially.

---

# Google Calendar Integration

## Current Scope Goals

The app intends to use:

- free/busy lookup
- event creation
- attendee invitations
- event updates
- event cancellations

## Important Security Note

Current implementation appears to handle Google credentials partially client-side.

This is acceptable ONLY for:

- internal MVP usage
- low-risk testing
- trusted users

Long-term recommendation:

Move refresh token handling server-side.

---

# Availability Logic Goals

The final availability engine should combine:

- Google Calendar busy blocks
- Existing bookings
- Working hours
- Minimum notice
- Active/inactive links
- Force-open overrides
- Force-block overrides

---

# Recommended MVP Philosophy

This project should prioritize:

1. Reliability
2. Correct scheduling
3. Calendar sync accuracy
4. Security fundamentals

Over:

- UI polish
- advanced branding
- automation features
- AI features
- analytics
- complex workflow systems

---

# Current Highest-Priority Questions

## Critical Unknowns

### 1. Where is the backend deployed?

Need to identify:

- backend deployment location
- production/staging environments
- canister IDs
- actual env values

---

### 2. Does booking create real Google Calendar events?

Need to verify:

- event creation
- attendee invitation
- notifications
- event updates
- event cancellations

---

### 3. Are Google credentials stored per-user?

Need to confirm:

- credential isolation
- booking ownership
- calendar ownership

---

### 4. Are public booking routes properly permissioned?

Need to confirm:

- anonymous users can only access safe methods
- admin methods are protected
- token abuse is limited

---

# Recommended Immediate Engineering Priorities

## Priority 1

Deploy frontend reliably on Vercel.

---

## Priority 2

Resolve real backend environment configuration.

---

## Priority 3

Verify Google Calendar integration works end-to-end.

---

## Priority 4

Verify bookings create real calendar events.

---

## Priority 5

Add force-block availability overrides.

---

## Priority 6

Harden token/security handling.

---

# Long-Term Recommendation

If the app grows beyond internal use:

Strongly consider:

- moving sensitive auth/token handling server-side
- migrating to a more conventional backend stack
- adding transactional email infrastructure
- improving observability/logging
- implementing audit trails
- adding abuse/rate limiting

For now, keep the MVP lean and operational.
