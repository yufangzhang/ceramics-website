import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://yufangzhang.com',
  base: '/',
  integrations: [
    tailwind(),
    sentry({
      dsn: process.env.PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV || 'production',
      release: process.env.GITHUB_SHA || 'dev',
      sourceMapsUploadOptions: {
        enabled: false, // Enable when you need source maps
      },

      // Performance Monitoring
      tracesSampleRate: 1.0,

      // Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,

      // Replay configuration
      replayOptions: {
        maskAllText: false,
        blockAllMedia: false,
      },
    }),
  ],
  output: 'static',
});
