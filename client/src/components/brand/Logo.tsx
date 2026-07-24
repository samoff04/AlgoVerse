export function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="url(#algoverse-grad)" />
      <circle cx="10" cy="10" r="3" fill="white" fillOpacity="0.95" />
      <circle cx="22" cy="10" r="3" fill="white" fillOpacity="0.7" />
      <circle cx="16" cy="22" r="3" fill="white" fillOpacity="0.95" />
      <path d="M10 10L16 22M22 10L16 22M10 10L22 10" stroke="white" strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" />
      <defs>
        <linearGradient id="algoverse-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B7FE8" />
          <stop offset="1" stopColor="#5DCAA5" />
        </linearGradient>
      </defs>
    </svg>
  );
}