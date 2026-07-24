import React, { useState, useEffect } from 'react';
import { Database, ShieldCheck, Check, X, RefreshCw } from 'lucide-react';
import { showToast } from '../components/ui/Toast';

interface PendingUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  organization: string;
  account_status: string;
  createdAt: string;
}

export const Settings: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [allUsers, setAllUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/pending-users');
      if (res.ok) {
        const data = await res.json();
        setPendingUsers(data.pending_users || []);
        setAllUsers(data.all_users || []);
      }
    } catch {
      // Offline fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (email: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/approve-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message, action === 'approve' ? 'success' : 'info');
        fetchUsers();
      } else {
        showToast('Failed to update account status.', 'error');
      }
    } catch {
      showToast('Network error while updating user account.', 'error');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl text-left animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">System Settings & Governance</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Adjust civic database indicators, manage Administrator account approvals for Auditors and Officials, and configure preferences.
        </p>
      </div>

      {/* Administrator Approval Panel for Government Officials & Auditors */}
      <div className="bg-card border border-primary/30 rounded-2xl p-5 space-y-4 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-sm font-bold text-foreground">Administrator Account Approvals</h3>
              <p className="text-[10px] text-muted-foreground">
                Government Official and Auditor accounts require Administrator verification before sign-in access is granted.
              </p>
            </div>
          </div>
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="p-1.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg border border-border transition text-xs flex items-center space-x-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Pending Requests List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-foreground">Pending Account Requests</span>
            <span className="bg-amber-500/10 text-amber-500 text-[10px] px-2 py-0.5 rounded border border-amber-500/30">
              {pendingUsers.length} Pending
            </span>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="bg-secondary/40 border border-border p-4 rounded-xl text-center text-xs text-muted-foreground font-medium">
              No pending Auditor or Government Official approval requests. All accounts verified.
            </div>
          ) : (
            <div className="space-y-2">
              {pendingUsers.map((item) => (
                <div
                  key={item.email}
                  className="bg-secondary/70 border border-border p-3.5 rounded-xl flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-foreground">{item.fullName}</span>
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold border border-primary/20">
                        {item.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {item.email} • Organization: <span className="text-foreground font-medium">{item.organization}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleAction(item.email, 'approve')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleAction(item.email, 'reject')}
                      className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-500/30 transition flex items-center space-x-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Registered Users Directory */}
        {allUsers.length > 0 && (
          <div className="pt-3 border-t border-border space-y-2 text-xs">
            <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Registered Directory Status</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allUsers.map((u) => (
                <div key={u.email} className="bg-secondary/40 border border-border p-2.5 rounded-lg flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-semibold text-foreground">{u.fullName}</span>
                    <div className="text-[10px] text-muted-foreground">{u.email} ({u.role})</div>
                  </div>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                    u.account_status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : u.account_status === 'Pending Approval'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {u.account_status || 'Active'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
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
              value="https://eq68824.ap-southeast-1.snowflakecomputing.com"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-muted-foreground cursor-not-allowed focus:outline-none"
            />
          </div>
          <div className="space-y-1.5 text-xs font-semibold">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Warehouse</label>
            <input
              type="text"
              readOnly
              value="COMPUTE_WH (CIVIC_TRANSPARENCY_DB)"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-muted-foreground cursor-not-allowed focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Settings;
