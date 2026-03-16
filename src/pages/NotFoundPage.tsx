import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="w-full max-w-xl rounded-[32px] p-9 text-center"
        style={{
          background:
            'radial-gradient(circle at top right, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 30%), var(--gradient-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 30px 60px rgba(2, 6, 23, 0.2)',
        }}
      >
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--color-secondary)' }}>
          Lost route
        </div>
        <h1 className="mt-3 text-3xl font-bold" style={{ color: 'var(--color-text)', fontFamily: "'Syne', sans-serif" }}>
          Page not found
        </h1>
        <p className="mt-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          The link may be broken, or the page may have moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/login" className="btn btn-primary">Go to login</Link>
          <Link to="/" className="btn btn-ghost">Go home</Link>
        </div>
      </div>
    </div>
  );
}
