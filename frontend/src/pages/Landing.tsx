import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Search, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Database,
  HelpCircle,
  TrendingUp,
  UserCheck

} from 'lucide-react';
import { Navbar } from '../components/ui/Navbar';

export const Landing: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does SALAY access municipal records?',
      a: 'SALAY ingests public PDFs, civic budgets ledgers, and complaints streams into Snowflake Stages. Snowflake pipelines automatically structure and index the data for query optimization.'
    },
    {
      q: 'What is the role of Snowflake Cortex AI?',
      a: 'Cortex AI handles secure, LLM-powered semantic parsing directly inside Snowflake, compiling natural language citizen questions into exact project and spending answers with zero external data exposure.'
    },
    {
      q: 'Who can use the platform?',
      a: 'Citizens look up public projects. Officials monitor budget spending. Auditors query timeline logs. All stakeholders consume structured views suited for their permissions.'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Sticky Header Navbar */}
      <Navbar />

      {/* 1. Hero Section (Above the Fold) */}
      <section className="relative px-6 py-24 md:py-36 overflow-hidden border-b border-neutral-900">
        {/* Glow grid mesh background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-neutral-900/40 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-[10px] font-semibold text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1" />
            V1.0 - Active for Snowflake CoCo CLI Hackathon 2026
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none">
            Ask Questions About Government Projects. <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-neutral-100 to-neutral-500 bg-clip-text text-transparent">
              Get Instant AI Answers.
            </span>
          </h1>

          <p className="text-sm md:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            SALAY is the AI-native civic transparency engine. Ask questions about municipal budgets, project delays, and citizen feedback in plain English—powered by the Snowflake AI Data Cloud.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/demo"
              className="w-full sm:w-auto px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs rounded-md shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>Try Interactive Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 border border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-neutral-300 hover:text-neutral-100 font-semibold text-xs rounded-md transition-all active:scale-95"
            >
              Sign Up for Access
            </Link>
          </div>
        </div>
      </section>

      {/* 2. The "Ah-Ha!" Moment Comparison */}
      <section className="px-6 py-20 border-b border-neutral-900 max-w-7xl w-full mx-auto">
        <div className="text-center space-y-3 pb-12">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Stop digging through 500-page audit reports.</h2>
          <p className="text-xs text-neutral-400">Let Cortex AI summarize and extract insights for you instantly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: Messy PDF */}
          <div className="border border-neutral-900 bg-neutral-950/40 rounded-xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">The Old Way</span>
              <h3 className="text-xs font-semibold text-neutral-300">Unstructured Document Scapes</h3>
            </div>
            
            <div className="font-mono text-[9px] text-neutral-600 bg-neutral-900/30 p-4 border border-neutral-900 rounded-md overflow-x-auto leading-normal">
              {"SECTION 14.1B - MUNICIPAL CAPITAL OUTLAY REGISTRY 2025\n"}
              {"[PDF Pages 128-443] ... allocated under sub-article 4 to Energy projects ... \n"}
              {"budget code 8812-441-A: $1,250,000 to solar conversions ... \n"}
              {"Status: Incomplete as of audit review cycle 4 (Mar 2026) ... \n"}
              {"Contractor delay logs reported under appendix B-9 ..."}
            </div>
            <p className="text-[10px] text-neutral-500">Requires manual audit searches, matching codes, and reading tables.</p>
          </div>

          {/* Right: SALAY AI Chat */}
          <div className="border border-neutral-900 bg-neutral-950/40 rounded-xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">The SALAY Way</span>
              <h3 className="text-xs font-semibold text-neutral-300">Semantic Natural Language Responses</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-[10px] bg-neutral-900 text-neutral-300 px-3 py-1.5 rounded border border-neutral-850 w-fit self-end">
                <span>"What is the status of the Oakridge solar project?"</span>
              </div>
              <div className="flex items-start space-x-2 text-[10px] bg-neutral-950 border border-neutral-900 p-3 rounded-lg text-neutral-200">
                <Cpu className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p>The **Oakridge High School Solar Retrofit** (PRJ-8812) has an allocated budget of **$1,250,000.00**. It is currently In Progress (68% complete) with timelines ending in Nov 2026.</p>
              </div>
            </div>
            <p className="text-[10px] text-neutral-400">Instant extraction using secure Cortex LLM search endpoints.</p>
          </div>
        </div>
      </section>

      {/* 3. The Live Dashboard CSS Preview */}
      <section className="px-6 py-20 border-b border-neutral-900 max-w-7xl w-full mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold tracking-tight">Interactive Platform Preview</h2>
          <p className="text-xs text-neutral-400">Auditable budgets and progress charts updated dynamically.</p>
        </div>

        {/* CSS Mockup Browser card */}
        <div className="w-full max-w-4xl mx-auto border border-neutral-900 bg-neutral-950 rounded-xl overflow-hidden shadow-2xl">
          {/* Header controls */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-900 bg-neutral-900/35">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
            </div>
            <span className="text-[10px] font-mono text-neutral-500">salay.ai/dashboard</span>
            <div className="w-10" />
          </div>

          {/* Internal Dashboard body preview */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-neutral-950 text-left">
            {/* Sidebar list mock */}
            <div className="col-span-1 space-y-3.5 border-r border-neutral-900 pr-6">
              <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-500">Navigation</span>
              <div className="space-y-1">
                {['Dashboard', 'Analytics', 'AI Chat', 'Feedback', 'Settings'].map((item, idx) => (
                  <div key={idx} className={`px-3 py-2 rounded text-[10px] font-semibold flex items-center space-x-2 ${idx === 0 ? 'bg-neutral-900 text-neutral-100' : 'text-neutral-500'}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Core charts mock */}
            <div className="col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-neutral-900 rounded-lg space-y-2">
                  <span className="text-[9px] text-neutral-500 uppercase font-bold">Total Budget</span>
                  <div className="text-lg font-bold">$45.0M</div>
                </div>
                <div className="p-4 border border-neutral-900 rounded-lg space-y-2">
                  <span className="text-[9px] text-neutral-500 uppercase font-bold">Spent to Date</span>
                  <div className="text-lg font-bold text-emerald-500">$33.2M</div>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-3 border border-neutral-900 p-4 rounded-lg">
                <span className="text-[9px] text-neutral-400 font-bold block mb-1">Oakridge Solar conversion</span>
                <div className="flex justify-between text-[10px] text-neutral-400">
                  <span>Status: In Progress</span>
                  <span>68% Complete</span>
                </div>
                <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-neutral-800">
                  <div className="bg-neutral-300 h-full w-[68%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bento Box Feature Grid */}
      <section id="features" className="px-6 py-20 border-b border-neutral-900 max-w-7xl w-full mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold tracking-tight">Interactive Feature Grid</h2>
          <p className="text-xs text-neutral-400">Engineered with high performance and accessibility.</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Box 1 (Wide): Agentic Orchestration */}
          <div className="md:col-span-2 border border-neutral-900 bg-neutral-950/60 p-6 rounded-xl flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg w-fit">
                <Cpu className="w-4 h-4 text-neutral-300" />
              </div>
              <h3 className="text-sm font-bold">Agentic Orchestration (CoCo CLI)</h3>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
                Automatically triggers data pipeline syncs, ingests public works PDF files, and alerts auditors on municipal overspends using Snowflake CLI tasks.
              </p>
            </div>
            <div className="font-mono text-[9px] text-neutral-500 bg-neutral-900/40 p-3 rounded border border-neutral-900 w-fit">
              $ snow connection test && snow stage copy
            </div>
          </div>

          {/* Box 2 (Square): RAG Search */}
          <div className="md:col-span-1 border border-neutral-900 bg-neutral-950/60 p-6 rounded-xl flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg w-fit">
                <Search className="w-4 h-4 text-neutral-300" />
              </div>
              <h3 className="text-sm font-bold">Cortex RAG Search</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Queries structured budget records and unstructured citizen complaints concurrently.
              </p>
            </div>
            <span className="text-[10px] text-neutral-500">Auto confidence scoring indicators</span>
          </div>

          {/* Box 3 (Tall): Role-Based Access */}
          <div className="md:col-span-1 border border-neutral-900 bg-neutral-950/60 p-6 rounded-xl flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg w-fit">
                <UserCheck className="w-4 h-4 text-neutral-300" />
              </div>
              <h3 className="text-sm font-bold">Role-Based Access</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Tailored dashboard view configurations for Citizens, Government Officials, Auditors, and Administrators.
              </p>
            </div>
            <span className="text-[10px] text-neutral-500">Mock Auth gateway mapped</span>
          </div>

          {/* Additional Features boxes */}
          <div className="md:col-span-2 border border-neutral-900 bg-neutral-950/60 p-6 rounded-xl flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg w-fit">
                <ShieldCheck className="w-4 h-4 text-neutral-300" />
              </div>
              <h3 className="text-sm font-bold">Citizen Incident Validation</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Forms validated with Zod, preventing garbage data ingestion. Reports are geotagged and compiled directly into table registries.
              </p>
            </div>
            <span className="text-[10px] text-emerald-500 font-semibold flex items-center space-x-1">
              <span>Security schemas configured</span>
            </span>
          </div>
        </div>
      </section>

      {/* 5. Snowflake Technologies Used Ribbon */}
      <section id="technology" className="px-6 py-16 border-b border-neutral-900 bg-neutral-950/45 w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-1.5 max-w-xs text-center md:text-left">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Engine Integration</h3>
            <h4 className="text-sm font-bold text-neutral-200">Powered by Snowflake Data Cloud</h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl">
            {[
              { title: 'Cortex AI', desc: 'Secure LLM Completion', icon: Cpu },
              { title: 'Snowpark', desc: 'Transformations Pipelines', icon: Layers },
              { title: 'Snowflake SQL', desc: 'Stages & Tables Storing', icon: Database },
              { title: 'CoCo CLI', desc: 'Command Automations', icon: TrendingUp }
            ].map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div key={idx} className="flex items-start space-x-3 p-3 bg-neutral-950 border border-neutral-900 rounded-lg">
                  <Icon className="w-4 h-4 text-neutral-300 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold block text-neutral-200">{tech.title}</span>
                    <span className="text-[9px] text-neutral-500">{tech.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section id="faq" className="px-6 py-20 border-b border-neutral-900 max-w-4xl w-full mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs text-neutral-400">Everything you need to know about the SALAY engine.</p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center px-5 py-4 text-xs font-semibold text-neutral-200 hover:text-neutral-100 text-left focus:outline-none"
              >
                <span>{faq.q}</span>
                <HelpCircle className="w-4 h-4 text-neutral-500" />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-4 text-xs text-neutral-400 border-t border-neutral-900/50 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. Call To Action (CTA) */}
      <section className="px-6 py-24 text-center border-b border-neutral-900 relative overflow-hidden bg-gradient-to-b from-neutral-950 to-background">
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Ready to audit your municipality?</h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
            Instantly boot pre-made persona dashboards or sign up to register. Connect Snowflake Cortex search pipelines with zero setup configurations.
          </p>
          <div className="pt-2">
            <Link
              to="/demo"
              className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs rounded-md shadow-lg transition-all active:scale-95 inline-flex items-center space-x-2"
            >
              <span>Explore Demo Environment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Technology Footer */}
      <footer className="px-6 py-12 bg-neutral-950 text-neutral-500 text-center border-t border-neutral-900 space-y-4">
        <p className="text-[10px] font-medium tracking-wide">
          Built with Snowflake Cortex • Snowpark • CoCo CLI • FastAPI • React 19 • Tailwind CSS • TypeScript • TanStack Query
        </p>
        <p className="text-[9px] text-neutral-600">
          Built for the Snowflake CoCo CLI Hackathon 2026. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
export default Landing;
