import type { Event } from './sanityClient';

export function isEventPast(event: Event, now: Date): boolean {
  if (event.isPast) return true;
  const relevantDate = new Date(event.endDate ?? event.date);
  return relevantDate < now;
}

export interface GroupedEvents {
  upcoming: Event[];
  past: Record<number, Event[]>;
  pastYears: number[];
}

export function groupEvents(events: Event[], now: Date): GroupedEvents {
  const upcoming: Event[] = [];
  const past: Record<number, Event[]> = {};

  for (const event of events) {
    if (isEventPast(event, now)) {
      const year = new Date(event.date).getFullYear();
      if (!past[year]) past[year] = [];
      past[year].push(event);
    } else {
      upcoming.push(event);
    }
  }

  const pastYears = Object.keys(past).map(Number).sort((a, b) => b - a);

  return { upcoming, past, pastYears };
}
