import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  useListNotesQuery,
  useLazyGetNoteQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from '../../services/api/webCrmApi';

/**
 * Notepad — a private per-agent scratchpad for every caller desk (DWC / WCT /
 * MM). A list of the agent's notes on the left, a blank editor on the right.
 * Type anything — any language, emoji, free text — and it AUTOSAVES every 15s
 * (and whenever you switch notes or leave the page). Notes are scoped to the
 * signed-in agent by the backend; nobody sees anyone else's.
 */

const AUTOSAVE_MS = 15000;

type SaveState = 'idle' | 'dirty' | 'saving' | 'saved';

const Notepad: React.FC = () => {
  const { data, refetch } = useListNotesQuery();
  const notes = data?.notes ?? [];

  const [fetchNote] = useLazyGetNoteQuery();
  const [createNote, { isLoading: creating }] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [mobileEditor, setMobileEditor] = useState(false); // small screens: list vs editor

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Latest values for the interval / unmount closures, so autosave always
  // writes what's on screen right now — not a stale snapshot.
  const live = useRef({ selectedId, title, content, saveState });
  live.current = { selectedId, title, content, saveState };

  // Persist the current note. Returns quietly if there's nothing to save.
  const save = useCallback(async (opts?: { force?: boolean }) => {
    const { selectedId: id, title: t, content: c, saveState: s } = live.current;
    if (!id) return;
    if (!opts?.force && s !== 'dirty') return;
    setSaveState('saving');
    try {
      const res = await updateNote({ id, title: t || undefined, content: c }).unwrap();
      setSavedAt(res.saved_at ?? new Date().toISOString());
      // Only fall back to 'saved' if nothing changed again while saving.
      setSaveState((prev) => (prev === 'saving' ? 'saved' : prev));
    } catch {
      setSaveState('dirty'); // keep it dirty so the next tick retries
    }
  }, [updateNote]);

  // Open a note in the editor (flushing any pending edits on the current one).
  const openNote = useCallback(async (id: number) => {
    if (live.current.selectedId && live.current.selectedId !== id) {
      await save();
    }
    try {
      const res = await fetchNote(id).unwrap();
      setSelectedId(res.note.id);
      setTitle(res.note.title ?? '');
      setContent(res.note.content ?? '');
      setSavedAt(res.note.updated_at ?? null);
      setSaveState('idle');
      setMobileEditor(true);
      setTimeout(() => textareaRef.current?.focus(), 0);
    } catch {
      /* leave current note in place on a failed load */
    }
  }, [fetchNote, save]);

  // First load — open the most recent note if there is one.
  const bootstrapped = useRef(false);
  useEffect(() => {
    if (bootstrapped.current || !data) return;
    bootstrapped.current = true;
    if (notes.length) openNote(notes[0].id);
  }, [data, notes, openNote]);

  // The 15-second autosave heartbeat.
  useEffect(() => {
    const t = setInterval(() => { void save(); }, AUTOSAVE_MS);
    return () => clearInterval(t);
  }, [save]);

  // Save on leaving the page / component (route change, tab close).
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (live.current.saveState === 'dirty') { void save({ force: true }); e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => { window.removeEventListener('beforeunload', onBeforeUnload); void save(); };
  }, [save]);

  const onNew = async () => {
    await save(); // flush current before starting a fresh one
    try {
      const res = await createNote({}).unwrap();
      refetch();
      setSelectedId(res.note.id);
      setTitle('');
      setContent('');
      setSavedAt(res.note.updated_at ?? null);
      setSaveState('idle');
      setMobileEditor(true);
      setTimeout(() => textareaRef.current?.focus(), 0);
    } catch { /* ignore */ }
  };

  const onDelete = async (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!window.confirm('Delete this note? This cannot be undone.')) return;
    try {
      await deleteNote(id).unwrap();
      const rest = notes.filter((n) => n.id !== id);
      if (selectedId === id) {
        if (rest.length) openNote(rest[0].id);
        else { setSelectedId(null); setTitle(''); setContent(''); setSaveState('idle'); setMobileEditor(false); }
      }
      refetch();
    } catch { /* ignore */ }
  };

  const markDirty = () => setSaveState('dirty');

  const statusText =
    saveState === 'saving' ? 'Saving…'
    : saveState === 'dirty' ? 'Unsaved changes'
    : savedAt ? `Saved ${new Date(savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Autosaves every 15s';

  const statusColor =
    saveState === 'saving' ? 'text-amber-600'
    : saveState === 'dirty' ? 'text-rose-600'
    : 'text-emerald-600';

  return (
    <div className="p-3 sm:p-4">
      <div
        className="flex flex-col sm:flex-row bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        style={{ height: 'calc(100vh - 130px)', minHeight: 460 }}
      >
        {/* ── Left: notes list ─────────────────────────────────────────── */}
        <aside
          className={`${mobileEditor ? 'hidden' : 'flex'} sm:flex w-full sm:w-72 shrink-0 flex-col border-b sm:border-b-0 sm:border-r border-slate-200 bg-slate-50`}
        >
          <div className="flex items-center justify-between px-3 py-3 border-b border-slate-200">
            <div className="flex items-center gap-1.5 text-slate-800 font-bold text-sm">
              <span className="material-symbols-outlined text-[18px] text-indigo-600">sticky_note_2</span>
              Notepad
            </div>
            <button
              onClick={onNew}
              disabled={creating}
              className="flex items-center gap-1 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-2 py-1 rounded-md"
            >
              <span className="material-symbols-outlined text-[14px]">add</span> New
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {notes.length === 0 ? (
              <div className="px-3 py-6 text-center text-slate-400 text-xs">
                No notes yet.<br />Tap “New” to start.
              </div>
            ) : (
              notes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => openNote(n.id)}
                  className={`group w-full text-left px-3 py-2.5 border-b border-slate-100 flex items-start gap-2 ${
                    selectedId === n.id ? 'bg-indigo-50' : 'hover:bg-white'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[16px] mt-0.5 ${selectedId === n.id ? 'text-indigo-600' : 'text-slate-400'}`}>description</span>
                  <span className="flex-1 min-w-0">
                    <span className="block truncate text-[12.5px] font-semibold text-slate-800">{n.preview}</span>
                    {n.updated_label && <span className="block text-[10px] text-slate-400 mt-0.5">{n.updated_label}</span>}
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => onDelete(n.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 shrink-0"
                    title="Delete note"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* ── Right: blank editor ──────────────────────────────────────── */}
        <section className={`${mobileEditor ? 'flex' : 'hidden'} sm:flex flex-1 flex-col min-w-0`}>
          {selectedId ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200">
                <button
                  onClick={() => { void save(); setMobileEditor(false); }}
                  className="sm:hidden text-slate-500 shrink-0"
                  title="Back to list"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
                <input
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); markDirty(); }}
                  placeholder="Title (optional)"
                  className="flex-1 min-w-0 text-sm font-bold text-slate-800 placeholder-slate-300 outline-none bg-transparent"
                />
                <span className={`text-[11px] font-semibold whitespace-nowrap ${statusColor}`}>{statusText}</span>
                <button
                  onClick={() => save({ force: true })}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-md px-2 py-1"
                  title="Save now"
                >
                  Save
                </button>
              </div>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => { setContent(e.target.value); markDirty(); }}
                placeholder="Start typing… write anything — any language, emoji 📝"
                dir="auto"
                className="flex-1 w-full resize-none outline-none px-4 py-3 text-[14px] leading-relaxed text-slate-800 placeholder-slate-300 font-sans"
                spellCheck={false}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
              <span className="material-symbols-outlined text-6xl mb-2">edit_note</span>
              <p className="text-sm font-semibold text-slate-400">Select a note, or tap “New” to start writing.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Notepad;
