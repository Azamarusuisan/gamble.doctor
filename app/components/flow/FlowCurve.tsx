"use client";

export function FlowCurve() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
      viewBox="0 0 1200 400"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 0,200 Q 300,100 600,200 T 1200,200"
        stroke="url(#gradient)"
        strokeWidth="3"
        fill="none"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  );
}