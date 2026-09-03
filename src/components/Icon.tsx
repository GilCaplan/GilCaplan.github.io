// Small hand-drawn line-icon set — replaces emoji in site chrome with graphics
// that match the site's own visual language (currentColor, consistent stroke).
// Same shapes as the icon library used across the embedded project demo pages.
const PATHS: Record<string, { fill?: boolean; d: React.ReactNode }> = {
  lock: {
    d: (
      <>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        <circle cx="12" cy="15.3" r="1.1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  celebrate: {
    d: (
      <>
        <path d="m4 20 6-13 9 9z" />
        <path d="M13 4l.8 1.8M17 3l.3 2M20 6l-1.9.7M8 3l1 1.9" />
      </>
    ),
  },
};

export default function Icon({
  name,
  className = '',
}: {
  name: keyof typeof PATHS;
  className?: string;
}) {
  const icon = PATHS[name];
  const fillMode = icon.fill;
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill={fillMode ? 'currentColor' : 'none'}
      stroke={fillMode ? 'none' : 'currentColor'}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`inline-block align-[-0.125em] ${className}`}
    >
      {icon.d}
    </svg>
  );
}
