import React from 'react';
import { Sliders, Database } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-8 max-w-3xl text-left animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">System Settings</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Adjust civic database indicators, connection tokens, and UI layout preferences.
        </p>
      </div>

      {/* Database Connection Overrides */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center space-x-2 pb-3 border-b border-border">
          <Database className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Snowflake Gateway Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-xs font-semibold">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Account URL</label>
            <input
              type="text"
              readOnly
              value="https://xy77112.snowflakecomputing.com"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-muted-foreground cursor-not-allowed focus:outline-none"
            />
          </div>
          <div className="space-y-1.5 text-xs font-semibold">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Warehouse</label>
            <input
              type="text"
              readOnly
              value="COMPUTE_WH (Auto-suspend)"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-muted-foreground cursor-not-allowed focus:outline-none"
            />
          </div>
        </div>

        <div className="text-[10px] text-muted-foreground bg-secondary/40 border border-border p-3 rounded-lg leading-relaxed">
          *Note: Connection override parameters are managed inside the backend server environment variables (`.env`) for compliance with global security regulations.
        </div>
      </div>

      {/* Visual Settings */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center space-x-2 pb-3 border-b border-border">
          <Sliders className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">UI Preferences</h3>
        </div>

        <div className="space-y-3.5">
          <div className="flex justify-between items-center text-xs">
            <div className="space-y-0.5">
              <h4 className="font-semibold text-foreground">Force Mock Responses</h4>
              <p className="text-[10px] text-muted-foreground font-medium">Enable local JSON datasets bypass for static showcase demos.</p>
            </div>
            <div className="w-9 h-5 bg-primary rounded-full p-0.5 cursor-pointer flex justify-end">
              <div className="w-4 h-4 bg-primary-foreground rounded-full" />
            </div>
          </div>

          <div className="flex justify-between items-center text-xs pt-3.5 border-t border-border">
            <div className="space-y-0.5">
              <h4 className="font-semibold text-foreground">Confidence Threshold</h4>
              <p className="text-[10px] text-muted-foreground font-medium">Filter Cortex LLM queries below matching confidence levels.</p>
            </div>
            <span className="font-mono text-[10px] bg-secondary text-primary border border-border px-2 py-0.5 rounded-lg">
              &gt; 0.85
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Settings;
