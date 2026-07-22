import React from 'react';
import DwCallQueue from '../driver-welcome/DwCallQueue';

// ── Matchmaking · My Queue ──────────────────────────────────────────────────
//
// Deliberately the SAME component the Driver Welcome and Transporter Welcome
// desks use, not a copy. All three desks work the identical queue — the leads
// assigned to the signed-in agent — and every queue endpoint already filters
// `assigned_to = caller + role`, so a matchmaking agent sees their own leads
// with no backend change at all.
//
// Forking the 1,100-line queue would have guaranteed drift: a fix to callbacks,
// recordings or the disposition flow on one desk would silently miss the
// others. Reusing it means "exactly the same features" stays true over time.
//
// Matchmaking works both sides of a match, so the toggle opens on Driver; from
// there the agent can flip to any lead role assigned to them — transporter,
// association, foreman, puncture shop or dhaba. The remembered tab and role are
// namespaced to `mm` so they do not fight with the other desks' saved state.
//
// globalSearchAllRoles: matchmaking callers reach across the WHOLE user base,
// so their global search finds any user of any role (assigned to them or not),
// opens the full profile + call timeline, and can dial them directly.
const MmCallQueue: React.FC = () => (
  <DwCallQueue deskKey="mm" defaultLeadRole="driver" globalSearchAllRoles />
);

export default MmCallQueue;
