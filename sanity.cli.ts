import {defineCliConfig} from 'sanity/cli'

// Sanity CLI configuration
// Note: Project IDs are public identifiers (not secrets) - safe to hardcode
// For local development with .env: uses SANITY_STUDIO_* variables as fallback
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'k145g8mg'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineCliConfig({
  api: {
    projectId,
    dataset
  }
})
