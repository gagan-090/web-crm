import React, { useEffect, useMemo, useState } from 'react';
import { useGetTeleuiDataQuery } from '../../services/api/webCrmApi';

/**
 * Team-Leader command wall-board — public (no auth) React page at /crm/teleui.
 * Pulls the live feed from /api/web-crm/teleui/data (via config.ts base) every
 * 5s. Self-contained dark theme scoped under .teleui-root so it never collides
 * with the CRM's own styles, and every panel scrolls on its own.
 */

type Range = 'all' | 'today';
type AgentFilter = 'all' | 'active' | 'low' | 'short';

interface Agent { name: string; num: string; status: string; calls: number; ans: number; short: number; lastCall: string; lastDuration: number; }
interface QueueRow { num: string; agent: string; tries: number; lastTry: string; window: string; priority: string; }
interface AlertRow { type: string; icon: string; msg: string; time: string; }
interface RevRow { label: string; val: number; max: number; color: string; }
interface Kpis { total: number; connected: number; short: number; queue: number; unique_customers: number; revenue_calls: number; conn_rate: number; alerts: number; }
interface TeleData { range: string; agents: Agent[]; kpis: Kpis; callsToday: number; heatmap: number[][]; queue: QueueRow[]; revenue: RevRow[]; alerts: AlertRow[]; }

const HOURS = ['8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CW = [
  { h: '8', type: 'avoid' }, { h: '9', type: 'avoid' }, { h: '10', type: 'ok' }, { h: '11', type: 'good' },
  { h: '12', type: 'good' }, { h: '13', type: 'ok' }, { h: '14', type: 'good' }, { h: '15', type: 'good' },
  { h: '16', type: 'ok' }, { h: '17', type: 'good' }, { h: '18', type: 'ok' }, { h: '19', type: 'avoid' }, { h: '20', type: 'avoid' },
];

const connRate = (a: Agent) => (a.calls > 0 ? a.ans / a.calls : 0);
const rateColor = (r: number) => (r >= 0.5 ? 'var(--tl-green)' : r >= 0.38 ? 'var(--tl-amber)' : 'var(--tl-red)');
const heatColor = (v: number) =>
  v >= 0.53 ? '#1f6b3a' : v >= 0.46 ? '#2f9e4f' : v >= 0.40 ? '#b9821c' : v >= 0.34 ? '#c76a1a' : '#7c2d2d';
const cwColor = (t: string) => (t === 'good' ? 'var(--tl-green)' : t === 'ok' ? 'var(--tl-amber)' : 'var(--tl-red)');
const nfmt = (n: number | null | undefined) => (n == null ? '—' : Number(n).toLocaleString('en-IN'));

const CSS = `
.teleui-root { --tl-bg:#0D1117; --tl-surf:#161B22; --tl-raised:#1C2128; --tl-border:#30363D;
  --tl-txt:#E6EDF3; --tl-muted:#8B949E; --tl-orange:#D94F0A; --tl-orange-s:#FF6B2B;
  --tl-green:#3FB950; --tl-amber:#D29922; --tl-red:#F85149; --tl-blue:#58A6FF;
  --tl-red-bg:rgba(248,81,73,.12);
  position:fixed; inset:0; display:flex; flex-direction:column; background:var(--tl-bg);
  color:var(--tl-txt); font-family:'Inter',system-ui,sans-serif; font-size:13px; line-height:1.5; overflow:hidden; }
.teleui-root *, .teleui-root *::before, .teleui-root *::after { box-sizing:border-box; }
.tl-topbar { display:flex; align-items:center; gap:14px; padding:0 18px; height:52px; flex-shrink:0;
  background:var(--tl-surf); border-bottom:1px solid var(--tl-border); }
.tl-logo { display:flex; align-items:center; gap:10px; }
.tl-mark { width:32px; height:32px; background:var(--tl-orange); border-radius:8px; display:grid; place-items:center; font-size:16px; font-weight:800; color:#fff; }
.tl-logo-text { font-weight:700; font-size:15px; } .tl-logo-sub { font-size:11px; color:var(--tl-muted); text-transform:uppercase; letter-spacing:.5px; }
.tl-sep { width:1px; height:24px; background:var(--tl-border); }
.tl-kpi { display:flex; align-items:center; gap:6px; padding:4px 12px; border-radius:6px; background:var(--tl-raised); border:1px solid var(--tl-border); }
.tl-kpi .v { font-weight:700; font-size:14px; font-variant-numeric:tabular-nums; }
.tl-kpi .l { color:var(--tl-muted); font-size:11px; }
.tl-kpi.g .v { color:var(--tl-green); } .tl-kpi.o .v { color:var(--tl-orange-s); } .tl-kpi.r .v { color:var(--tl-red); }
.tl-spacer { flex:1; }
.tl-clock { font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--tl-muted); }
.tl-rt { display:flex; gap:2px; background:var(--tl-raised); border:1px solid var(--tl-border); border-radius:6px; padding:2px; }
.tl-rt button { background:transparent; border:0; color:var(--tl-muted); font:700 11px inherit; padding:3px 11px; border-radius:4px; cursor:pointer; }
.tl-rt button.on { background:var(--tl-orange); color:#fff; }
.tl-alert-badge { display:flex; align-items:center; gap:6px; background:var(--tl-red-bg); border:1px solid rgba(248,81,73,.3); color:var(--tl-red); border-radius:6px; padding:4px 10px; font-size:12px; font-weight:600; }
.tl-alert-badge .dot { width:6px; height:6px; background:var(--tl-red); border-radius:50%; }

.tl-err { background:var(--tl-red-bg); color:var(--tl-red); border-bottom:1px solid rgba(248,81,73,.4); padding:8px 16px; font-size:12px; font-weight:700; text-align:center; flex-shrink:0; }

.tl-layout { flex:1; display:grid; grid-template-columns:300px 1fr 280px; grid-template-rows:auto 1fr;
  gap:1px; background:var(--tl-border); min-height:0; overflow:hidden; }
.tl-strip { grid-column:1 / -1; display:flex; gap:1px; background:var(--tl-border); overflow-x:auto; }
.tl-tile { flex:1; min-width:150px; background:var(--tl-surf); padding:12px 16px; position:relative; overflow:hidden; }
.tl-tile::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:var(--c,var(--tl-blue)); }
.tl-tile .lab { font-size:11px; color:var(--tl-muted); }
.tl-tile .val { font-size:26px; font-weight:800; font-variant-numeric:tabular-nums; margin:2px 0; line-height:1; color:var(--c,var(--tl-blue)); }
.tl-tile .sub { font-size:11px; color:var(--tl-muted); }
.tl-panel { background:var(--tl-bg); overflow-y:auto; padding:14px; min-height:0; }
.tl-phead { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.tl-ptitle { font-weight:700; font-size:12px; text-transform:uppercase; letter-spacing:.7px; color:var(--tl-muted); }

.tl-filters { display:flex; gap:6px; margin-bottom:10px; flex-wrap:wrap; }
.tl-fbtn { padding:3px 10px; border-radius:20px; font:600 11px inherit; border:1px solid var(--tl-border); background:var(--tl-raised); cursor:pointer; color:var(--tl-muted); }
.tl-fbtn.on { background:rgba(217,79,10,.15); border-color:var(--tl-orange); color:var(--tl-orange-s); }
.tl-card { background:var(--tl-surf); border:1px solid var(--tl-border); border-radius:8px; padding:11px 13px; margin-bottom:8px; }
.tl-atop { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.tl-sdot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.tl-sdot.active { background:var(--tl-green); box-shadow:0 0 0 2px rgba(63,185,80,.25); }
.tl-sdot.idle { background:var(--tl-amber); } .tl-sdot.break { background:var(--tl-muted); } .tl-sdot.offline { background:var(--tl-red); }
.tl-aname { font-weight:600; font-size:13px; flex:1; } .tl-astat { font-size:10px; color:var(--tl-muted); }
.tl-ametrics { display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; }
.tl-mi { text-align:center; } .tl-mv { font-size:15px; font-weight:700; font-variant-numeric:tabular-nums; } .tl-ml { font-size:9px; color:var(--tl-muted); text-transform:uppercase; }
.tl-ratebar { margin-top:8px; height:4px; background:var(--tl-raised); border-radius:2px; overflow:hidden; }
.tl-ratefill { height:100%; border-radius:2px; }
.tl-flag { display:inline-block; margin-top:8px; font-size:9px; font-weight:700; padding:2px 7px; border-radius:10px; }
.tl-flag.bad { background:rgba(210,153,34,.15); color:var(--tl-amber); } .tl-flag.ok { background:rgba(63,185,80,.12); color:var(--tl-green); }

.tl-hmgrid { display:grid; grid-template-columns:44px repeat(12,1fr); gap:3px; }
.tl-hc { font-size:10px; font-weight:700; color:#fff; border-radius:4px; padding:8px 2px; text-align:center; font-variant-numeric:tabular-nums; }
.tl-hc.hdr { background:transparent; color:var(--tl-muted); } .tl-hc.rl { background:transparent; color:var(--tl-muted); text-align:right; padding-right:6px; }
.tl-legend { display:flex; gap:10px; margin-top:8px; font-size:10px; color:var(--tl-muted); flex-wrap:wrap; }
.tl-legend i { width:10px; height:10px; border-radius:2px; display:inline-block; margin-right:4px; }

.tl-qrow { display:flex; align-items:center; gap:10px; background:var(--tl-surf); border:1px solid var(--tl-border); border-left:3px solid var(--tl-muted); border-radius:8px; padding:9px 11px; margin-bottom:7px; font-size:11px; }
.tl-qrow.high { border-left-color:var(--tl-red); } .tl-qrow.medium { border-left-color:var(--tl-amber); } .tl-qrow.low { border-left-color:var(--tl-blue); }
.tl-qnum { font-weight:700; font-family:'JetBrains Mono',monospace; }
.tl-qmeta { font-size:10px; color:var(--tl-muted); }
.tl-btn { background:var(--tl-orange); color:#fff; border:0; border-radius:6px; padding:4px 10px; font:700 10px inherit; cursor:pointer; }
.tl-btn.ghost { background:var(--tl-raised); border:1px solid var(--tl-border); color:var(--tl-txt); }

.tl-cw { display:flex; gap:3px; flex-wrap:wrap; }
.tl-cwc { width:22px; height:22px; border-radius:4px; display:grid; place-items:center; font-size:9px; font-weight:700; color:#fff; }

.tl-alert { display:flex; gap:8px; padding:8px 10px; border-radius:8px; margin-bottom:7px; font-size:11px; background:var(--tl-surf); border:1px solid var(--tl-border); }
.tl-alert.crit { border-left:3px solid var(--tl-red); } .tl-alert.warn { border-left:3px solid var(--tl-amber); } .tl-alert.info { border-left:3px solid var(--tl-blue); }
.tl-alert .t { font-size:9px; color:var(--tl-muted); margin-top:2px; }

.tl-rev { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
.tl-revbar { height:6px; border-radius:3px; margin-top:4px; }
.tl-badge { font-size:9px; font-weight:800; padding:2px 8px; border-radius:10px; background:rgba(63,185,80,.15); color:var(--tl-green); text-transform:uppercase; }

.tl-empty { color:var(--tl-muted); font-size:11px; font-style:italic; padding:8px 2px; }

@media (max-width:1100px){
  .teleui-root { position:static; min-height:100vh; }
  .tl-layout { grid-template-columns:1fr; grid-template-rows:auto auto auto auto; overflow:visible; height:auto; }
  .tl-panel { max-height:none; }
}
`;

const TeleUiDashboard: React.FC = () => {
  const [range, setRange] = useState<Range>('all');
  const [filter, setFilter] = useState<AgentFilter>('all');
  const [clock, setClock] = useState('--:--:--');

  const { data, isError, isFetching } = useGetTeleuiDataQuery({ range }, { pollingInterval: 5000 });
  const d = (data?.data ?? null) as TeleData | null;

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const agents = useMemo(() => {
    const a = d?.agents ?? [];
    if (filter === 'active') return a.filter(x => x.status === 'active');
    if (filter === 'low') return a.filter(x => connRate(x) < 0.4);
    if (filter === 'short') return a.filter(x => x.short > 0);
    return a;
  }, [d, filter]);

  const k = d?.kpis;
  const heatmap = d?.heatmap ?? [];

  return (
    <div className="teleui-root" data-theme="dark">
      <style>{CSS}</style>

      <div className="tl-topbar">
        <div className="tl-logo">
          <div className="tl-mark">TM</div>
          <div><div className="tl-logo-text">TruckMitr</div><div className="tl-logo-sub">Team Leader Command</div></div>
        </div>
        <div className="tl-sep" />
        <div className="tl-kpi g"><span className="v">{k ? k.conn_rate + '%' : '—'}</span><span className="l">Live Conn%</span></div>
        <div className="tl-kpi o"><span className="v">{nfmt(k?.total)}</span><span className="l">Total Calls</span></div>
        <div className="tl-kpi r"><span className="v">{nfmt(k?.alerts)}</span><span className="l">Active Alerts</span></div>
        <div className="tl-spacer" />
        <div className="tl-rt" title="Time window">
          <button className={range === 'all' ? 'on' : ''} onClick={() => setRange('all')}>All-time</button>
          <button className={range === 'today' ? 'on' : ''} onClick={() => setRange('today')}>Today</button>
        </div>
        <span className="tl-clock">{clock}</span>
        <div className="tl-alert-badge"><span className="dot" /> {nfmt(k?.alerts)} Alerts</div>
      </div>

      {isError && <div className="tl-err">⚠ Couldn't load data — check that the teleui API is reachable for this environment.</div>}

      <div className="tl-layout">
        {/* KPI STRIP */}
        <div className="tl-strip">
          <div className="tl-tile" style={{ ['--c' as any]: 'var(--tl-blue)' }}>
            <div className="lab">Total Calls</div><div className="val">{nfmt(k?.total)}</div>
            <div className="sub">{range === 'today' ? 'today' : 'all-time'}{isFetching ? ' · syncing…' : ''}</div>
          </div>
          <div className="tl-tile" style={{ ['--c' as any]: 'var(--tl-green)' }}>
            <div className="lab">Connected Calls</div><div className="val">{nfmt(k?.connected)}</div>
            <div className="sub">{k ? k.conn_rate + '% connect rate' : '—'}</div>
          </div>
          <div className="tl-tile" style={{ ['--c' as any]: 'var(--tl-amber)' }}>
            <div className="lab">Short Calls &lt;30s</div><div className="val">{nfmt(k?.short)}</div>
            <div className="sub">connected under 30s</div>
          </div>
          <div className="tl-tile" style={{ ['--c' as any]: 'var(--tl-red)' }}>
            <div className="lab">Re-attempt Queue</div><div className="val">{nfmt(k?.queue)}</div>
            <div className="sub">unconnected</div>
          </div>
          <div className="tl-tile" style={{ ['--c' as any]: 'var(--tl-orange-s)' }}>
            <div className="lab">Unique Customers</div><div className="val">{nfmt(k?.unique_customers)}</div>
            <div className="sub">distinct customers</div>
          </div>
          <div className="tl-tile" style={{ ['--c' as any]: 'var(--tl-green)' }}>
            <div className="lab">Revenue Calls (&gt;120s)</div><div className="val">{nfmt(k?.revenue_calls)}</div>
            <div className="sub">{k && k.connected ? Math.round(k.revenue_calls / k.connected * 100) + '% of connected' : 'of connected'}</div>
          </div>
        </div>

        {/* AGENTS */}
        <aside className="tl-panel">
          <div className="tl-phead">
            <span className="tl-ptitle">Agents — Live View</span>
            <span style={{ fontSize: 10, color: 'var(--tl-muted)' }}>{agents.length} agents</span>
          </div>
          <div className="tl-filters">
            {(['all', 'active', 'low', 'short'] as AgentFilter[]).map(f => (
              <button key={f} className={`tl-fbtn ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'active' ? 'Active' : f === 'low' ? 'Low Rate' : 'Short Calls'}
              </button>
            ))}
          </div>
          {agents.length === 0 && <div className="tl-empty">No agents in this window.</div>}
          {agents.map((a, i) => {
            const r = connRate(a);
            return (
              <div className="tl-card" key={a.name + i}>
                <div className="tl-atop">
                  <span className={`tl-sdot ${a.status}`} />
                  <span className="tl-aname">{a.name}</span>
                  <span className="tl-astat">{a.status === 'active' ? '● on call' : a.status} · {a.lastCall}</span>
                </div>
                <div className="tl-ametrics">
                  <div className="tl-mi"><div className="tl-mv" style={{ color: rateColor(r) }}>{(r * 100).toFixed(1)}%</div><div className="tl-ml">Conn Rate</div></div>
                  <div className="tl-mi"><div className="tl-mv">{nfmt(a.calls)}</div><div className="tl-ml">Total</div></div>
                  <div className="tl-mi"><div className="tl-mv">{nfmt(a.ans)}</div><div className="tl-ml">Answered</div></div>
                </div>
                <div className="tl-ratebar"><div className="tl-ratefill" style={{ width: (r * 100).toFixed(1) + '%', background: rateColor(r) }} /></div>
                <span className={`tl-flag ${a.short > 0 ? 'bad' : 'ok'}`}>{a.short > 0 ? `⚠ ${a.short} short` : '✓ Clean'}</span>
              </div>
            );
          })}
        </aside>

        {/* CENTER: heatmap + queue */}
        <section className="tl-panel">
          <div className="tl-phead">
            <span className="tl-ptitle">Hourly Connectivity — by Day &amp; Hour</span>
            <span style={{ fontSize: 10, color: 'var(--tl-muted)' }}>% connected per hour</span>
          </div>
          <div className="tl-hmgrid">
            <div className="tl-hc hdr" />
            {HOURS.map(h => <div key={'h' + h} className="tl-hc hdr">{h}:00</div>)}
            {DAYS.map((day, di) => (
              <React.Fragment key={day}>
                <div className="tl-hc rl">{day}</div>
                {HOURS.map((_, hi) => {
                  const v = (heatmap[di] && heatmap[di][hi] != null) ? heatmap[di][hi] : 0;
                  return <div key={day + hi} className="tl-hc" style={{ background: heatColor(v) }} title={`${day} ${HOURS[hi]}:00 → ${(v * 100).toFixed(0)}%`}>{(v * 100).toFixed(0)}%</div>;
                })}
              </React.Fragment>
            ))}
          </div>
          <div className="tl-legend">
            <span><i style={{ background: '#1f6b3a' }} />≥53%</span>
            <span><i style={{ background: '#2f9e4f' }} />46–53%</span>
            <span><i style={{ background: '#b9821c' }} />40–46%</span>
            <span><i style={{ background: '#c76a1a' }} />34–40%</span>
            <span><i style={{ background: '#7c2d2d' }} />&lt;34%</span>
          </div>

          <div className="tl-phead" style={{ marginTop: 18 }}>
            <span className="tl-ptitle">Re-attempt Queue</span>
            <span style={{ fontSize: 10, color: 'var(--tl-red)' }}>{nfmt(k?.queue)} pending</span>
          </div>
          {(d?.queue ?? []).length === 0 && <div className="tl-empty">Nothing pending re-attempt.</div>}
          {(d?.queue ?? []).map((q, i) => (
            <div className={`tl-qrow ${q.priority}`} key={q.num + i}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="tl-qnum">{q.num}</div>
                <div className="tl-qmeta">{q.tries}× tried · last {q.lastTry} · prev {q.agent} · {q.window}</div>
              </div>
              <span className="tl-badge" style={{ background: 'transparent', color: cwColor(q.priority === 'high' ? 'avoid' : q.priority === 'medium' ? 'ok' : 'good') }}>{q.priority}</span>
            </div>
          ))}
        </section>

        {/* RIGHT: windows + alerts + revenue */}
        <aside className="tl-panel">
          <div className="tl-ptitle">Truck Driver Windows</div>
          <div style={{ fontSize: 10, color: 'var(--tl-muted)', margin: '6px 0' }}>Best times to reach drivers (8am–8pm)</div>
          <div className="tl-cw">
            {CW.map(c => <div key={c.h} className="tl-cwc" style={{ background: cwColor(c.type) }} title={`${c.h}:00 ${c.type}`}>{c.h}</div>)}
          </div>
          <div className="tl-legend" style={{ marginBottom: 16 }}>
            <span><i style={{ background: 'var(--tl-green)' }} />Good</span>
            <span><i style={{ background: 'var(--tl-amber)' }} />Moderate</span>
            <span><i style={{ background: 'var(--tl-red)' }} />Avoid</span>
          </div>

          <div className="tl-ptitle" style={{ marginBottom: 8 }}>⚡ Live Alerts</div>
          {(d?.alerts ?? []).length === 0 && <div className="tl-empty">No alerts.</div>}
          {(d?.alerts ?? []).map((al, i) => (
            <div className={`tl-alert ${al.type}`} key={i}>
              <span>{al.icon}</span>
              <div style={{ flex: 1 }}>{al.msg}<div className="t">{al.time}</div></div>
            </div>
          ))}

          <div className="tl-phead" style={{ marginTop: 16 }}>
            <span className="tl-ptitle">Revenue Pipeline</span>
            <span className="tl-badge">{range === 'today' ? 'Today' : 'All-time'}</span>
          </div>
          {(d?.revenue ?? []).map((rv, i) => (
            <div className="tl-rev" key={i}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{rv.label}</div>
                <div className="tl-revbar" style={{ width: Math.min(100, (rv.val / (rv.max || 1)) * 100).toFixed(0) + '%', background: rv.color }} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: rv.color, paddingLeft: 10, fontVariantNumeric: 'tabular-nums' }}>{nfmt(rv.val)}</div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default TeleUiDashboard;
