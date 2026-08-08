import React from 'react';
import useCrmTheme from '../../theme/useCrmTheme';
import bannerArt from '../../../assets/theme/independence_banner.jpg';

interface DashboardHeroProps {
  /** e.g. "Driver Welcome Operations Dashboard" */
  title: string;
  /** One line on what this desk is responsible for. */
  subtitle: string;
  /** Small caps line above the title — usually the process name. */
  eyebrow?: string;
  className?: string;
}

/**
 * The banner every role's dashboard opens with.
 *
 * The artwork is one wide image, cropped to 6.5:1 and served at 1600px / ~94KB
 * (the source was 2216×709 and 1.6MB — too heavy to load on ten dashboards).
 * Because the container carries the image's own aspect ratio, nothing is ever
 * cropped at any window width, so the composition the art was drawn with holds:
 *
 *   0–28%   chakra and saffron silk      → left alone
 *   28–56%  pale sunburst                → THE COPY GOES HERE
 *   56–100% India Gate, Taj, fireworks   → left alone
 *
 * The copy is positioned in percentages for that reason: it tracks the artwork
 * as the window resizes instead of drifting across the monuments. A soft white
 * scrim sits under the text so the title holds contrast over the sunburst rays.
 */
export const DashboardHero: React.FC<DashboardHeroProps> = ({ title, subtitle, eyebrow, className = '' }) => {
  const { isTricolor: IS_TRICOLOR_THEME, bannerPill, bannerTagline } = useCrmTheme();
  if (!IS_TRICOLOR_THEME) {
    return (
      <div className={`relative overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-tile animate-fade-in-down ${className}`}>
        <div className="h-1 w-full bg-gradient-to-r from-primary via-primary-container to-primary" />
        <div className="p-4 sm:p-5">
          {eyebrow && <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary mb-1">{eyebrow}</p>}
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-on-surface">{title}</h2>
          <p className="text-xs font-semibold text-gray-500 mt-0.5 max-w-2xl">{subtitle}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-[#B8860B]/25 bg-white shadow-tile hover:shadow-tile-hover transition-shadow duration-300 animate-fade-in-down ${className}`}
    >
      <img
        src={bannerArt}
        alt=""
        aria-hidden="true"
        className="block w-full h-auto select-none pointer-events-none"
      />

      {/* Legibility scrim — only under the copy, fading out before the monuments */}
      <div className="absolute inset-y-0 left-[24%] right-[36%] bg-gradient-to-r from-white/45 via-white/75 to-white/0 pointer-events-none" />

      <div className="absolute inset-y-0 left-[28%] right-[31%] flex flex-col justify-center gap-[0.35em]">
        <div className="flex items-center gap-2 flex-wrap leading-none">
          <span
            className="px-2 py-[2px] rounded-full font-bold tracking-[0.1em] uppercase text-[#0B3D91] bg-white/85 border border-[#B8860B]/45 font-hindi whitespace-nowrap"
            style={{ fontSize: 'clamp(7px, 0.62vw, 10px)' }}
          >
            {bannerPill}
          </span>
          <span
            className="font-bold text-[#B8860B] font-hindi whitespace-nowrap hidden md:inline"
            style={{ fontSize: 'clamp(7px, 0.62vw, 10.5px)' }}
          >
            {bannerTagline}
          </span>
        </div>

        {eyebrow && (
          <p
            className="font-black uppercase tracking-[0.2em] text-[#8F6A08] leading-none truncate"
            style={{ fontSize: 'clamp(6.5px, 0.58vw, 9.5px)' }}
          >
            {eyebrow}
          </p>
        )}

        <h2
          className="font-black tracking-tight text-[#0B3D91] leading-[1.15] drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]"
          style={{ fontSize: 'clamp(12px, 1.32vw, 21px)' }}
        >
          {title}
        </h2>

        <p
          className="font-semibold text-slate-700 leading-tight hidden sm:block drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)]"
          style={{ fontSize: 'clamp(8px, 0.72vw, 12px)' }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default DashboardHero;
