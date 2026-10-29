# Events: multi-session support and UK time display

**Date:** 2026-06-01
**Status:** Draft

## Problem

The events page has two issues:

1. Times render in the visitor's locale and timezone using `'en-US'` formatting (American month/day, no fixed timezone). For a UK-based studio, this is wrong: a London 14:00 event displays as e.g. "9:00 AM" to a New York visitor with no UK reference, and dates show in US order.
2. Events that span multiple separate sessions (e.g., a 3-week workshop on consecutive Saturdays) cannot be expressed. The schema only supports a single `date` + optional `endDate`, which fits a single contiguous session.

## Goals

- All event times render server-side in UK time using British formatting.
- Non-UK visitors additionally see their local equivalent next to each time, labeled with the short timezone abbreviation they recognize (e.g., `PDT`, `JST`, `AEST`).
- Events can have one or more sessions, each with its own start and optional end. A simple single-session event is just an array of one.

## Non-goals

- No recurring-event rules (RRULE etc.). Each session is an explicit datetime.
- No per-session location/description/link variations — those remain event-level.
- No timezone selection per event; UK is the canonical zone for this studio.

## Design

### Schema (`schemas/event.ts`)

Replace `date` and `endDate` with a single `sessions` array. At least one session required.

```ts
defineField({
  name: 'sessions',
  title: 'Sessions',
  type: 'array',
  of: [{
    type: 'object',
    name: 'session',
    fields: [
      defineField({
        name: 'start',
        title: 'Start',
        type: 'datetime',
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'end',
        title: 'End',
        type: 'datetime',
        description: 'Optional. If omitted, only the start time is shown.',
      }),
    ],
    preview: {
      select: { start: 'start', end: 'end' },
      prepare({ start, end }) {
        // Show start (and end if present) in UK time for editor clarity.
      },
    },
  }],
  validation: (Rule) => Rule.required().min(1),
})
```

The document-level preview and orderings switch from `date` to `sessions[0].start`.

The `isPast` boolean field is retained — it still serves as a manual override.

### Migration

A one-shot script at `scripts/migrateEventsToSessions.ts`, runnable with `pnpm tsx scripts/migrateEventsToSessions.ts [--dry-run]`.

Behavior:
- Reads `SANITY_WRITE_TOKEN`, `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET` from `.env`.
- Fetches all `event` documents.
- For each doc with a `date` field and no `sessions`: builds `sessions: [{start: date, end: endDate}]` (omitting `end` if absent), patches the doc to set `sessions` and unset `date` and `endDate`.
- `--dry-run` logs the planned mutations without writing.
- Skips docs that already have `sessions` (idempotent).
- Logs a per-doc summary and a final tally.

The script is committed but only run after the user adds a write token and approves the dry-run output.

### Type (`src/lib/sanityClient.ts`)

```ts
export interface EventSession {
  start: string;
  end?: string;
}

export interface Event {
  _id: string;
  title: string;
  sessions: EventSession[];
  location: string;
  description?: string;
  link?: string;
  isPast?: boolean;
}
```

### `eventUtils.ts`

- `isEventPast(event, now)`: event is past when `isPast === true`, OR when the **last session's end** (or `start` if `end` missing) is before `now`.
- `groupEvents(events, now)`: bucket past events by **first session's year**. Order upcoming by first session's `start` ascending.
- New helper `formatSessions(sessions: EventSession[]): string[]` — returns one formatted line per session, all in `Europe/London` / `en-GB`. Cases per session:
  - Same calendar day, end present: `D Month • HH:MM — HH:MM ZZZ`
  - Different days, end present: `D — D Month • HH:MM — HH:MM ZZZ` (or `D Month — D Month` if months differ)
  - End missing: `D Month • HH:MM ZZZ`
- New helper `firstSessionYear(event)` for archive grouping.

Implementation uses `Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', ... })`. The trailing `ZZZ` is from `timeZoneName: 'short'` (yields `BST` or `GMT`).

### Display (`src/pages/events.astro`)

- GROQ query selects `sessions[]{start, end}` instead of `date, endDate`.
- For each upcoming event, render one `<time>` block per session containing the server-formatted UK string. Each block carries `data-start` (ISO) and `data-end` (ISO, if present) attributes.
- Past archive section continues to show month + year derived from first session.

A small inline `<script>` runs once on load:
1. Read `Intl.DateTimeFormat().resolvedOptions().timeZone`.
2. If it equals `Europe/London`, exit.
3. Otherwise, for each `[data-start]` element:
   - Parse `data-start` and `data-end`.
   - Format both in the visitor's zone using `Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })`.
   - Append a styled span: `(09:00 — 11:00 PDT)` (or `(09:00 PDT)` when no end).

The inline script is dependency-free, ~30 lines, and progressive: SSR output is fully usable without it.

### Tests (`src/lib/eventUtils.test.ts`)

Rewrite for the new shape. Coverage:
- `isEventPast` — single past session, single future session, multi-session where the last session is still ahead, manual `isPast` override.
- `groupEvents` — buckets by first session's year, sorts upcoming by first start.
- `formatSessions` — same-day, different-day same-month, different-month, no-end. All asserts use fixed strings against `Europe/London` / `en-GB`. (CI should set `TZ=UTC` for determinism; if not, add a top-level test note.)

## Risks & mitigations

- **Migration data loss** — addressed by `--dry-run` and idempotency (`sessions` already set → skip).
- **Locale/timezone availability in CI** — modern Node ships full ICU; verified by tests producing literal expected strings.
- **JS-disabled visitors outside UK** — by design, they only see UK time. Acceptable trade-off; UK time is unambiguous and labeled.
- **DST transitions** — handled by `Intl` automatically; tests include both BST (summer) and GMT (winter) dates.

## Files touched

- `schemas/event.ts` — replace fields, update preview/orderings
- `src/lib/sanityClient.ts` — `Event` and `EventSession` types
- `src/lib/eventUtils.ts` — sessions-aware logic + `formatSessions`
- `src/lib/eventUtils.test.ts` — rewritten
- `src/pages/events.astro` — query, render loop, inline enhancement script
- `scripts/migrateEventsToSessions.ts` — one-shot migration (new)

## Out of scope / future

- Per-session location overrides
- Recurrence rules
- iCal export
