import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../app/providers/AuthProvider';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/rootReducer';
import { setBreakStatus } from '../app/slices/userSlice';

export const CallerLayout: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const breakStatus = useSelector((state: RootState) => state.user.breakStatus);
  const callStatus = useSelector((state: RootState) => state.queueState.callStatus);

  const handleBreakToggle = () => {
    dispatch(setBreakStatus(breakStatus === 'active' ? 'none' : 'active'));
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background select-none relative">
      {/* Dialer Topbar */}
      <header className="h-[52px] bg-[#1b1c1c] text-white border-b border-outline flex items-center justify-between px-md z-40">
        <div className="flex items-center gap-md">
          <Link to="/" className="flex items-center gap-xs text-outline hover:text-white transition-colors text-xs font-semibold mr-md">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Dashboard</span>
          </Link>
          <span className="h-4 w-[1px] bg-outline"></span>
          <div>
            <h1 className="text-xs font-bold tracking-tight text-white leading-tight">
              TruckMitr Dialer Console
            </h1>
            <p className="text-[9px] text-outline uppercase font-semibold">
              Internal Call Queue
            </p>
          </div>
        </div>

        {/* Dialer State Indicators */}
        <div className="flex items-center gap-lg text-xs">
          {/* Break Status Switcher */}
          <button
            onClick={handleBreakToggle}
            className={`px-sm py-1 font-semibold rounded-sm transition-colors text-xs ${
              breakStatus === 'active'
                ? 'bg-amber-500 text-black hover:bg-amber-600'
                : 'bg-surface-container border border-outline hover:bg-surface-container-high text-on-surface'
            }`}
          >
            {breakStatus === 'active' ? 'ON BREAK' : 'GO ON BREAK'}
          </button>

          {/* Connected State Badge */}
          <div className="flex items-center gap-sm">
            <span className="text-[10px] text-outline">Call Engine:</span>
            <div className="flex items-center gap-xs">
              <span className={`w-2 h-2 rounded-full ${callStatus === 'idle' ? 'bg-outline' : 'bg-green-500 animate-pulse'}`}></span>
              <span className="font-bold text-[11px] uppercase tracking-wider text-outline-variant">
                {callStatus}
              </span>
            </div>
          </div>

          {/* User profile details */}
          {user && (
            <div className="flex items-center gap-sm bg-[#303030] px-sm py-1 rounded-sm border border-outline">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white font-extrabold text-[10px]">
                {user.role}
              </div>
              <span className="font-data-mono text-[11px] font-semibold text-white">
                {user.name.split(' ')[0]}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Focus View */}
      <div className="absolute top-[52px] left-0 right-0 bottom-0 overflow-y-auto overflow-x-hidden p-md">
        <Outlet />
      </div>

      {/* Visual Accent Top Line */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-[#2874F0] z-50"></div>
    </div>
  );
};
export default CallerLayout;
