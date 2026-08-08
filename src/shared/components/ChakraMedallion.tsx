import React from 'react';

/**
 * The Ashoka Chakra struck as a coin: engraved gold rings, navy spokes, ivory
 * face. Used wherever the CRM needs an emblem — dashboard banner, sidebar,
 * login — so the festive identity is one drawn mark rather than a set of
 * glossy 3D renders that look pasted on and blur when scaled.
 */
export const ChakraMedallion: React.FC<{ size?: number; className?: string }> = ({ size = 60, className = '' }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    aria-hidden="true"
    focusable="false"
    className={`shrink-0 ${className}`}
  >
    <defs>
      <linearGradient id={`tm-medal-face-${size}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFDF8" />
        <stop offset="100%" stopColor="#F4ECDC" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill={`url(#tm-medal-face-${size})`} stroke="#B8860B" strokeWidth="1.2" />
    <circle cx="50" cy="50" r="43" fill="none" stroke="#B8860B" strokeWidth="0.5" opacity="0.55" />
    <circle cx="50" cy="50" r="33" fill="none" stroke="#17376B" strokeWidth="1.6" />
    {Array.from({ length: 24 }).map((_, i) => (
      <line
        key={i}
        x1="50"
        y1="19"
        x2="50"
        y2="50"
        stroke="#17376B"
        strokeWidth="1.1"
        strokeLinecap="round"
        transform={`rotate(${i * 15} 50 50)`}
      />
    ))}
    <circle cx="50" cy="50" r="5" fill="#17376B" />
  </svg>
);

export default ChakraMedallion;
