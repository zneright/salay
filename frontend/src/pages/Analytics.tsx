import React from 'react';
import { PieChart, Sparkles } from 'lucide-react';

interface BudgetAllocation {
  department: string;
  allocated: number;
  spent: number;
}

export const Analytics: React.FC = () => {
  const allocations: BudgetAllocation[] = [
    { department: 'Education & Schools', allocated: 18000000.00, spent: 12400000.00 },
    { department: 'Public Safety (Police & Fire)', allocated: 12000000.00, spent: 8100000.00 },
    { department: 'Infrastructure & Roadways', allocated: 10000000.00, spent: 9500000.00 },
    { department: 'Parks, Health & Recreation', allocated: 5000000.00, spent: 3200000.00 },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Municipal Budget Analytics</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Visual breakdowns of city funds allocations and department usage limits.
        </p>
      </div>

      {/* Overview stats grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Fiscal Year', value: '2026', desc: 'Approved October 2025' },
          { label: 'Total Allocated Budget', value: '$45,000,000', desc: 'Across 4 Major Divisions' },
          { label: 'Overall Expenditures', value: '$33,200,000', desc: '73.7% allocated spent' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-neutral-950 border border-neutral-900 rounded-lg p-5 space-y-2">
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">{stat.label}</span>
            <div className="text-xl font-bold">{stat.value}</div>
            <p className="text-[10px] text-neutral-400">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Main Allocations List Mock Grid */}
      <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-neutral-900">
          <div className="flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-neutral-300" />
            <h2 className="text-sm font-bold text-neutral-200">Department Allocations & Expenditure</h2>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">FY-2026 Registry</span>
        </div>

        <div className="space-y-6">
          {allocations.map((item, idx) => {
            const spentPercentage = Math.round((item.spent / item.allocated) * 100);
            return (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-start text-xs">
                  <div>
                    <h4 className="font-semibold text-neutral-200">{item.department}</h4>
                    <p className="text-[10px] text-neutral-500 mt-0.5">
                      Spent: <span className="text-neutral-300">{formatCurrency(item.spent)}</span> of{' '}
                      <span className="text-neutral-400">{formatCurrency(item.allocated)}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-mono bg-neutral-900 text-neutral-300 px-2 py-0.5 border border-neutral-800 rounded">
                    {spentPercentage}% Spent
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-neutral-800/40">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      spentPercentage > 90 
                        ? 'bg-rose-500' 
                        : spentPercentage > 75 
                        ? 'bg-amber-500' 
                        : 'bg-neutral-300'
                    }`}
                    style={{ width: `${spentPercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Extra analysis box */}
      <div className="p-5 border border-neutral-900 bg-neutral-950/40 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-neutral-200 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
            <span>AI Budget Summarizer</span>
          </div>
          <p className="text-[10px] text-neutral-400 max-w-lg leading-relaxed">
            FastAPI integration ready. Next phases will connect Snowflake Cortex to summarize budget files and detect spend warnings automatically.
          </p>
        </div>
        <button className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[10px] font-semibold rounded-md text-neutral-200 shrink-0">
          Learn More
        </button>
      </div>
    </div>
  );
};
export default Analytics;
