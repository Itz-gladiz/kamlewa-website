import React from 'react';

interface UKFlagProps {
  className?: string;
}

export default function UKFlag({ className = 'w-5 h-5' }: UKFlagProps) {
  return (
    <svg
      viewBox="0 0 60 30"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="UK flag"
    >
      <rect width="60" height="30" fill="#012169" />
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#C8102E" strokeWidth="4" />
      <rect x="25" y="0" width="10" height="30" fill="#fff" />
      <rect x="27.5" y="0" width="5" height="30" fill="#C8102E" />
      <rect x="0" y="10" width="60" height="10" fill="#fff" />
      <rect x="0" y="11.5" width="60" height="7" fill="#C8102E" />
    </svg>
  );
}
