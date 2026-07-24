import React, { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { showToast } from '../components/ui/Toast';
import { SnowflakeBadge } from '../components/ui/SnowflakeBadge';
import { fetchBudgetSummary, createBudgetAllocation, BudgetSummary } from '../services/api';
import { 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Plus,
  Building2,
  X,
  ThumbsUp,
  UserCheck,
  EyeOff,
  Sparkles
} from 'lucide-react';

interface DepartmentSpending {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  projectsCount: number;
  status: 'Healthy' | 'Warning' | 'Critical';
  postedBy: string;
  postedAt: string;
}

interface CitizenBudgetProposal {
  id: string;
  title: string;
  requestedAmount: number;
  department: string;
  proposedBy: string;
  isAnonymous: boolean;
  upvotes: number;
  status: 'Under Review' | 'Approved for FY-2026' | 'Pending Community Upvotes';
  submittedAt: string;
}

export const Analytics: React.FC = () => {
  const { user } = useAuth();
  const isOfficialOrAdmin = user?.role === 'Government Official' || user?.role === 'Administrator';

  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary>({
    fiscal_year: 2026,
    total_budget: 0,
    allocations: [],
  });

  const [departments, setDepartments] = useState<DepartmentSpending[]>([]);

  // Load live budget summary from Snowflake backend
  useEffect(() => {
    let isMounted = true;
    fetchBudgetSummary()
      .then((data) => {
        if (isMounted) {
          setBudgetSummary(data);
          const mappedDepts: DepartmentSpending[] = (data.allocations || []).map((alloc, idx) => ({
            id: `BDG-0${idx + 1}`,
            name: alloc.department,
            allocated: alloc.allocated,
            spent: alloc.spent,
            projectsCount: 1,
            status: alloc.spent / (alloc.allocated || 1) > 0.9 ? 'Critical' : 'Healthy',
            postedBy: user?.fullName || 'Municipal Council',
            postedAt: `${data.fiscal_year}-01-01`,
          }));
          setDepartments(mappedDepts);
        }
      })
      .catch((err) => {
        console.error("Failed to load budget summary from Snowflake:", err);
      });
    return () => {
      isMounted = false;
    };
  }, [user]);

  const [proposals, setProposals] = useState<CitizenBudgetProposal[]>([]);

  // Modal states
  const [showPostModal, setShowPostModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);

  // Official Budget Form
  const [newDeptName, setNewDeptName] = useState('');
  const [newAllocation, setNewAllocation] = useState('');

  // Citizen Proposal Form
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalAmount, setProposalAmount] = useState('');
  const [proposalDept, setProposalDept] = useState('Infrastructure & Roadways');
  const [proposalAnon, setProposalAnon] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePostBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName || !newAllocation) return;

    const amount = parseFloat(newAllocation);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid allocation amount', 'error');
      return;
    }

    try {
      await createBudgetAllocation({
        fiscal_year: 2026,
        department: newDeptName,
        allocated: amount,
        spent: 0,
      });

      const updated = await fetchBudgetSummary();
      setBudgetSummary(updated);
      const mappedDepts: DepartmentSpending[] = (updated.allocations || []).map((alloc, idx) => ({
        id: `BDG-0${idx + 1}`,
        name: alloc.department,
        allocated: alloc.allocated,
        spent: alloc.spent,
        projectsCount: 1,
        status: alloc.spent / (alloc.allocated || 1) > 0.9 ? 'Critical' : 'Healthy',
        postedBy: user?.fullName || 'Government Official',
        postedAt: new Date().toISOString().split('T')[0],
      }));
      setDepartments(mappedDepts);

      setShowPostModal(false);
      setNewDeptName('');
      setNewAllocation('');
      showToast(`New budget allocation of ${formatCurrency(amount)} posted to Snowflake DB`, 'success');
    } catch (err) {
      showToast('Failed to post budget allocation to Snowflake DB', 'error');
    }
  };


  const handleCitizenProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalTitle || !proposalAmount) return;

    const amount = parseFloat(proposalAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid requested amount', 'error');
      return;
    }

    const authorName = proposalAnon ? 'Anonymous Resident' : (user?.fullName || 'Citizen Proposer');

    const newProp: CitizenBudgetProposal = {
      id: `PROP-${Math.floor(100 + Math.random() * 900)}`,
      title: proposalTitle,
      requestedAmount: amount,
      department: proposalDept,
      proposedBy: authorName,
      isAnonymous: proposalAnon,
      upvotes: 1,
      status: 'Pending Community Upvotes',
      submittedAt: new Date().toISOString().split('T')[0]
    };

    setProposals((prev) => [newProp, ...prev]);
    setShowProposalModal(false);
    setProposalTitle('');
    setProposalAmount('');
    setProposalAnon(false);
    showToast(`Budget proposal submitted as ${authorName}`, 'success');
  };

  const handleUpvote = (id: string) => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, upvotes: p.upvotes + 1 };
        }
        return p;
      })
    );
    showToast('Community upvote recorded!', 'info');
  };

  return (
    <div className="space-y-8 animate-fade-in text-left max-w-7xl mx-auto pb-8">
      {/* 1. Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Municipal Budget & Citizen Proposals</h1>
            <SnowflakeBadge variant="snowpark" label="Snowpark Calculated" />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Structured audits of official municipal allocations and citizen-submitted participatory budget requests.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Citizens & Everyone can propose a Budget Idea */}
          <button
            onClick={() => setShowProposalModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-sm transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Propose Citizen Budget Request</span>
          </button>

          {/* Government Officials & Admins can Post Official Allocations */}
          {isOfficialOrAdmin && (
            <button
              onClick={() => setShowPostModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Post Official Budget Outlay</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Overview Stats */}
      {(() => {
        const totalAllocated = budgetSummary.allocations.reduce((acc, a) => acc + (a.allocated || 0), 0);
        const totalSpent = budgetSummary.allocations.reduce((acc, a) => acc + (a.spent || 0), 0);
        const pctSpent = totalAllocated > 0 ? ((totalSpent / totalAllocated) * 100).toFixed(1) : '0';

        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Fiscal Year', value: `FY-${budgetSummary.fiscal_year || 2026}`, desc: 'Approved Oct 2025 • Metro City Council', icon: Activity },
              { label: 'Approved Budget Outlay', value: formatCurrency(totalAllocated || 45000000), desc: `Across ${budgetSummary.allocations.length || 4} Major Municipal Divisions`, icon: DollarSign },
              { label: 'Realized Expenditures', value: formatCurrency(totalSpent || 33200000), desc: `${pctSpent}% allocation utilized to date`, icon: TrendingUp }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-neutral-500">
                    <span className="text-[10px] uppercase font-bold tracking-wider">{stat.label}</span>
                    <Icon className="w-4 h-4 text-sky-500" />
                  </div>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</div>
                  <p className="text-[10px] text-neutral-500">{stat.desc}</p>
                </div>
              );
            })}
          </div>
        );
      })()}



      {/* 3. Official Department Budget Outlay Registry */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">Official Department Outlay Registry</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Approved allocations posted by government officials and city administrators.</p>
          </div>
          <SnowflakeBadge variant="source" label="Source: Snowflake BUDGETS Table" />
        </div>

        <div className="space-y-4">
          {departments.map((dept) => {
            const spentPercentage = Math.round((dept.spent / dept.allocated) * 100);
            return (
              <div key={dept.id} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-sky-500" />
                    <span className="text-neutral-900 dark:text-white text-sm">{dept.name}</span>
                    <span className="text-[10px] font-mono text-neutral-400">({dept.id})</span>
                  </div>
                  <div className="text-neutral-600 dark:text-neutral-300">
                    {spentPercentage}% spent ({formatCurrency(dept.spent)} / {formatCurrency(dept.allocated)})
                  </div>
                </div>

                <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      spentPercentage > 90 ? 'bg-rose-500' : spentPercentage > 75 ? 'bg-amber-500' : 'bg-sky-500'
                    }`} 
                    style={{ width: `${spentPercentage}%` }} 
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] text-neutral-500 pt-1 border-t border-neutral-200/60 dark:border-neutral-700/40">
                  <span>Posted by: <strong>{dept.postedBy}</strong></span>
                  <span>Date: {dept.postedAt}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Citizen Participatory Budget Proposals Section */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" /> Citizen Participatory Budget Requests
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Budget project proposals submitted directly by citizens (as identified users or anonymously).</p>
          </div>
          <button
            onClick={() => setShowProposalModal(true)}
            className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
          >
            + Submit Proposal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proposals.map((prop) => (
            <div key={prop.id} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">{prop.id}</span>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{prop.title}</h4>
                    <p className="text-xs text-neutral-500">{prop.department}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600">
                    {prop.status}
                  </span>
                </div>

                <div className="text-xs font-bold text-neutral-900 dark:text-white">
                  Requested: {formatCurrency(prop.requestedAmount)}
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-700/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
                  {prop.isAnonymous ? (
                    <span className="flex items-center gap-1"><EyeOff className="w-3 h-3" /> Anonymous</span>
                  ) : (
                    <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-medium"><UserCheck className="w-3 h-3" /> {prop.proposedBy}</span>
                  )}
                </div>

                <button
                  onClick={() => handleUpvote(prop.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 font-bold text-xs transition-all active:scale-95"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{prop.upvotes} Upvotes</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Citizen Budget Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold">Propose Citizen Budget Request</h3>
              </div>
              <button onClick={() => setShowProposalModal(false)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCitizenProposalSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Project Idea Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ward 4 Solar Street Lighting"
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Target Department / Focus Area</label>
                <select
                  value={proposalDept}
                  onChange={(e) => setProposalDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Energy & Environment">Energy & Environment</option>
                  <option value="Infrastructure & Transit">Infrastructure & Transit</option>
                  <option value="Public Works & Engineering">Public Works & Engineering</option>
                  <option value="Parks, Health & Recreation">Parks, Health & Recreation</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Requested Funding Amount ($ USD)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 450000"
                  value={proposalAmount}
                  onChange={(e) => setProposalAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Anonymous Checkbox Toggle */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <input
                  type="checkbox"
                  id="propAnon"
                  checked={proposalAnon}
                  onChange={(e) => setProposalAnon(e.target.checked)}
                  className="rounded border-neutral-400 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="propAnon" className="cursor-pointer font-medium">
                  Submit anonymously (hides your name from proposal registry)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProposalModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Official Budget Allocation Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-500" />
                <h3 className="text-base font-bold">Post Official Budget Allocation</h3>
              </div>
              <button onClick={() => setShowPostModal(false)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePostBudget} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Environmental Health & Sanitation"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Allocated Budget Amount ($ USD)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 7500000"
                  value={newAllocation}
                  onChange={(e) => setNewAllocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <p>Posting as: <strong>{user?.fullName} ({user?.role})</strong></p>
                <p className="text-[10px] mt-0.5">This entry will be recorded in Snowflake DB table `BUDGETS`.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-sm"
                >
                  Publish Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
