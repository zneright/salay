import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  CheckCircle, 
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

interface DepartmentSpending {
  name: string;
  allocated: number;
  spent: number;
  projectsCount: number;
  status: 'Healthy' | 'Warning' | 'Critical';
}

export const Analytics: React.FC = () => {
  const departments: DepartmentSpending[] = [
    { name: 'Education & Schools', allocated: 18000000.00, spent: 12400000.00, projectsCount: 5, status: 'Healthy' },
    { name: 'Public Safety (Police & Fire)', allocated: 12000000.00, spent: 8100000.00, projectsCount: 3, status: 'Healthy' },
    { name: 'Infrastructure & Roadways', allocated: 10000000.00, spent: 9500000.00, projectsCount: 3, status: 'Critical' },
    { name: 'Parks, Health & Recreation', allocated: 5000000.00, spent: 3200000.00, projectsCount: 1, status: 'Warning' },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = (status: DepartmentSpending['status']) => {
    switch (status) {
      case 'Healthy': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Warning': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Critical': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* 1. Page Header */}
      <div>
        <h1 className="text-[40px] font-bold tracking-tight text-foreground leading-none">Municipal Analytics</h1>
        <p className="text-[13px] text-muted-foreground mt-2">
          Structured audits of budgets, spending, and timeline delays powered by Snowpark pipelines.
        </p>
      </div>

      {/* 2. Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Fiscal Year', value: 'FY-2026', desc: 'Approved Oct 2025', icon: Activity },
          { label: 'Approved Budget Outlay', value: '$45,000,000', desc: 'Across 4 Major Divisions', icon: DollarSign },
          { label: 'Realized Expenditures', value: '$33,200,000', desc: '73.7% allocation utilized', icon: TrendingUp }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-3 hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex justify-between items-center text-muted-foreground">
                <span className="text-[10px] uppercase font-bold tracking-wider">{stat.label}</span>
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-[10px] text-muted-foreground">{stat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* 3. Budget Health Section */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-bold text-foreground">Budget Health Registry</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Realized expenditure ratios compared to raw allocations.</p>
        </div>

        <div className="space-y-5">
          {departments.map((dept, idx) => {
            const spentPercentage = Math.round((dept.spent / dept.allocated) * 100);
            return (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground">{dept.name}</span>
                  <span className="text-muted-foreground">{spentPercentage}% spent ({formatCurrency(dept.spent)} / {formatCurrency(dept.allocated)})</span>
                </div>
                <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      spentPercentage > 90 ? 'bg-rose-500' : spentPercentage > 75 ? 'bg-amber-500' : 'bg-primary'
                    }`} 
                    style={{ width: `${spentPercentage}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Project Health & Department Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Department Comparison Table (7/12 cols) */}
        <div className="lg:col-span-7 bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-foreground">Department Comparison</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Summary of project densities and risk status indicators.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-foreground">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground text-[10px] font-bold tracking-wider">
                  <th className="pb-3 font-semibold">Department</th>
                  <th className="pb-3 text-center font-semibold">Projects</th>
                  <th className="pb-3 text-right font-semibold">Spent Outlay</th>
                  <th className="pb-3 text-right font-semibold">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium">
                {departments.map((d, idx) => (
                  <tr key={idx} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-3.5 font-bold text-foreground">{d.name}</td>
                    <td className="py-3.5 text-center font-mono text-muted-foreground">{d.projectsCount}</td>
                    <td className="py-3.5 text-right font-mono text-muted-foreground">{formatCurrency(d.spent)}</td>
                    <td className="py-3.5 text-right">
                      <span className={`text-[8px] font-bold border px-1.5 py-0.5 rounded-full ${getStatusBadge(d.status)}`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Health Indicators (5/12 cols) */}
        <div className="lg:col-span-5 bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-foreground">Project Health Timeline</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Timeline delay indexes for municipal contracts.</p>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            <div className="p-3 border border-border bg-secondary/30 rounded-xl flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground font-mono">PRJ-1024 Transit Line</span>
                <h4 className="text-foreground font-bold">Line-C Expansion</h4>
              </div>
              <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Completed
              </span>
            </div>

            <div className="p-3 border border-border bg-secondary/30 rounded-xl flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground font-mono">PRJ-9904 Safety Works</span>
                <h4 className="text-foreground font-bold">Maple Street Bridge</h4>
              </div>
              <span className="text-[9px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                Delayed (+14w)
              </span>
            </div>

            <div className="p-3 border border-border bg-secondary/30 rounded-xl flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground font-mono">PRJ-8812 Solar Retrofit</span>
                <h4 className="text-foreground font-bold">Oakridge Solar System</h4>
              </div>
              <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                In Progress
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. AI Insights & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Snowflake Cortex AI Insights (Left side) */}
        <div className="bg-card border border-primary/20 p-6 rounded-2xl shadow-sm space-y-4 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center space-x-2 text-[10px] text-primary font-bold font-mono tracking-wider">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span>✨ Cortex AI Outlay Insights</span>
          </div>

          <div className="text-xs text-muted-foreground leading-relaxed space-y-3">
            <p>
              "An analysis of the **Infrastructure & Roadways** spent profile reveals that **₱9.5M** of the allocated ₱10.0M (95%) has been consumed, while project progress stands at only **42%**. This represents a severe resource-to-deliverables mismatch."
            </p>
            <p>
              "Cortex recommends auditing Maple Street contractor milestones and compiling invoice sheets from raw stages directories."
            </p>
          </div>
        </div>

        {/* Recommendations list (Right side) */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4 text-left">
          <div className="flex items-center space-x-2 text-[10px] text-primary font-bold font-mono tracking-wider">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Audit Action Items</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-foreground">Initiate Maple Bridge contractor query</h4>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Audit lag causes for the 14-week reconstruction delay.</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 border-t border-border/40 pt-3.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-foreground">Approve transit expansion funding wrap</h4>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Verify transit Line-C final invoices totals for staging copy.</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 border-t border-border/40 pt-3.5">
              <ArrowUpRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-foreground">Reallocate District 3 surplus</h4>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Move ₱150,000.00 unused solar reserves to utilities valve works.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
export default Analytics;
