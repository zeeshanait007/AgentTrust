"use client";

export default function GlobalError({ error }: { error: Error }) {
  console.error('Error rendering page:', error);
  return (
    <html lang="en">
      <body style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Something went wrong</h1>
        <p>Please try refreshing the page.</p>
      </body>
    </html>
  );
}
