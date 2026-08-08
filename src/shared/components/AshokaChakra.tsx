import React from 'react';

interface AshokaChakraProps {
  /** Rendered width/height in px. */
  size?: number;
  /** Stroke colour — chakra navy by default. */
  color?: string;
  className?: string;
}

/**
 * The Ashoka Chakra, drawn as 24 spokes rather than shipped as an image so it
 * stays crisp at 12px in the sidebar and at 40px on the login screen, costs no
 * network request, and can take any colour the surface needs.
 *
 * Purely decorative — hidden from assistive tech.
 */
export const AshokaChakra: React.FC<AshokaChakraProps> = ({ size = 16, color = '#17376B', className = '' }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="5" />
    {Array.from({ length: 24 }).map((_, i) => (
      <line
        key={i}
        x1="50"
        y1="10"
        x2="50"
        y2="50"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        transform={`rotate(${i * 15} 50 50)`}
      />
    ))}
    <circle cx="50" cy="50" r="8" fill={color} />
  </svg>
);

export default AshokaChakra;
