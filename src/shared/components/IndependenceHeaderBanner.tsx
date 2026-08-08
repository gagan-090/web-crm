import React from 'react';
import DashboardHero from './dashboard/DashboardHero';

interface IndependenceHeaderBannerProps {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
}

/**
 * Kept as the name six dashboards already import. The banner itself now lives in
 * DashboardHero, which is drawn in SVG rather than assembled from 3D PNGs and
 * which also renders a clean non-festive version — so this component no longer
 * disappears when the theme is switched back to 'default'.
 */
export const IndependenceHeaderBanner: React.FC<IndependenceHeaderBannerProps> = ({
  title = 'Operations Dashboard',
  subtitle = 'Live desk performance across the TruckMitr network.',
  eyebrow,
  className = '',
}) => <DashboardHero title={title} subtitle={subtitle} eyebrow={eyebrow} className={className} />;

export default IndependenceHeaderBanner;
