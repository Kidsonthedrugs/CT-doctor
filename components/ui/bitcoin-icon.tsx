export function Bitcoin({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 8h4a2 2 0 1 1 0 4H9" />
      <path d="M9 12h5a2 2 0 1 1 0 4H9" />
      <path d="M9 7v10" />
      <path d="M11 6v1" />
      <path d="M11 17v1" />
      <path d="M13 6v1" />
      <path d="M13 17v1" />
    </svg>
  )
}
