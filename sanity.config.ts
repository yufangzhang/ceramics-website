import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

// Sanity project configuration
// Note: Project IDs are public identifiers (not secrets) - safe to hardcode
// For local development with .env: uses SANITY_STUDIO_* variables as fallback
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'k145g8mg'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Pottery Website',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Profile')
              .child(
                S.document()
                  .schemaType('profile')
                  .documentId('profile')
              ),
            S.divider(),
            S.listItem()
              .title('Home Showcase')
              .schemaType('homeShowcase')
              .child(S.documentTypeList('homeShowcase').title('Home Showcase')),
            S.listItem()
              .title('Selected Works')
              .schemaType('work')
              .child(S.documentTypeList('work').title('Selected Works')),
            S.listItem()
              .title('Events')
              .child(
                S.list()
                  .title('Events')
                  .items([
                    S.listItem()
                      .title('Upcoming Events')
                      .schemaType('event')
                      .child(
                        S.documentList()
                          .title('Upcoming Events')
                          .filter('_type == "event" && isPast != true && date >= now()')
                          .defaultOrdering([{field: 'date', direction: 'asc'}])
                      ),
                    S.listItem()
                      .title('Past Events')
                      .schemaType('event')
                      .child(
                        S.documentList()
                          .title('Past Events')
                          .filter('_type == "event" && (isPast == true || date < now())')
                          .defaultOrdering([{field: 'date', direction: 'desc'}])
                      ),
                    S.divider(),
                    S.listItem()
                      .title('All Events')
                      .schemaType('event')
                      .child(
                        S.documentList()
                          .title('All Events')
                          .filter('_type == "event"')
                          .defaultOrdering([{field: 'date', direction: 'desc'}])
                      ),
                  ])
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
