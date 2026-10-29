import {defineField, defineType, defineArrayMember} from 'sanity'

const UK_FORMAT: Intl.DateTimeFormatOptions = {
  timeZone: 'Europe/London',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sessions',
      title: 'Sessions',
      description:
        'One or more sessions. Each session has a start and optional end. All times are interpreted as UK time (Europe/London) on the public site.',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'session',
          title: 'Session',
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
              description: 'Optional end time for this session',
            }),
          ],
          preview: {
            select: {start: 'start', end: 'end'},
            prepare({start, end}) {
              if (!start) return {title: 'No start time'}
              const startStr = new Intl.DateTimeFormat('en-GB', UK_FORMAT).format(new Date(start))
              if (!end) return {title: startStr}
              const endStr = new Intl.DateTimeFormat('en-GB', UK_FORMAT).format(new Date(end))
              return {title: `${startStr} — ${endStr}`}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
      description: 'Optional link for registration or more information',
    }),
    defineField({
      name: 'isPast',
      title: 'Mark as Past Event',
      type: 'boolean',
      description: 'Manually mark this event as past (overrides automatic date checking)',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      firstStart: 'sessions.0.start',
      location: 'location',
    },
    prepare(selection) {
      const {title, firstStart, location} = selection
      const dateStr = firstStart
        ? new Intl.DateTimeFormat('en-GB', UK_FORMAT).format(new Date(firstStart))
        : 'No date'
      return {
        title: title,
        subtitle: `${dateStr} • ${location}`,
      }
    },
  },
  orderings: [
    {
      title: 'First session, newest',
      name: 'firstSessionDesc',
      by: [{field: 'sessions.0.start', direction: 'desc'}],
    },
    {
      title: 'First session, oldest',
      name: 'firstSessionAsc',
      by: [{field: 'sessions.0.start', direction: 'asc'}],
    },
  ],
})
