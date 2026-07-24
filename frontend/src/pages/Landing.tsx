import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Layers, 
  Cpu, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  ChevronRight,
  Activity,
  Zap,
  Play
} from 'lucide-react';
import { Navbar } from '../components/ui/Navbar';
import { SnowflakeBadge } from '../components/ui/SnowflakeBadge';
import { useAuth } from '../providers/AuthProvider';

export const Landing: React.FC = () => {
  const { loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<number>(0);
  const [activePersona, setActivePersona] = useState<'citizen' | 'auditor' | 'official' | 'admin'>('auditor');

  const handleLaunchDemo = (roleName: 'Auditor' | 'Government Official' | 'Citizen' | 'Administrator' = 'Auditor') => {
    loginAsDemo(roleName);
    navigate('/dashboard');
  };

  const demoQueries = [
    {
      q: 'Which infrastructure projects exceeded their allocated budget in 2025?',
      response: 'Based on the **Municipal Budget Outlay Registry 2025**, the **Metro Manila Flood Control Pumping Station Phase 3** (Contract ID: `DPWH-24C00088`) has exceeded its phase allocation by **₱45,200,000.00** due to unaccounted pile driving variations.',
      project: 'Metro Manila Flood Control Phase 3',
      contractId: 'DPWH-24C00088',
      budget: '₱350,000,000.00',
      status: 'Over Budget',
      confidence: '98.4%',
      sql: 'SELECT contract_id, title, budget_php, variance FROM CIVIC_TRANSPARENCY_DB.PUBLIC.PROJECTS WHERE variance > 0;'
    },
    {
      q: 'Show delayed road construction projects in Davao Bypass Tunnel project.',
      response: 'The **Davao City Bypass Construction Project** (`DPWH-23CSX012`) reports a **14-week timeline delay** caused by right-of-way geological stability revisions.',
      project: 'Davao City Bypass Tunnel',
      contractId: 'DPWH-23CSX012',
      budget: '₱1,200,000,000.00',
      status: 'Delayed 14 Weeks',
      confidence: '99.1%',
      sql: 'SELECT project_name, delay_weeks, cause FROM CIVIC_TRANSPARENCY_DB.PUBLIC.CONTRACTS WHERE delay_weeks > 8;'
    },
    {
      q: 'Summarize citizens feedback reports regarding Bataan-Cavite Interlink Bridge.',
      response: 'Retrieved **142 citizen complaints** from Snowflake Stage `CITIZEN_FEEDBACK_STAGE`. Primary concerns center on local fisherfolk access routes and environmental mitigation compliance.',
      project: 'Bataan-Cavite Interlink Bridge',
      contractId: 'DPWH-24Z00001',
      budget: '₱175,000,000.00',
      status: 'Under Review',
      confidence: '97.8%',
      sql: 'SELECT COUNT(*), category FROM CIVIC_TRANSPARENCY_DB.PUBLIC.FEEDBACK GROUP BY category;'
    }
  ];

  const personas = {
    citizen: {
      title: 'For Concerned Citizens',
      desc: 'Look up municipal spending in plain English without needing legal or accounting expertise.',
      highlights: ['Search local infrastructure budgets', 'Submit verifiable flag reports', 'Track project completion timelines']
    },
    auditor: {
      title: 'For Independent Auditors',
      desc: 'Inspect raw PDF contracts with Cortex LLM parsing, SQL query verification, and line-item proofs.',
      highlights: ['Inspect raw PDF contract proofs', 'Verify SQL query execution in Snowflake', 'Audit variance and price escalation']
    },
    official: {
      title: 'For Public Officials',
      desc: 'Monitor department allocations in real-time with automated CoCo CLI status reports and alerts.',
      highlights: ['Real-time budget outlay dashboards', 'Automated CoCo CLI status tracking', 'Cross-department expenditure summaries']
    },
    admin: {
      title: 'For System Administrators',
      desc: 'Full governance control over Snowflake CoCo CLI agents, database schemas, and Cortex LLM pipelines.',
      highlights: ['Manage Snowflake stages & CoCo agent pipelines', 'Control user roles and audit permissions', 'Monitor sub-millisecond query performance']
    }
  };

  const faqs = [
    {
      q: 'How does SALAY access municipal records?',
      a: 'SALAY ingests public contract PDFs, civic budget ledgers, and citizen feedback streams into Snowflake Stages. Snowflake pipelines automatically structure and index the data for instant query optimization.'
    },
    {
      q: 'What is the role of Snowflake Cortex AI?',
      a: 'Cortex AI handles secure, LLM-powered semantic parsing directly inside Snowflake (using llama3-70b and llama3.1-405b), compiling natural language citizen questions into exact project and spending answers with zero external data exposure.'
    },
    {
      q: 'Can I test the platform without a live Snowflake account?',
      a: 'Yes! SALAY includes an automated Zero-Downtime Offline Fallback mode. You can test the full end-to-end experience, PDF parsing engine, and CoCo CLI interface immediately.'
    },
    {
      q: 'Who can use the platform?',
      a: 'Citizens look up public projects. Public officials monitor budget spending. Auditors query timeline logs and PDF proof documents. All stakeholders consume structured views suited for their permissions.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-300 selection:bg-sky-500 selection:text-white">
      {/* Sticky Header Navbar */}
      <Navbar />

      {/* 1. Hero Section (Above the Fold) */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 overflow-hidden border-b border-neutral-200 dark:border-neutral-900">
        {/* Glow grid mesh background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.08)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-80" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-sky-600/20 via-cyan-500/10 to-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10 pt-12 pb-16">
          {/* Top Badge Pill */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 bg-neutral-100 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 rounded-full text-xs font-semibold text-neutral-700 dark:text-neutral-300 shadow-sm backdrop-blur-md">
            <img src="/logo.png" alt="SALAY Logo" className="w-5 h-5 object-contain" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-0.5" />
            <span className="bg-gradient-to-r from-sky-600 to-cyan-500 dark:from-sky-400 dark:to-cyan-300 bg-clip-text text-transparent font-bold">
              Snowflake CoCo CLI Hackathon 2026
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-neutral-900 dark:text-white max-w-4xl mx-auto">
            Make Public Spending <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 dark:from-sky-400 dark:via-cyan-300 dark:to-emerald-400 bg-clip-text text-transparent">
              Transparent with AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal">
            SALAY turns dense government PDF contracts, public works ledgers, and municipal budgets into searchable intelligence powered by <strong className="text-neutral-900 dark:text-neutral-200">Snowflake Cortex AI</strong>.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleLaunchDemo('Auditor')}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-500 dark:via-teal-500 dark:to-cyan-500 hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all active:scale-95 flex items-center justify-center space-x-2.5"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Instant Demo Access (No Sign-Up)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleLaunchDemo('Government Official')}
              className="w-full sm:w-auto px-7 py-3.5 border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/90 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <Play className="w-3.5 h-3.5 text-sky-500 fill-sky-500" />
              <span>Launch Official Persona</span>
            </button>
          </div>

          {/* Ephemeral Sandbox Mode Notice */}
          <div className="pt-2">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 rounded-xl text-[11px] font-mono text-neutral-600 dark:text-neutral-400 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span><strong className="text-amber-600 dark:text-amber-300 font-bold">Ephemeral Demo Mode:</strong> Test PDF uploads, complaints & projects freely. All demo actions run in memory and reset on browser session end.</span>
            </div>
          </div>
        </div>

        {/* Floating App Preview Showcase */}
        <div className="w-full max-w-4xl mx-auto relative z-10 -mb-16 hidden lg:block">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800/80 px-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-bold text-neutral-800 dark:text-neutral-200">salay-platform.snowflake.app</span>
              </div>
              <SnowflakeBadge variant="status" label="Cortex Llama-3-70B Active" size="sm" />
            </div>
            <div className="grid grid-cols-3 gap-3 pt-4 text-left">
              <div className="p-3.5 bg-neutral-50 dark:bg-neutral-950/80 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                <p className="text-[10px] text-neutral-500 font-mono uppercase">Audited Expenditure</p>
                <p className="text-lg font-black text-sky-600 dark:text-sky-400">₱4,250,000,000</p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                  <TrendingUp className="w-3 h-3" /> 142 Contracts Synced
                </span>
              </div>
              <div className="p-3.5 bg-neutral-50 dark:bg-neutral-950/80 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                <p className="text-[10px] text-neutral-500 font-mono uppercase">Cortex Confidence</p>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">98.8%</p>
                <span className="text-[10px] text-neutral-600 dark:text-neutral-400 flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3 h-3 text-sky-500" /> Vector Proof Verified
                </span>
              </div>
              <div className="p-3.5 bg-neutral-50 dark:bg-neutral-950/80 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                <p className="text-[10px] text-neutral-500 font-mono uppercase">CoCo CLI Agent</p>
                <p className="text-lg font-black text-cyan-600 dark:text-cyan-400">0ms Latency</p>
                <span className="text-[10px] text-neutral-600 dark:text-neutral-400 flex items-center gap-1 mt-1">
                  <Activity className="w-3 h-3 text-cyan-500" /> Snowpark Stages Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Cortex AI Search Playground (id="features") */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto w-full text-center border-b border-neutral-200 dark:border-neutral-900 scroll-mt-20">
        <div className="space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Cortex Playground</span>
          </div>
          <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">Natural Language Civic Queries</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
            Click any query below to test how Snowflake Cortex AI extracts insights from contract PDFs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
          {/* Left Column: Sample Trigger Buttons */}
          <div className="lg:col-span-5 space-y-3 flex flex-col justify-center">
            {demoQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPrompt(idx)}
                className={`p-4 border rounded-2xl transition-all text-left flex items-center justify-between group ${
                  selectedPrompt === idx
                    ? 'bg-neutral-100 dark:bg-neutral-900 border-sky-500 shadow-md text-neutral-900 dark:text-white'
                    : 'bg-neutral-50 dark:bg-neutral-950/60 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 uppercase font-bold">Query #{idx + 1}</span>
                  <p className="text-xs font-semibold leading-snug">{item.q}</p>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedPrompt === idx ? 'text-sky-500 translate-x-1' : 'text-neutral-400'}`} />
              </button>
            ))}
          </div>

          {/* Right Column: Dynamic AI Response Output Card */}
          <div className="lg:col-span-7 p-6 border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 rounded-2xl shadow-xl space-y-5 backdrop-blur-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-neutral-200 dark:border-neutral-800 text-xs font-mono">
                <span className="flex items-center space-x-2 font-bold text-sky-600 dark:text-sky-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Snowflake Cortex AI Output</span>
                </span>
                <span className="flex items-center space-x-2 text-neutral-500">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{demoQueries[selectedPrompt].confidence} Confidence</span>
                </span>
              </div>

              <div className="p-4 bg-neutral-50 dark:bg-neutral-950/80 border border-neutral-200 dark:border-neutral-800/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span>Project: <strong className="text-neutral-900 dark:text-white">{demoQueries[selectedPrompt].project}</strong></span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {demoQueries[selectedPrompt].status}
                  </span>
                </div>
                <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans pt-1">
                  {demoQueries[selectedPrompt].response}
                </p>
              </div>

              {/* SQL Code Block Preview */}
              <div className="p-3 bg-neutral-900 text-neutral-100 rounded-xl space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-[10px] text-neutral-400 font-bold uppercase">
                  <span>Generated Snowflake SQL</span>
                  <span className="text-sky-400">Snowpark Engine</span>
                </div>
                <code className="text-cyan-300 block truncate">{demoQueries[selectedPrompt].sql}</code>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <span>Model: Cortex Llama-3-70B</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PDF Contract Proof Verified
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Role-Based Stakeholder Value */}
      <section className="py-24 px-6 max-w-6xl mx-auto w-full text-center border-b border-neutral-200 dark:border-neutral-900">
        <div className="space-y-3 mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">Multi-Stakeholder Platform</span>
          <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">Built For Citizens, Auditors, Officials & Admins</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
            Switch between personas to see how SALAY empowers different roles in civic transparency.
          </p>
        </div>

        {/* Persona Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {(['citizen', 'auditor', 'official', 'admin'] as const).map((persona) => (
            <button
              key={persona}
              onClick={() => setActivePersona(persona)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                activePersona === persona
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {persona} Persona
            </button>
          ))}
        </div>

        {/* Persona Card Showcase */}
        <div className="p-8 border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 rounded-3xl text-left max-w-3xl mx-auto space-y-6 shadow-xl backdrop-blur-xl">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{personas[activePersona].title}</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">{personas[activePersona].desc}</p>
          </div>

          <div className="space-y-3 pt-2">
            {personas[activePersona].highlights.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-3 text-xs text-neutral-700 dark:text-neutral-200">
                <div className="p-1 bg-sky-500/10 text-sky-500 rounded-lg border border-sky-500/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[10px] font-mono text-neutral-500">🔒 Ephemeral Demo Mode — Session Reset On Exit</span>
            <button
              onClick={() => {
                const roleMap: Record<string, 'Citizen' | 'Auditor' | 'Government Official' | 'Administrator'> = {
                  citizen: 'Citizen',
                  auditor: 'Auditor',
                  official: 'Government Official',
                  admin: 'Administrator'
                };
                handleLaunchDemo(roleMap[activePersona]);
              }}
              className="text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl transition-all shadow-md flex items-center space-x-1.5 active:scale-95"
            >
              <span>🚀 Launch Dashboard as {activePersona.toUpperCase()}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Snowflake Architecture Section (id="technology" and id="architecture") */}
      <section id="technology" className="py-24 px-6 max-w-6xl mx-auto w-full text-center border-b border-neutral-200 dark:border-neutral-900 scroll-mt-20">
        <div id="architecture" className="space-y-3 mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">Technical Architecture</span>
          <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">Snowflake CoCo & Cortex Pipeline</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
            From raw PDF contract ingestion to zero-latency AI search outputs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 rounded-2xl space-y-4 hover:border-sky-500/40 transition-all group">
            <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl w-fit text-sky-500 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">1. CoCo CLI Agent</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Automated CLI command scripts copy municipal records files securely to Snowflake stages via `/api/v1/cli/execute`.
            </p>
          </div>

          <div className="p-6 border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 rounded-2xl space-y-4 hover:border-sky-500/40 transition-all group">
            <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl w-fit text-sky-500 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">2. Snowpark Stages</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Raw contract text buffers are parsed into structured database tables inside `CIVIC_TRANSPARENCY_DB`.
            </p>
          </div>

          <div className="p-6 border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 rounded-2xl space-y-4 hover:border-sky-500/40 transition-all group">
            <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl w-fit text-sky-500 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">3. Cortex AI Search</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Snowflake Cortex LLM executes natural language queries with sub-millisecond response caching.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FAQs Accordion (id="faq") */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto w-full text-left scroll-mt-20">
        <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 rounded-2xl overflow-hidden backdrop-blur-sm"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-4 flex justify-between items-center text-xs font-semibold text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors text-left"
              >
                <span>{faq.q}</span>
                <span className="text-sky-500 font-bold text-sm">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-4 pt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-200 dark:border-neutral-800/80">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. Premium Footer */}
      <footer className="py-12 px-6 border-t border-neutral-200 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-950 text-xs text-neutral-500 select-none">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2.5">
            <img src="/logo.png" alt="SALAY Logo" className="w-6 h-6 object-contain" />
            <span className="font-extrabold text-neutral-900 dark:text-white tracking-tight">SALAY Transparency Engine</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
            <Link to="/demo" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Demo Center</Link>
            <a href="#technology" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Technology</a>
            <Link to="/coco-agent" className="text-sky-600 dark:text-sky-400 hover:underline">CoCo Agent CLI</Link>
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">Snowflake Online</span>
          </div>
          <p className="text-[10px] font-mono text-neutral-500">
            © 2026 SALAY. Snowflake Hackathon Submission.
          </p>
        </div>
      </footer>
    </div>
  );
};
export default Landing;
