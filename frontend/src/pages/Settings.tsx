import React from 'react';
import { Sliders, Database } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">System Settings</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Adjust civic database indicators, connection tokens, and UI layout preferences.
        </p>
      </div>

      {/* Database Connection Overrides */}
      <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-neutral-900">
          <Database className="w-4 h-4 text-neutral-300" />
          <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">Snowflake Gateway Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-neutral-400">Account URL</label>
            <input
              type="text"
              readOnly
              value="https://xy77112.snowflakecomputing.com"
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-400 cursor-not-allowed focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-neutral-400">Warehouse</label>
            <input
              type="text"
              readOnly
              value="COMPUTE_WH (Auto-suspend)"
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-400 cursor-not-allowed focus:outline-none"
            />
          </div>
        </div>

        <div className="text-[10px] text-neutral-500 bg-neutral-900/40 border border-neutral-900 p-3 rounded leading-relaxed">
          *Note: Connection override parameters are managed inside the backend server environment variables (`.env`) for compliance with global security regulations.
        </div>
      </div>

      {/* Visual Settings */}
      <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-neutral-900">
          <Sliders className="w-4 h-4 text-neutral-300" />
          <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">UI Preferences</h3>
        </div>

        <div className="space-y-3.5">
          <div className="flex justify-between items-center text-xs">
            <div className="space-y-0.5">
              <h4 className="font-semibold text-neutral-200">Force Mock Responses</h4>
              <p className="text-[10px] text-neutral-500">Enable local JSON datasets bypass for static showcase demos.</p>
            </div>
            <div className="w-9 h-5 bg-neutral-100 rounded-full p-0.5 cursor-pointer flex justify-end">
              <div className="w-4 h-4 bg-neutral-900 rounded-full" />
            </div>
          </div>

          <div className="flex justify-between items-center text-xs pt-3.5 border-t border-neutral-900">
            <div className="space-y-0.5">
              <h4 className="font-semibold text-neutral-200">Confidence Threshold</h4>
              <p className="text-[10px] text-neutral-500">Filter Cortex LLM queries below matching confidence levels.</p>
            </div>
            <span className="font-mono text-[10px] bg-neutral-900 text-neutral-300 border border-neutral-800 px-2 py-0.5 rounded">
              &gt; 0.85
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Settings;
