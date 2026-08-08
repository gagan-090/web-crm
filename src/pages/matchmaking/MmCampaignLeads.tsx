import React from 'react';
import DwCampaignLeads from '../driver-welcome/DwCampaignLeads';

// ── Matchmaking · Campaign Leads ─────────────────────────────────────────────
//
// Deliberately the SAME screen the Driver Welcome desk uses (not a copy), so the
// campaign-leads UI and calling flow stay pixel-identical. The leads endpoint is
// caller-scoped — a matchmaking agent sees the campaign leads assigned to them —
// and desk="mm" routes the Call button to the MM active-call screen.
const MmCampaignLeads: React.FC = () => <DwCampaignLeads desk="mm" />;

export default MmCampaignLeads;
