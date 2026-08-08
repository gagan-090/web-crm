import React from 'react';

/**
 * Dashboard-only corner decoration: a gold firework low in the left rail and a
 * tricolor silk wave off the bottom-right corner.
 *
 * Drawn rather than imaged. The PNG versions were 1024×1024 renders (~1.2MB for
 * the pair) that had to be held at low opacity to stop them competing with the
 * data — which is exactly the case for line work and gradients instead. This
 * also means the decoration scales with the viewport and never shows a hard
 * matte edge behind the transparent areas.
 *
 * Both pieces are pointer-events-none and sit at z-0 behind the content, so
 * nothing here can ever intercept a click on a tile or a button.
 */
export const FestiveCorners: React.FC = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none" aria-hidden="true">
    {/* Firework — low in the left rail, where the sidebar has empty space */}
    <svg className="absolute bottom-28 left-3 w-36 h-36 opacity-[0.22] tm-twinkle" viewBox="0 0 120 120" fill="none">
      <g stroke="#B8860B" strokeLinecap="round">
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i * 15 * Math.PI) / 180;
          const inner = 8;
          const outer = i % 2 === 0 ? 46 : 32;
          return (
            <line
              key={i}
              x1={60 + Math.cos(a) * inner}
              y1={60 + Math.sin(a) * inner}
              x2={60 + Math.cos(a) * outer}
              y2={60 + Math.sin(a) * outer}
              strokeWidth={i % 2 === 0 ? 1.1 : 0.7}
              strokeDasharray={i % 2 === 0 ? '0' : '2 3'}
            />
          );
        })}
        {/* spark tips */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return <circle key={i} cx={60 + Math.cos(a) * 50} cy={60 + Math.sin(a) * 50} r="1.1" fill="#FF9933" stroke="none" />;
        })}
      </g>
      <circle cx="60" cy="60" r="3" fill="#B8860B" />
    </svg>

    {/* Tricolor silk, furling out of the bottom-right corner */}
    <svg
      className="absolute -bottom-6 -right-4 w-[420px] h-[300px] opacity-[0.30]"
      viewBox="0 0 420 300"
      fill="none"
      preserveAspectRatio="xMaxYMax meet"
    >
      <defs>
        <linearGradient id="tm-silk-saffron" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF9933" stopOpacity="0" />
          <stop offset="45%" stopColor="#FF9933" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#E2761B" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="tm-silk-white" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F3EFE6" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="tm-silk-green" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#138808" stopOpacity="0" />
          <stop offset="45%" stopColor="#138808" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0E6B06" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* three furling bands, each offset so they read as one length of silk */}
      <path
        d="M60 300 C 150 250, 190 170, 300 140 C 360 124, 400 104, 420 74 L420 132 C 392 158, 350 172, 300 190 C 210 222, 160 262, 132 300 Z"
        fill="url(#tm-silk-saffron)"
      />
      <path
        d="M132 300 C 160 262, 210 222, 300 190 C 350 172, 392 158, 420 132 L420 186 C 396 208, 356 220, 306 238 C 232 264, 190 280, 172 300 Z"
        fill="url(#tm-silk-white)"
      />
      <path
        d="M172 300 C 190 280, 232 264, 306 238 C 356 220, 396 208, 420 186 L420 246 C 398 262, 362 272, 320 284 C 282 294, 250 298, 232 300 Z"
        fill="url(#tm-silk-green)"
      />
    </svg>
  </div>
);

export default FestiveCorners;
