'use client';

import { useEffect } from 'react';

// This component renders its own <html>/<body> and cannot rely on the app's
// CSS variables or Tailwind classes, so it inlines a media query to respect the
// OS dark preference.
const styles = `
  :root { --ge-bg: #F3F5F8; --ge-card: #FFFFFF; --ge-text: #171B24; --ge-muted: #6B7280; --ge-border: #E6EAF0; }
  @media (prefers-color-scheme: dark) {
    :root { --ge-bg: #14181F; --ge-card: #1E2430; --ge-text: #F3F5F8; --ge-muted: #9CA3AF; --ge-border: #2C3340; }
  }
`;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('TrueWheels global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: 'var(--ge-bg)',
          color: 'var(--ge-text)',
        }}
      >
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              maxWidth: 400,
              padding: '40px 32px',
              backgroundColor: 'var(--ge-card)',
              border: '1px solid var(--ge-border)',
              borderRadius: 16,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: '#D92332',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 28 }}>T</span>
            </div>

            <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px' }}>
              We&apos;ve had a serious breakdown
            </h1>
            <p style={{ fontSize: 14, color: 'var(--ge-muted)', margin: '0 0 24px' }}>
              A critical error occurred. Please reload the page — if it persists, try again in a few
              minutes.
            </p>

            <button
              type="button"
              onClick={reset}
              style={{
                backgroundColor: '#D92332',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '12px 28px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

