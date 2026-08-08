import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Fades each screen in on navigation, for every role.
 *
 * The `key` is what does the work: changing it on pathname remounts the subtree,
 * which restarts the CSS entrance animation. Without it React reuses the DOM and
 * the animation only ever plays once, on the first screen of the session.
 *
 * Search/query changes deliberately do NOT re-key — re-animating the whole page
 * every time an agent types in a filter would be nauseating.
 *
 * Motion itself is defined in styles/motion.css and stops entirely under
 * prefers-reduced-motion.
 */
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="tm-page-enter">
      {children}
    </div>
  );
};

export default PageTransition;
