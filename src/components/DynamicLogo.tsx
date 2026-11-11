import React from 'react'

interface LogoProps {
  className?: string
  size?: number
  showText?: boolean
}

export const DynamicLogo: React.FC<LogoProps> = ({
  className = '',
  size = 32,
  showText = true,
}) => {
  return (
    <div className={`ds-brand-logo ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ds-logo-svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ds-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="ds-fill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Outer Kinetic Diamond Frame */}
        <rect
          x="20"
          y="4"
          width="22.6"
          height="22.6"
          rx="4"
          transform="rotate(45 20 4)"
          fill="url(#ds-fill)"
          stroke="url(#ds-glow)"
          strokeWidth="2"
        />

        {/* Inner dynamic aperture stroke */}
        <path
          d="M13 15L20 9L27 15L20 21L13 15Z"
          fill="none"
          stroke="#818cf8"
          strokeWidth="1.5"
          strokeOpacity="0.7"
        />

        {/* DS Geometric Monogram */}
        <path
          d="M14 26V21C14 19.8954 14.8954 19 16 19H19C20.6569 19 22 20.3431 22 22C22 23.6569 20.6569 25 19 25H14M14 22H21"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26 21C26 20.2 25.4 19 23.8 19C22.2 19 21.5 20 21.5 21C21.5 22.8 26 22.5 26 24.5C26 25.8 24.8 26.5 23.5 26.5C22 26.5 21.2 25.5 21.2 24.5"
          stroke="url(#ds-glow)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <div className="ds-brand-titles">
          <span className="ds-brand-name">Dynamic Sites</span>
          <span className="ds-brand-badge">Resource Hub</span>
        </div>
      )}
    </div>
  )
}
