export default function CustomError({ statusCode }) {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>{statusCode || 500} – Something went wrong</h1>
      <p>Please try refreshing the page.</p>
    </div>
  );
}
