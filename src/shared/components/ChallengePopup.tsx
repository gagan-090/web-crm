import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { Role } from '../constants/roles';
import { useGetMyRevenueChallengeQuery } from '../../services/api/webCrmApi';

/**
 * CHALLENGE POPUP — the once-a-day Revenue Challenge greeting.
 *
 * Shown to a calling agent the first time they land in the dashboard each day
 * (gated per user + per day in localStorage). It reads their own target card
 * from /revenue-challenge/me and drops them into the "My Target" screen.
 */

const inr = (n: number) => '₹' + Math.round(n || 0).toLocaleString('en-IN');

// The agent (calling) desks — managers get the command board instead.
const AGENT_ROLES: string[] = [Role.DW, Role.WCT, Role.MM, Role.SC];

const seenKey = (userId: number | string) => `rc_challenge_popup:${userId}:${new Date().toISOString().slice(0, 10)}`;

const readSeen = (userId: number | string): boolean => {
  try { return localStorage.getItem(seenKey(userId)) === '1'; } catch { return false; }
};
const writeSeen = (userId: number | string) => {
  try { localStorage.setItem(seenKey(userId), '1'); } catch { /* private mode — just show again next load */ }
};

const ChallengePopup: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id ?? user?.name ?? '';
  const isAgent = !!user && AGENT_ROLES.includes(user.role);

  // Decide once whether this day's popup is still owed. We only fetch when it is.
  const [eligible, setEligible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isAgent && userId && !readSeen(userId)) setEligible(true);
  }, [isAgent, userId]);

  const { data } = useGetMyRevenueChallengeQuery(undefined, { skip: !eligible });

  useEffect(() => {
    if (eligible && data) setOpen(true);
  }, [eligible, data]);

  if (!open || !data) return null;

  const { agent, contest, my, category_standing: cat } = data.data;

  const dismiss = () => {
    if (userId) writeSeen(userId);
    setOpen(false);
  };
  const goToTarget = () => {
    dismiss();
    navigate('/my-target');
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4" onClick={dismiss}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeIn_.2s_ease]"
        onClick={e => e.stopPropagation()}
      >
        {/* Banner */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-5 relative">
          <button onClick={dismiss} className="absolute top-3 right-3 text-white/80 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[28px]">rocket_launch</span>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">{contest.month_label} · {contest.sprint_label}</div>
              <div className="text-lg font-black leading-tight">{contest.title}</div>
            </div>
          </div>
          <p className="text-[13px] text-indigo-100 mt-2">
            Hi <span className="font-bold text-white">{agent.name}</span> — {contest.days_left} day{contest.days_left === 1 ? '' : 's'} left in this sprint. Here's where you stand.
          </p>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          {agent.has_target ? (
            <div className="rounded-xl border border-gray-200 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">My Sprint Target</span>
                <span className="text-[11px] font-black text-gray-500">{my.pct_period}%</span>
              </div>
              <div className="mt-1 flex items-end gap-1.5">
                <span className="text-2xl font-black text-gray-900">{inr(my.achieved_period)}</span>
                <span className="text-sm text-gray-400 mb-0.5">/ {inr(my.period_target)}</span>
              </div>
              <div className="mt-2 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div className={`h-full rounded-full ${my.pct_period >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`} style={{ width: `${Math.max(Math.min(my.pct_period, 100), 2)}%` }} />
              </div>
              <div className="text-[11px] text-gray-500 mt-1.5">{inr(my.remaining_period)} to hit your sprint goal · monthly {inr(my.monthly_target)}</div>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-[12px] text-amber-800">
              You collected <span className="font-black">{inr(my.achieved_period)}</span> this sprint. No personal target is mapped to your name yet — keep closing and it all counts.
            </div>
          )}

          {/* Two reward chips */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className={`rounded-xl border p-3 ${my.achievement_unlocked ? 'bg-emerald-50 border-emerald-200' : 'border-gray-200'}`}>
              <div className="text-[10px] font-black uppercase tracking-wide text-gray-400">Achievement</div>
              {my.achievement_unlocked ? (
                <div className="text-emerald-700 font-black text-sm flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">verified</span>+{inr(my.achievement_reward)}
                </div>
              ) : (
                <div className="text-sm font-black text-gray-800 mt-0.5">{inr(my.achievement_remaining)} <span className="text-[10px] font-bold text-gray-400">to +{inr(my.achievement_reward)}</span></div>
              )}
            </div>
            <div className="rounded-xl border border-gray-200 p-3">
              <div className="text-[10px] font-black uppercase tracking-wide text-gray-400">Category Rank</div>
              <div className="text-sm font-black text-gray-800 mt-0.5 flex items-center gap-1">
                {cat.is_leader ? <><span className="material-symbols-outlined text-[16px] text-amber-500">emoji_events</span>Leading</> : <>#{cat.rank ?? '—'} <span className="text-[10px] font-bold text-gray-400">/ {cat.total_peers}</span></>}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button onClick={dismiss} className="flex-1 h-10 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50">
              Got it
            </button>
            <button onClick={goToTarget} className="flex-1 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black flex items-center justify-center gap-1">
              View My Target <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengePopup;
