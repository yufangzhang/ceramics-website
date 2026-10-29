import { describe, it, expect } from 'vitest';
import { isEventPast, groupEvents, formatSession } from './eventUtils';
import type { Event, EventSession } from './sanityClient';

function makeEvent(overrides: Partial<Event> & { sessions: EventSession[] }): Event {
  return {
    _id: '1',
    title: 'Test Event',
    location: 'Studio',
    ...overrides,
  };
}

const now = new Date('2026-04-08T12:00:00Z');

describe('isEventPast', () => {
  it('returns true when the only session start is before now and no end', () => {
    const event = makeEvent({ sessions: [{ start: '2026-03-01T10:00:00Z' }] });
    expect(isEventPast(event, now)).toBe(true);
  });

  it('returns false when the only session start is after now', () => {
    const event = makeEvent({ sessions: [{ start: '2026-05-01T10:00:00Z' }] });
    expect(isEventPast(event, now)).toBe(false);
  });

  it('uses last session end when present (event still ongoing)', () => {
    const event = makeEvent({
      sessions: [
        { start: '2026-04-05T10:00:00Z', end: '2026-04-05T18:00:00Z' },
        { start: '2026-04-10T10:00:00Z', end: '2026-04-10T18:00:00Z' },
      ],
    });
    expect(isEventPast(event, now)).toBe(false);
  });

  it('uses last session end when present (event ended)', () => {
    const event = makeEvent({
      sessions: [
        { start: '2026-04-01T10:00:00Z', end: '2026-04-01T18:00:00Z' },
        { start: '2026-04-07T10:00:00Z', end: '2026-04-07T18:00:00Z' },
      ],
    });
    expect(isEventPast(event, now)).toBe(true);
  });

  it('returns true when isPast is manually set, even if a session is future', () => {
    const event = makeEvent({
      sessions: [{ start: '2026-12-01T10:00:00Z' }],
      isPast: true,
    });
    expect(isEventPast(event, now)).toBe(true);
  });

  it('returns false when isPast is false and a future session exists', () => {
    const event = makeEvent({
      sessions: [{ start: '2026-12-01T10:00:00Z' }],
      isPast: false,
    });
    expect(isEventPast(event, now)).toBe(false);
  });
});

describe('groupEvents', () => {
  const events: Event[] = [
    makeEvent({ _id: 'future1', sessions: [{ start: '2026-06-01T10:00:00Z' }], title: 'Future' }),
    makeEvent({ _id: 'past-this-year', sessions: [{ start: '2026-01-15T10:00:00Z' }], title: 'Past This Year' }),
    makeEvent({ _id: 'past-last-year', sessions: [{ start: '2025-08-01T10:00:00Z' }], title: 'Past Last Year' }),
    makeEvent({ _id: 'manually-past', sessions: [{ start: '2026-11-01T10:00:00Z' }], title: 'Manually Past', isPast: true }),
    makeEvent({
      _id: 'ongoing',
      title: 'Ongoing',
      sessions: [
        { start: '2026-04-06T10:00:00Z', end: '2026-04-06T18:00:00Z' },
        { start: '2026-04-10T10:00:00Z', end: '2026-04-10T18:00:00Z' },
      ],
    }),
  ];

  const result = groupEvents(events, now);

  it('puts future and ongoing events in upcoming', () => {
    const ids = result.upcoming.map(e => e._id);
    expect(ids).toContain('future1');
    expect(ids).toContain('ongoing');
  });

  it('orders upcoming by first session start ascending', () => {
    const ids = result.upcoming.map(e => e._id);
    expect(ids).toEqual(['ongoing', 'future1']);
  });

  it('puts past events in past, grouped by first session year', () => {
    expect(result.past[2026]?.map(e => e._id)).toContain('past-this-year');
    expect(result.past[2025]?.map(e => e._id)).toContain('past-last-year');
  });

  it('puts manually-past events in past under their first session year', () => {
    expect(result.past[2026]?.map(e => e._id)).toContain('manually-past');
  });

  it('does not include past events in upcoming', () => {
    const ids = result.upcoming.map(e => e._id);
    expect(ids).not.toContain('past-this-year');
    expect(ids).not.toContain('past-last-year');
    expect(ids).not.toContain('manually-past');
  });

  it('returns pastYears sorted newest first', () => {
    expect(result.pastYears).toEqual([2026, 2025]);
  });
});

describe('formatSession (Europe/London, en-GB)', () => {
  // Summer (BST = UTC+1)
  it('formats a same-day session with start and end (BST)', () => {
    // 2026-06-06T13:00:00Z = 14:00 BST; 2026-06-06T15:00:00Z = 16:00 BST
    const s = { start: '2026-06-06T13:00:00Z', end: '2026-06-06T15:00:00Z' };
    expect(formatSession(s)).toBe('6 June • 14:00 — 16:00 BST');
  });

  it('formats a same-month multi-day session (BST)', () => {
    const s = { start: '2026-06-06T13:00:00Z', end: '2026-06-08T15:00:00Z' };
    expect(formatSession(s)).toBe('6 — 8 June • 14:00 — 16:00 BST');
  });

  it('formats a cross-month multi-day session (BST)', () => {
    const s = { start: '2026-06-30T13:00:00Z', end: '2026-07-02T15:00:00Z' };
    expect(formatSession(s)).toBe('30 June — 2 July • 14:00 — 16:00 BST');
  });

  it('formats a session with no end (BST)', () => {
    const s = { start: '2026-06-06T13:00:00Z' };
    expect(formatSession(s)).toBe('6 June • 14:00 BST');
  });

  // Winter (GMT = UTC+0)
  it('formats a same-day session in winter (GMT)', () => {
    const s = { start: '2026-01-10T14:00:00Z', end: '2026-01-10T16:00:00Z' };
    expect(formatSession(s)).toBe('10 January • 14:00 — 16:00 GMT');
  });

  // DST boundary sanity — time that crosses into BST
  it('uses BST for a date just after the spring forward', () => {
    // BST 2026 begins 2026-03-29T01:00:00Z
    const s = { start: '2026-03-29T13:00:00Z' };
    expect(formatSession(s)).toBe('29 March • 14:00 BST');
  });
});
