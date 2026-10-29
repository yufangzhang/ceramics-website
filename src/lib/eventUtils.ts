import type { Event, EventSession } from './sanityClient';

const UK_TZ = 'Europe/London';
const UK_LOCALE = 'en-GB';

function lastSessionEnd(sessions: EventSession[]): Date | null {
  if (sessions.length === 0) return null;
  const last = sessions[sessions.length - 1];
  return new Date(last.end ?? last.start);
}

function firstSessionStart(sessions: EventSession[]): Date | null {
  if (sessions.length === 0) return null;
  return new Date(sessions[0].start);
}

export function isEventPast(event: Event, now: Date): boolean {
  if (event.isPast) return true;
  const end = lastSessionEnd(event.sessions ?? []);
  if (!end) return false;
  return end < now;
}

export function eventYear(event: Event): number {
  const start = firstSessionStart(event.sessions ?? []);
  return (start ?? new Date()).getFullYear();
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
      const year = eventYear(event);
      if (!past[year]) past[year] = [];
      past[year].push(event);
    } else {
      upcoming.push(event);
    }
  }

  upcoming.sort((a, b) => {
    const aStart = firstSessionStart(a.sessions ?? [])?.getTime() ?? 0;
    const bStart = firstSessionStart(b.sessions ?? [])?.getTime() ?? 0;
    return aStart - bStart;
  });

  const pastYears = Object.keys(past).map(Number).sort((a, b) => b - a);

  return { upcoming, past, pastYears };
}

// --- Formatting ---

function parts(date: Date, opts: Intl.DateTimeFormatOptions): Record<string, string> {
  const result: Record<string, string> = {};
  for (const p of new Intl.DateTimeFormat(UK_LOCALE, { timeZone: UK_TZ, ...opts }).formatToParts(date)) {
    if (p.type !== 'literal') result[p.type] = p.value;
  }
  return result;
}

function formatDay(date: Date): string {
  return parts(date, { day: 'numeric' }).day;
}

function formatMonth(date: Date): string {
  return parts(date, { month: 'long' }).month;
}

function formatTime(date: Date): string {
  const p = parts(date, { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${p.hour}:${p.minute}`;
}

function formatTzAbbrev(date: Date): string {
  return parts(date, { timeZoneName: 'short' }).timeZoneName ?? '';
}

function sameUkDay(a: Date, b: Date): boolean {
  const pa = parts(a, { day: 'numeric', month: 'numeric', year: 'numeric' });
  const pb = parts(b, { day: 'numeric', month: 'numeric', year: 'numeric' });
  return pa.day === pb.day && pa.month === pb.month && pa.year === pb.year;
}

function sameUkMonth(a: Date, b: Date): boolean {
  const pa = parts(a, { month: 'numeric', year: 'numeric' });
  const pb = parts(b, { month: 'numeric', year: 'numeric' });
  return pa.month === pb.month && pa.year === pb.year;
}

/**
 * Formats a single session as a one-line string in UK time, en-GB.
 *
 * Forms:
 *   same day, with end       → "6 June • 14:00 — 16:00 BST"
 *   same month, with end     → "6 — 8 June • 14:00 — 16:00 BST"
 *   diff month, with end     → "30 June — 2 July • 14:00 — 16:00 BST"
 *   no end                   → "6 June • 14:00 BST"
 */
export function formatSession(session: EventSession): string {
  const start = new Date(session.start);
  const tz = formatTzAbbrev(start);
  const startTime = formatTime(start);

  if (!session.end) {
    return `${formatDay(start)} ${formatMonth(start)} • ${startTime} ${tz}`;
  }

  const end = new Date(session.end);
  const endTime = formatTime(end);

  if (sameUkDay(start, end)) {
    return `${formatDay(start)} ${formatMonth(start)} • ${startTime} — ${endTime} ${tz}`;
  }

  if (sameUkMonth(start, end)) {
    return `${formatDay(start)} — ${formatDay(end)} ${formatMonth(start)} • ${startTime} — ${endTime} ${tz}`;
  }

  return `${formatDay(start)} ${formatMonth(start)} — ${formatDay(end)} ${formatMonth(end)} • ${startTime} — ${endTime} ${tz}`;
}

export function formatSessions(sessions: EventSession[]): string[] {
  return sessions.map(formatSession);
}

export function formatYearForEvent(event: Event): string {
  const start = firstSessionStart(event.sessions ?? []);
  if (!start) return '';
  return parts(start, { year: 'numeric' }).year;
}

export function formatMonthForEvent(event: Event): string {
  const start = firstSessionStart(event.sessions ?? []);
  if (!start) return '';
  return formatMonth(start);
}
