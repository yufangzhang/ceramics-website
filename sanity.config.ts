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
              .schemaType('event')
              .child(S.documentTypeList('event').title('Events')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
