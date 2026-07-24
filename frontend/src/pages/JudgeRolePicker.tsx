import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { UserProfile } from '../services/auth';
import { 
  ShieldCheck, 
  Building2, 
  Terminal, 
  Users, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Zap,
  Sun,
  Moon
} from 'lucide-react';
import { showToast } from '../components/ui/Toast';

export const DemoRolePicker: React.FC = () => {
  const { loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('salay_theme');
    const isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      localStorage.setItem('salay_theme', 'light');
      document.documentElement.classList.remove('dark');
    } else {
      setTheme('dark');
      localStorage.setItem('salay_theme', 'dark');
      document.documentElement.classList.add('dark');
    }
  };

  const handleSelectRole = (role: UserProfile['role']) => {
    loginAsDemo(role);
    showToast(`⚡ Welcome! Logged in as ${role} Demo Persona (Ephemeral Sandbox)`, 'success');
    navigate('/dashboard');
  };

  const personas = [
    {
      role: 'Auditor' as const,
      badge: 'Full Proof Access',
      icon: ShieldCheck,
      color: 'from-rose-500/10 via-amber-500/5 to-transparent border-rose-500/30 text-rose-500 dark:text-rose-400',
      btnBg: 'bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500',
      title: '🕵️ Independent Auditor Persona',
      desc: 'Inspect raw PDF contract line-items, verify high-risk budget anomalies, and audit generated Snowflake SQL queries.',
      features: [
        'High-variance budget anomaly alerts',
        'Line-item PDF contract proof inspector',
        'Snowflake SQL & Cortex vector search preview'
      ]
    },
    {
      role: 'Government Official' as const,
      badge: 'Department Outlays',
      icon: Building2,
      color: 'from-sky-500/10 via-cyan-500/5 to-transparent border-sky-500/30 text-sky-600 dark:text-sky-400',
      btnBg: 'bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500',
      title: '🏛️ Public Official Persona',
      desc: 'Monitor municipal department appropriations (DPWH, DOH, DOTr), outlay utilization rates, and pending approvals.',
      features: [
        'Department expenditure utilization bars',
        'Budget reallocation request queue',
        'Automated CoCo CLI status alerts'
      ]
    },
    {
      role: 'Administrator' as const,
      badge: 'Full System Control',
      icon: Terminal,
      color: 'from-amber-500/10 via-yellow-500/5 to-transparent border-amber-500/30 text-amber-600 dark:text-amber-400',
      btnBg: 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold',
      title: '⚡ System Administrator Persona',
      desc: 'Execute CoCo CLI Agent commands, monitor Snowflake DB schemas (`CIVIC_TRANSPARENCY_DB`), and view live pipeline logs.',
      features: [
        'Embedded CoCo CLI command suite (`coco status`, `coco audit`)',
        'Snowpark stage & Cortex model health monitor',
        'Live pipeline latency logs'
      ]
    },
    {
      role: 'Citizen' as const,
      badge: 'Public View',
      icon: Users,
      color: 'from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
      btnBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500',
      title: '👤 Concerned Citizen Persona',
      desc: 'Browse public infrastructure projects, ask Cortex AI questions in plain English, and report local incidents.',
      features: [
        'Public project matrix with photo proofs',
        'Plain English Cortex AI chat assistant',
        'Community incident reporting stream'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 p-6 md:p-12 flex flex-col items-center justify-between font-sans selection:bg-sky-500 selection:text-white transition-colors duration-300">
      {/* Background Glow */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.08)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-6xl flex items-center justify-between z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </Link>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="SALAY Logo" className="w-6 h-6 object-contain" />
            <span className="font-extrabold text-sm tracking-tight text-neutral-900 dark:text-white">SALAY</span>
            <span className="text-[10px] font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded">
              Snowflake Hackathon 2026
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl my-12 space-y-10 z-10 text-center">
        {/* Title Block */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full text-xs font-mono text-neutral-700 dark:text-neutral-300 shadow-sm">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span>Instant Demo Center • No Registration Required</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Select Your Live Demo Persona
          </h1>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Test SALAY as an Auditor, Official, Admin, or Citizen. All demo actions execute in an <strong className="text-neutral-900 dark:text-neutral-200">Ephemeral Session Sandbox</strong> and reset on exit.
          </p>
        </div>

        {/* 3-Step Demo Guide Banner */}
        <div className="p-5 bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 rounded-3xl text-left grid grid-cols-1 md:grid-cols-3 gap-4 text-xs backdrop-blur-xl shadow-lg">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs shrink-0">1</div>
            <div>
              <strong className="text-neutral-900 dark:text-white block font-semibold mb-0.5">Choose a Persona</strong>
              <span className="text-neutral-600 dark:text-neutral-400">Click any card below to launch directly into the dashboard as that role.</span>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs shrink-0">2</div>
            <div>
              <strong className="text-neutral-900 dark:text-white block font-semibold mb-0.5">Test All Features</strong>
              <span className="text-neutral-600 dark:text-neutral-400">Inspect PDF contract proofs, query Cortex AI, or run CoCo CLI commands.</span>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">3</div>
            <div>
              <strong className="text-neutral-900 dark:text-white block font-semibold mb-0.5">Take Guided Tour</strong>
              <span className="text-neutral-600 dark:text-neutral-400">Click "Take Demo Tour" in the top bar anytime for step-by-step highlights!</span>
            </div>
          </div>
        </div>

        {/* Persona Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {personas.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.role}
                className={`p-6 bg-white/80 dark:bg-neutral-900/80 border ${p.color} rounded-3xl shadow-xl flex flex-col justify-between space-y-6 hover:scale-[1.01] transition-all backdrop-blur-xl group`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-neutral-100 dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {p.badge}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{p.title}</h2>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mt-1">{p.desc}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800/80">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold">Key Capabilities:</span>
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-neutral-700 dark:text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSelectRole(p.role)}
                  className={`w-full py-3 px-4 text-xs font-bold rounded-2xl text-white shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 ${p.btnBg}`}
                >
                  <span>Launch Dashboard as {p.role}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-5xl text-center text-xs text-neutral-500 pt-6 border-t border-neutral-200 dark:border-neutral-900 font-mono z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>🔒 Ephemeral Demo Mode — Data is stored in memory and resets on session end.</span>
        <span>© 2026 SALAY. Snowflake Hackathon MVP.</span>
      </div>
    </div>
  );
};
export const JudgeRolePicker = DemoRolePicker;
export default DemoRolePicker;
