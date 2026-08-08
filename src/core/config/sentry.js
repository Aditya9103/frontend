/**
 * sentry.js — Sentry error monitoring (frontend)
 *
 * Imported once in main.jsx before React renders.
 * No-ops cleanly when VITE_SENTRY_DSN is absent (local dev / staging without monitoring).
 *
 * PII scrubbing (closes Review Item 3.2):
 *   - Authorization header stripped from all requests captured in breadcrumbs
 *   - Cookie header stripped
 *   - Request body fields matching password|token|otp|refreshToken are redacted
 *   - Auth endpoint URLs are normalised in breadcrumbs
 *
 * Environment variables (Vite):
 *   VITE_SENTRY_DSN            - Required in production
 *   VITE_SENTRY_ENVIRONMENT    - Defaults to import.meta.env.MODE
 *   VITE_SENTRY_TRACES_SAMPLE_RATE  - 0.0–1.0, default 0.1
 */
import * as Sentry from '@sentry/react';

const SENSITIVE_FIELDS = /password|token|otp|refreshToken|secret/i;

/** Recursively redacts sensitive keys in an object. */
function redactObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (SENSITIVE_FIELDS.test(key)) return [key, '[Redacted]'];
      if (value && typeof value === 'object') return [key, redactObject(value)];
      return [key, value];
    })
  );
}

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return; // No-op in local dev / environments without monitoring

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        // Mask all text and block all media in Session Replay to prevent PII capture
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    replaysSessionSampleRate: 0.05,  // 5% of sessions
    replaysOnErrorSampleRate: 1.0,   // 100% of sessions with errors

    // ── PII Scrubbing ──────────────────────────────────────────────────────────
    beforeSend(event) {
      // 1. Strip sensitive headers
      if (event.request?.headers) {
        const safeHeaders = { ...event.request.headers };
        delete safeHeaders['authorization'];
        delete safeHeaders['Authorization'];
        delete safeHeaders['cookie'];
        delete safeHeaders['Cookie'];
        event.request.headers = safeHeaders;
      }

      // 2. Redact sensitive request body fields
      if (event.request?.data) {
        if (typeof event.request.data === 'string') {
          try {
            const parsed = JSON.parse(event.request.data);
            event.request.data = JSON.stringify(redactObject(parsed));
          } catch {
            event.request.data = '[Redacted non-JSON body]';
          }
        } else if (typeof event.request.data === 'object') {
          event.request.data = redactObject(event.request.data);
        }
      }

      // 3. Normalise auth endpoint breadcrumbs (prevent token leakage in URLs)
      if (event.breadcrumbs?.values) {
        event.breadcrumbs.values = event.breadcrumbs.values.map((crumb) => {
          if (crumb.type === 'http' && crumb.data?.url) {
            // Strip query strings (may contain tokens in legacy integrations)
            crumb.data.url = crumb.data.url.split('?')[0];
            if (crumb.data.url.includes('/auth/')) {
              crumb.data = { url: '[auth endpoint]', method: crumb.data.method };
            }
          }
          return crumb;
        });
      }

      return event;
    },

    // Ignore common noise
    ignoreErrors: [
      'Network request failed',
      'Failed to fetch',
      'Load failed',
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
    ],
  });
}

export default Sentry;
