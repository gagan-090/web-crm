import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * ============================================================================
 * useResizablePane — a draggable divider between two panes
 * ============================================================================
 *
 * The queue screens are a fixed 380px list beside the lead profile. That width
 * is a compromise nobody actually wants: an agent scanning names wants the list
 * wider, an agent reading a profile wants it narrower, and the right answer
 * changes several times a shift. This lets them set it themselves.
 *
 * WIDTH IS PERSISTED PER DESK. The DW, MM and WCT queues share one component
 * but are different jobs — a matchmaking agent works the profile, a welcome
 * caller works the list — so each desk remembers its own split rather than one
 * global number that the desks fight over.
 *
 * DRAGGING USES POINTER CAPTURE, not window listeners. The pointer moves faster
 * than React re-renders, and without capture it leaves the handle mid-drag: the
 * divider stops following and the agent has to grab it again. Capture routes
 * every move to the handle until release, whatever it passes over.
 *
 * The width is written straight to the DOM node during the drag and only
 * committed to React state on release. Re-rendering a 1,400-line queue on every
 * pointermove is what makes a resize feel like it is fighting back.
 */
export interface ResizablePaneOptions {
  /** Namespaces the stored width, so each desk keeps its own. */
  storageKey: string;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export const useResizablePane = ({
  storageKey,
  defaultWidth = 380,
  minWidth = 260,
  // Capped so the divider can never be dragged far enough to leave the profile
  // pane unusable — an agent who does that has to reset it to recover.
  maxWidth = 720,
}: ResizablePaneOptions) => {
  const paneRef = useRef<HTMLElement | null>(null);
  const dragging = useRef(false);

  const read = (): number => {
    try {
      const v = Number(localStorage.getItem(`pane_w_${storageKey}`));
      return Number.isFinite(v) && v >= minWidth && v <= maxWidth ? v : defaultWidth;
    } catch {
      return defaultWidth;
    }
  };

  const [width, setWidth] = useState<number>(read);

  const clamp = useCallback(
    (n: number) => Math.min(maxWidth, Math.max(minWidth, n)),
    [minWidth, maxWidth]
  );

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    // Text selection would otherwise highlight the whole queue while dragging —
    // and this app force-enables user-select globally, so it must be suppressed
    // explicitly here rather than relying on a class.
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !paneRef.current) return;
    // Measured from the pane's own left edge, so the divider tracks the pointer
    // exactly regardless of sidebar width or page scroll.
    const left = paneRef.current.getBoundingClientRect().left;
    const next = clamp(e.clientX - left);
    paneRef.current.style.width = `${next}px`;
  }, [clamp]);

  const commit = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* already released */ }
    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    const next = clamp(paneRef.current?.getBoundingClientRect().width ?? width);
    setWidth(next);
    try { localStorage.setItem(`pane_w_${storageKey}`, String(next)); } catch { /* storage off */ }
  }, [clamp, storageKey, width]);

  /** Double-click the divider to go back to the default. */
  const reset = useCallback(() => {
    setWidth(defaultWidth);
    if (paneRef.current) paneRef.current.style.width = `${defaultWidth}px`;
    try { localStorage.setItem(`pane_w_${storageKey}`, String(defaultWidth)); } catch { /* storage off */ }
  }, [defaultWidth, storageKey]);

  /** Keyboard resize — the divider is focusable, so this must work too. */
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 40 : 12;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const next = clamp(width + (e.key === 'ArrowRight' ? step : -step));
    setWidth(next);
    if (paneRef.current) paneRef.current.style.width = `${next}px`;
    try { localStorage.setItem(`pane_w_${storageKey}`, String(next)); } catch { /* storage off */ }
  }, [clamp, storageKey, width]);

  // A stored width from a wider monitor can exceed this one — clamp on mount so
  // the profile pane is never squeezed off screen after switching displays.
  useEffect(() => {
    const fit = () => {
      const max = Math.min(maxWidth, window.innerWidth - 420);
      if (width > max) {
        const next = Math.max(minWidth, max);
        setWidth(next);
        if (paneRef.current) paneRef.current.style.width = `${next}px`;
      }
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [width, maxWidth, minWidth]);

  return {
    paneRef,
    width,
    /** Spread onto the pane: fixed width, never flex-shrunk. */
    paneProps: { style: { width: `${width}px`, flexShrink: 0 } as React.CSSProperties },
    /** Spread onto the divider element. */
    handleProps: {
      role: 'separator' as const,
      'aria-orientation': 'vertical' as const,
      'aria-label': 'Resize queue list',
      tabIndex: 0,
      onPointerDown,
      onPointerMove,
      onPointerUp: commit,
      onPointerCancel: commit,
      onDoubleClick: reset,
      onKeyDown,
      title: 'Drag to resize · double-click to reset',
    },
    reset,
  };
};

export default useResizablePane;
