# Design Brief

## Visual Direction
Dark-first, minimalist booking platform. Very dark navy background (#080A0D), light cool-gray foreground (#EEF2F6), warm orange/gold accents (#FFB020). Professional, premium aesthetic. Calendar grid protagonist. Clean typography, zero clutter.

## Tone
Trustworthy, precise, premium. Dark-only experience. Warm accents create focus and confidence.

## Differentiation
Dark navy + warm orange palette with strategic scrollbar styling. Slot states (available/busy/bookable-override) through color and opacity. Override toggles glow orange. High-contrast text on dark surfaces ensures readability.

## Color Palette

| Token | Dark OKLCH | Reference Hex | Purpose |
|-------|-----------|---------------|----------|
| Background | 0.053 0.01 230 | #080A0D | Ultra-dark navy base |
| Foreground | 0.94 0.01 200 | #EEF2F6 | Light cool-gray text |
| Accent | 0.72 0.20 70 | #FFB020 | Warm orange/gold highlights |
| Card | 0.09 0.02 220 | #0E1217 | Dark blue-gray surfaces |
| Muted | 0.14 0.015 215 | — | Secondary backgrounds |
| Border | 0.18 0.01 215 | — | Subtle dividers |

## Typography
- **Display**: General Sans — geometric, modern.
- **Body**: DM Sans — clean, neutral, optimized for UI.
- **Mono**: Geist Mono — time/date, booking IDs.

## Elevation & Depth
- **Base**: Dark navy with minimal shadow.
- **Card**: `shadow-card` on #0E1217.
- **Elevated**: `shadow-elevated` for modals.

## Structural Zones

| Zone | Background | Border | Purpose |
|------|------------|--------|----------|
| Header | `bg-card` | `border-b border-border` | Sticky nav, high contrast. |
| Main | `bg-background` | None | Calendar grid, booking list. |
| Grid | `bg-muted` cells | `border border-border` | Free/Busy/Bookable states. |
| Cards | `bg-card` | `border border-border` | Booking details, badges. |
| Modals | `bg-popover` | `border border-border` | Forms, dialogs. |

## Spacing & Rhythm
- **Base unit**: 4px.
- **Dense zones**: 2px gaps, 8px padding.
- **Loose zones**: 16–24px gutters.

## Component Patterns
- **Slots**: `.slot-available` (muted), `.slot-busy` (disabled), `.slot-bookable` (orange border).
- **Toggles**: `.override-active` — orange background.
- **Buttons**: Primary (blue), Secondary (border), Accent (orange).
- **Inputs**: `bg-input`, `border-border`, orange focus ring.
- **Scrollbar**: Dark blue-gray thumb, 8px width, transparent track.

## Motion & Animation
- **Smooth**: `transition-smooth` (0.3s cubic-bezier).
- **Subtle pulse** when override state changes.
- **Minimal, purposeful** interactions.

## Constraints
- Radius: 4px default.
- OKLCH tokens only. No hex, rgb(), or arbitrary values.
- Dark mode only.
- Form compact (28px input height).
- Custom webkit scrollbar styling.

## Signature Detail
Orange accents on interactive elements create instant visual feedback and brand warmth against cool navy. Override toggles pulse orange when activated, affirming precise control.
