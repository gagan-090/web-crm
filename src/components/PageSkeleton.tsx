import React from 'react';
import useCrmTheme from '../shared/theme/useCrmTheme';
import AshokaChakra from '../shared/components/AshokaChakra';

// ── Reusable skeleton primitives ──────────────────────────────────────────────

const Sk = ({ className }: { className: string }) => (
  <div className={`bg-slate-200 rounded animate-pulse ${className}`} />
);

const ChakraLoader = () => {
  const { isTricolor } = useCrmTheme();
  return isTricolor ? (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#17376B] text-xs font-bold shrink-0">
      <AshokaChakra size={16} className="text-[#17376B] animate-spin-slow" />
      <span>Loading Data…</span>
    </div>
  ) : null;
};

// ── Page-level full skeleton (header + table rows) ─────────────────────────
export const PageTableSkeleton: React.FC<{
  rows?: number;
  cols?: number;
  title?: string;
}> = ({ rows = 8, cols = 5, title }) => (
  <main className="bg-background p-md space-y-md max-w-[1440px] mx-auto">
    {/* Breadcrumb */}
    <div className="flex items-center gap-2">
      <Sk className="h-3 w-16" />
      <Sk className="h-3 w-4" />
      <Sk className="h-3 w-24" />
    </div>

    {/* Page header */}
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        {title ? (
          <p className="text-xs font-bold text-outline uppercase tracking-wider flex items-center gap-2">
            <span>{title}</span>
            <ChakraLoader />
          </p>
        ) : (
          <Sk className="h-3 w-32" />
        )}
        <Sk className="h-6 w-64" />
      </div>
      <div className="flex gap-2">
        <Sk className="h-8 w-24 rounded-sm" />
        <Sk className="h-8 w-28 rounded-sm" />
      </div>
    </div>

    {/* Filter bar */}
    <div className="flex gap-2 flex-wrap">
      {[1, 2, 3, 4, 5].map(i => (
        <Sk key={i} className="h-8 w-28 rounded-sm" />
      ))}
    </div>

    {/* Table */}
    <div className="bg-white border border-outline-variant rounded-sm flipkart-shadow overflow-hidden">
      {/* Table header */}
      <div className="flex gap-4 px-md py-3 border-b border-outline-variant bg-surface-container-low">
        {Array.from({ length: cols }).map((_, i) => (
          <Sk key={i} className={`h-3 ${i === 0 ? 'w-16' : i === cols - 1 ? 'w-20 ml-auto' : 'flex-1'}`} />
        ))}
      </div>
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 px-md py-4 border-b border-outline-variant last:border-0">
          {Array.from({ length: cols }).map((_, i) => (
            <Sk
              key={i}
              className={`h-3 ${i === 0 ? 'w-20' : i === 1 ? 'w-12' : i === cols - 1 ? 'w-16 ml-auto' : 'flex-1'}`}
            />
          ))}
        </div>
      ))}
    </div>

    {/* Pagination */}
    <div className="flex justify-between items-center">
      <Sk className="h-3 w-32" />
      <div className="flex gap-1">
        {[1, 2, 3].map(i => <Sk key={i} className="h-7 w-7 rounded-sm" />)}
      </div>
    </div>
  </main>
);

// ── Card grid skeleton ──────────────────────────────────────────────────────
export const PageCardSkeleton: React.FC<{ cards?: number; title?: string }> = ({
  cards = 6,
  title,
}) => (
  <main className="bg-background p-md space-y-md max-w-[1440px] mx-auto">
    {/* Header */}
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        {title ? (
          <p className="text-xs font-bold text-outline uppercase tracking-wider flex items-center gap-2">
            <span>{title}</span>
            <ChakraLoader />
          </p>
        ) : (
          <Sk className="h-3 w-32" />
        )}
        <Sk className="h-6 w-56" />
      </div>
      <Sk className="h-8 w-28 rounded-sm" />
    </div>

    {/* Stat cards row */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-white border border-outline-variant rounded-sm p-md space-y-2 animate-pulse">
          <Sk className="h-3 w-20" />
          <Sk className="h-8 w-28" />
          <Sk className="h-2 w-full" />
        </div>
      ))}
    </div>

    {/* Card grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="bg-white border border-outline-variant rounded-sm p-md space-y-3 animate-pulse">
          <div className="flex justify-between">
            <Sk className="h-4 w-32" />
            <Sk className="h-5 w-16 rounded-full" />
          </div>
          <Sk className="h-3 w-full" />
          <Sk className="h-3 w-3/4" />
          <div className="flex gap-2 pt-1">
            <Sk className="h-7 flex-1 rounded-sm" />
            <Sk className="h-7 flex-1 rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  </main>
);

// ── Settings-style section skeleton ────────────────────────────────────────
export const PageSectionSkeleton: React.FC<{ sections?: number }> = ({ sections = 3 }) => (
  <main className="bg-background p-md space-y-md max-w-[1440px] mx-auto">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Sk className="h-3 w-24" />
        <Sk className="h-6 w-48" />
      </div>
      <Sk className="h-8 w-28 rounded-sm" />
    </div>

    {Array.from({ length: sections }).map((_, s) => (
      <div key={s} className="bg-white border border-outline-variant rounded-sm p-md space-y-md animate-pulse">
        <div className="flex justify-between items-center border-b border-outline-variant pb-sm">
          <Sk className="h-4 w-40" />
          <Sk className="h-6 w-20 rounded-sm" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(r => (
            <div key={r} className="flex justify-between items-center py-2 border-b border-outline-variant last:border-0">
              <div className="flex gap-3 items-center">
                <Sk className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Sk className="h-3 w-28" />
                  <Sk className="h-2 w-16" />
                </div>
              </div>
              <Sk className="h-6 w-16 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </main>
);
