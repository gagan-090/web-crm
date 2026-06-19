import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../app/rootReducer';
import {
  setDialerMode,
  setAutoDialDelay,
  toggleSoundEffects,
  setScriptLanguage
} from '../slices/settingsSlice';
import { ROLE_PERMISSIONS } from '../../../shared/constants/permissions';

export const SettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);

  return (
    <div className="space-y-md">
      <div className="grid grid-cols-12 gap-md items-start">
        
        {/* Settings Form Controls (7 columns) */}
        <div className="col-span-7 bg-white p-lg border border-outline-variant rounded-sm flipkart-shadow space-y-md">
          <h3 className="font-headline-md text-xs font-extrabold uppercase text-on-surface border-b border-outline-variant pb-xs">
            Dialer & Script Configuration
          </h3>

          <div className="space-y-md text-xs">
            {/* Dialer Mode */}
            <div className="space-y-xs">
              <label className="font-semibold text-outline block">Active Dialer Core Engine</label>
              <div className="flex gap-sm">
                {['preview', 'progressive', 'predictive'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => dispatch(setDialerMode(mode as any))}
                    className={`flex-1 py-sm border rounded-sm font-bold text-center uppercase transition-all ${
                      settings.dialerMode === mode
                        ? 'bg-primary-fixed text-primary border-primary'
                        : 'border-outline-variant hover:bg-surface-container bg-white text-on-surface'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-outline mt-xs">
                Preview displays lead first, progressive auto-dials after delay, predictive dials multiple leads.
              </p>
            </div>

            {/* Auto dial delay */}
            <div className="space-y-xs">
              <label className="font-semibold text-outline block">Auto Dial Delay Delay (Seconds)</label>
              <input
                type="number"
                min={2}
                max={30}
                value={settings.autoDialDelay}
                onChange={(e) => dispatch(setAutoDialDelay(Number(e.target.value)))}
                className="w-full px-sm py-xs border border-outline-variant rounded-sm text-xs focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            {/* Sound effects */}
            <div className="flex items-center justify-between p-sm border border-outline-variant bg-surface-container-low rounded-sm cursor-pointer"
              onClick={() => dispatch(toggleSoundEffects())}
            >
              <div>
                <p className="font-bold">Sound Effects & Alerts</p>
                <p className="text-[10px] text-outline">Play alerts on incoming call connection and SLA delay thresholds.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEffects}
                onChange={() => {}} // toggled by parent click
                className="rounded-sm border-outline-variant"
              />
            </div>

            {/* Script Language */}
            <div className="space-y-xs">
              <label className="font-semibold text-outline block">Default Caller Script Language</label>
              <div className="flex gap-sm">
                {[
                  { lang: 'en', label: 'English' },
                  { lang: 'hi', label: 'Hindi (हिंदी)' }
                ].map((item) => (
                  <button
                    key={item.lang}
                    onClick={() => dispatch(setScriptLanguage(item.lang as any))}
                    className={`flex-1 py-sm border rounded-sm font-bold text-center transition-all ${
                      settings.scriptLanguage === item.lang
                        ? 'bg-primary-fixed text-primary border-primary'
                        : 'border-outline-variant hover:bg-surface-container bg-white text-on-surface'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Role Permissions Matrix (5 columns) */}
        <div className="col-span-5 bg-white p-lg border border-outline-variant rounded-sm flipkart-shadow space-y-md">
          <h3 className="font-headline-md text-xs font-extrabold uppercase text-on-surface border-b border-outline-variant pb-xs">
            Role Permission Matrix
          </h3>
          <p className="text-[10px] text-outline">
            Centralized matrix configuration. Displays action allowances mapped to active employee scopes.
          </p>

          <div className="space-y-md max-h-96 overflow-y-auto custom-scrollbar pr-xs">
            {Object.entries(ROLE_PERMISSIONS).map(([roleName, perms]) => (
              <div key={roleName} className="space-y-xs pb-sm border-b border-outline-variant last:border-b-0">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-primary">{roleName}</span>
                  <span className="text-[10px] text-outline font-semibold">
                    {perms.length} Permissions
                  </span>
                </div>
                <div className="flex flex-wrap gap-xs">
                  {perms.slice(0, 5).map((p) => (
                    <span key={p} className="px-1.5 py-0.5 bg-surface-container text-on-surface-variant text-[9px] font-semibold rounded-sm font-data-mono border border-outline-variant">
                      {p}
                    </span>
                  ))}
                  {perms.length > 5 && (
                    <span className="px-1.5 py-0.5 bg-inverse-surface text-white text-[9px] font-bold rounded-sm">
                      +{perms.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
