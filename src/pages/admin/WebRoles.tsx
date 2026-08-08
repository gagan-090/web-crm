import React, { useMemo, useState } from 'react';
import { useGetWebRolesQuery, useUpdateWebRoleMutation, type WebRoleTelecaller } from '../../services/api/webCrmApi';

// ── Web CRM Role Management ───────────────────────────────────────────────────
// Route: /crm/web-roles
// Lists every Web CRM admin (telecaller) with their current role and lets an
// operator switch a telecaller's role directly (web_crm_admins.role) via a
// dropdown. Backed by GET/POST /web-crm/web-roles.

const roleBadge = (role: string) => {
  switch (role) {
    case 'System Admin': return 'bg-gray-800 text-white border-gray-800';
    case 'Telecalling Head': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Team Leader': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case 'Driver Welcome': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Transporter Welcome': return 'bg-teal-100 text-teal-700 border-teal-200';
    case 'Matchmaking': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'Special Categories': return 'bg-pink-100 text-pink-700 border-pink-200';
    case 'QC Analyst': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'HR Executive': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

const RoleRow: React.FC<{
  tc: WebRoleTelecaller;
  roles: string[];
  onSaved: (msg: string) => void;
  onError: (msg: string) => void;
}> = ({ tc, roles, onSaved, onError }) => {
  const [selected, setSelected] = useState(tc.role);
  const [updateWebRole, { isLoading }] = useUpdateWebRoleMutation();

  // Keep the dropdown in sync if the row's role changes underneath us (refetch).
  React.useEffect(() => { setSelected(tc.role); }, [tc.role]);

  const dirty = selected !== tc.role;

  const save = async () => {
    try {
      const res = await updateWebRole({ admin_id: tc.id, role: selected }).unwrap();
      onSaved(res?.message || `Role updated for ${tc.name}.`);
    } catch (e: any) {
      onError(e?.data?.message || e?.data?.errors?.role?.[0] || 'Failed to update role.');
      setSelected(tc.role); // revert selection on failure
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/60">
      <td className="py-2.5 px-4">
        <div className="font-bold text-gray-850">{tc.name}</div>
        <div className="text-[10px] text-gray-400">{tc.email}{tc.mobile ? ` · ${tc.mobile}` : ''}</div>
      </td>
      <td className="py-2.5 px-4">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadge(tc.role)}`}>
          {tc.role || '—'}
        </span>
      </td>
      <td className="py-2.5 px-4">
        <div className="flex items-center gap-2">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            disabled={isLoading}
            className="border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white outline-none font-semibold text-gray-700 text-[11px] focus:ring-1 focus:ring-[#8E44AD] min-w-[180px]"
          >
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button
            onClick={save}
            disabled={!dirty || isLoading}
            className="px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-[#8E44AD] text-white hover:bg-[#7D3C98]"
          >
            {isLoading ? 'Saving…' : 'Save'}
          </button>
        </div>
      </td>
      <td className="py-2.5 px-4">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tc.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {tc.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>
    </tr>
  );
};

export const WebRoles: React.FC = () => {
  const { data, isLoading, isError, refetch } = useGetWebRolesQuery();
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ msg: string; kind: 'ok' | 'err' } | null>(null);

  const flash = (msg: string, kind: 'ok' | 'err') => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 3500);
  };

  const telecallers = data?.data?.telecallers ?? [];
  const roles = data?.data?.roles ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return telecallers;
    return telecallers.filter((t) =>
      t.name?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q) ||
      t.role?.toLowerCase().includes(q)
    );
  }, [telecallers, search]);

  return (
    <main className="flex flex-col h-screen bg-gray-50 overflow-hidden text-xs">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 text-white text-xs px-4 py-2 rounded-lg shadow-lg ${toast.kind === 'ok' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="px-5 py-3 bg-white border-b border-gray-200 shrink-0 flex items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide">Web CRM Role Management</h1>
          <p className="text-[10px] text-gray-400">Change a telecaller's role directly. Updates take effect on their next login.</p>
        </div>
        <div className="relative ml-auto">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email or role…"
            className="w-72 pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#8E44AD] bg-white"
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => <div key={i} className="h-14 bg-white rounded-xl border border-gray-200 animate-pulse" />)}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="material-symbols-outlined text-5xl mb-3 text-red-300">error</span>
            <p className="font-semibold text-sm">Could not load telecallers</p>
            <button onClick={() => refetch()} className="mt-4 px-6 py-2 bg-white border border-[#8E44AD] text-[#8E44AD] rounded-xl font-bold hover:bg-purple-50 text-xs">Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="material-symbols-outlined text-5xl mb-3">group_off</span>
            <p className="font-semibold text-sm">No telecallers found</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="border-b border-gray-200">
                  <th className="py-2.5 px-4 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Telecaller</th>
                  <th className="py-2.5 px-4 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Current Role</th>
                  <th className="py-2.5 px-4 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Change Role</th>
                  <th className="py-2.5 px-4 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tc) => (
                  <RoleRow
                    key={tc.id}
                    tc={tc}
                    roles={roles}
                    onSaved={(m) => flash(m, 'ok')}
                    onError={(m) => flash(m, 'err')}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!isLoading && !isError && (
          <p className="text-center text-[10px] text-gray-400 mt-3">
            {filtered.length} telecaller{filtered.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </main>
  );
};

export default WebRoles;
