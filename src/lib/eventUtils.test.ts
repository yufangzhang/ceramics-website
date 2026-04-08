import { describe, it, expect } from 'vitest';
import { isEventPast, groupEvents } from './eventUtils';
import type { Event } from './sanityClient';

function makeEvent(overrides: Partial<Event> & { date: string }): Event {
  return {
    _id: '1',
    title: 'Test Event',
    location: 'Studio',
    ...overrides,
  };
}

const now = new Date('2026-04-08T12:00:00');

describe('isEventPast', () => {
  it('returns true when event date is before now', () => {
    const event = makeEvent({ date: '2026-03-01T10:00:00' });
    expect(isEventPast(event, now)).toBe(true);
  });

  it('returns false when event date is after now', () => {
    const event = makeEvent({ date: '2026-05-01T10:00:00' });
    expect(isEventPast(event, now)).toBe(false);
  });

  it('uses endDate when present (event still ongoing)', () => {
    const event = makeEvent({
      date: '2026-04-05T10:00:00',
      endDate: '2026-04-10T18:00:00',
    });
    expect(isEventPast(event, now)).toBe(false);
  });

  it('uses endDate when present (event ended)', () => {
    const event = makeEvent({
      date: '2026-04-01T10:00:00',
      endDate: '2026-04-07T18:00:00',
    });
    expect(isEventPast(event, now)).toBe(true);
  });

  it('returns true when isPast is manually set, even if date is future', () => {
    const event = makeEvent({
      date: '2026-12-01T10:00:00',
      isPast: true,
    });
    expect(isEventPast(event, now)).toBe(true);
  });

  it('returns false when isPast is false and date is future', () => {
    const event = makeEvent({
      date: '2026-12-01T10:00:00',
      isPast: false,
    });
    expect(isEventPast(event, now)).toBe(false);
  });
});

describe('groupEvents', () => {
  const events: Event[] = [
    makeEvent({ _id: 'future1', date: '2026-06-01T10:00:00', title: 'Future' }),
    makeEvent({ _id: 'past-this-year', date: '2026-01-15T10:00:00', title: 'Past This Year' }),
    makeEvent({ _id: 'past-last-year', date: '2025-08-01T10:00:00', title: 'Past Last Year' }),
    makeEvent({ _id: 'manually-past', date: '2026-11-01T10:00:00', title: 'Manually Past', isPast: true }),
    makeEvent({ _id: 'ongoing', date: '2026-04-06T10:00:00', endDate: '2026-04-10T18:00:00', title: 'Ongoing' }),
  ];

  const result = groupEvents(events, now);

  it('puts future and ongoing events in upcoming', () => {
    const ids = result.upcoming.map(e => e._id);
    expect(ids).toContain('future1');
    expect(ids).toContain('ongoing');
  });

  it('puts past events in past, grouped by year', () => {
    expect(result.past[2026]?.map(e => e._id)).toContain('past-this-year');
    expect(result.past[2025]?.map(e => e._id)).toContain('past-last-year');
  });

  it('puts manually-past events in past under their event year', () => {
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
