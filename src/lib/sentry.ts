import * as Sentry from '@sentry/astro';

// Only initialize Sentry once
if (!Sentry.getClient()) {
  const isDev = import.meta.env.DEV;

  Sentry.init({
    dsn: import.meta.env.PUBLIC_SENTRY_DSN,
    environment: import.meta.env.MODE || 'production',

    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Performance Monitoring
    tracesSampleRate: isDev ? 0.1 : 1.0, // Lower in dev to reduce noise

    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of errors

    // Filter out common noise
    beforeSend(event, hint) {
      // Filter out browser extension errors
      if (event.exception?.values?.[0]?.value?.includes('chrome-extension://')) {
        return null;
      }
      // Filter out network errors from ad blockers
      if (event.exception?.values?.[0]?.type === 'NetworkError') {
        return null;
      }
      return event;
    },

    // Add context for better debugging
    initialScope: {
      tags: {
        site: 'pottery-website',
      },
    },
  });
}
