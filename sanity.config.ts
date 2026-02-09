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
            ...S.documentTypeListItems().filter(
              (listItem) => !['profile'].includes(listItem.getId() || '')
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
