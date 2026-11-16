'use client';

import { useEffect } from 'react';

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
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', backgroundColor: '#F3F5F8' }}>
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
          <div>
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

            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#171B24', margin: '0 0 8px' }}>
              We&apos;ve had a serious breakdown
            </h1>
            <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 24px', maxWidth: 360 }}>
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
