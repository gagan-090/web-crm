import React, { useCallback, useEffect, useRef } from 'react';
import { useStickyState } from '../hooks/useStickyState';

/**
 * Draggable divider between two panes.
 *
 * Replaces a plain `border-r` with a border you can actually grab: press and
 * drag to resize the pane on the left, double-click to snap back to the
 * default, arrow keys to nudge once focused. The width is remembered per
 * screen for the session, so an agent who widens the job panel to read a long
 * load description keeps it that way while they work through the queue.
 *
 * Pointer events (not mouse events) so a pen or touch drag works identically,
 * and setPointerCapture keeps the drag alive when the cursor outruns the thin
 * handle — without it the resize stops the moment the pointer slips onto the
 * pane, which feels broken at anything above a slow drag.
 */
export function useResizablePane(
  storageKey: string,
  defaultWidth: number,
  min = 240,
  max = 720,
) {
  const clamp = useCallback(
    (w: number) => Math.min(max, Math.max(min, Math.round(w))),
    [min, max],
  );
  const [width, setWidth] = useStickyState<number>(storageKey, defaultWidth);

  // A width persisted before the limits changed could sit outside them.
  const safeWidth = clamp(width);

  return {
    width: safeWidth,
    setWidth: useCallback((w: number) => setWidth(clamp(w)), [clamp, setWidth]),
    reset: useCallback(() => setWidth(clamp(defaultWidth)), [clamp, defaultWidth, setWidth]),
    min,
    max,
  };
}

interface Props {
  /** Current pane width, px. */
  width: number;
  onResize: (width: number) => void;
  /** Double-click / Home key target. */
  onReset?: () => void;
  min?: number;
  max?: number;
  /** Which side of the handle the resized pane is on. */
  side?: 'left' | 'right';
  ariaLabel?: string;
}

export const ResizeHandle: React.FC<Props> = ({
  width,
  onResize,
  onReset,
  min = 240,
  max = 720,
  side = 'left',
  ariaLabel = 'Resize panel',
}) => {
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(width);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore right/middle clicks — only a primary drag resizes.
    if (e.button !== 0) return;
    draggingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    e.currentTarget.setPointerCapture(e.pointerId);
    // The cursor must stay a resize arrow over the whole window while dragging,
    // and text under the pointer must not select as it sweeps across.
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const delta = e.clientX - startXRef.current;
    onResize(startWidthRef.current + (side === 'left' ? delta : -delta));
  };

  const endDrag = (e?: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (e) {
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* already released */ }
    }
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  // A drag interrupted by an alt-tab or a thrown error must not leave the whole
  // app stuck with a col-resize cursor and text selection disabled.
  useEffect(() => () => {
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 40 : 12;
    if (e.key === 'ArrowLeft')  { onResize(width - step); e.preventDefault(); }
    if (e.key === 'ArrowRight') { onResize(width + step); e.preventDefault(); }
    if (e.key === 'Home' && onReset) { onReset(); e.preventDefault(); }
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={ariaLabel}
      aria-valuenow={width}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={onReset}
      onKeyDown={onKeyDown}
      title="Drag to resize · double-click to reset"
      // Wider than it looks: the visible line is 1px but the grab area is 5px,
      // because a 1px hit target is a game of pixel-hunting with the mouse.
      className="relative shrink-0 w-[5px] -mx-[2px] z-20 cursor-col-resize group
                 focus:outline-none touch-none"
    >
      <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gray-200
                       group-hover:bg-[#8E44AD] group-focus:bg-[#8E44AD] transition-colors" />
      {/* Grip dots, only once the pointer is near — a permanent handle would be
          visual noise on a screen that is mostly dense data. */}
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       h-8 w-[3px] rounded-full bg-[#8E44AD] opacity-0
                       group-hover:opacity-100 group-focus:opacity-100 transition-opacity" />
    </div>
  );
};

export default ResizeHandle;
