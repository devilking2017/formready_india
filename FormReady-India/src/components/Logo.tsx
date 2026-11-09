export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="FormReady India logo">
      <rect width="64" height="64" rx="14" fill="#0b2a5b" />
      <path d="M19 12h19l9 9v31a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3z" fill="#ffffff" />
      <path d="M38 12v9h9z" fill="#bcd2ff" />
      <path
        d="M23 39l6 6 12-13"
        fill="none"
        stroke="#2563eb"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
