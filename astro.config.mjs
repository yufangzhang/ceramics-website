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
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    }),
  ],
  output: 'static',
});
