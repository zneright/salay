import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Layers, 
  Cpu, 
  Database
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
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      {/* Sticky Header Navbar */}
      <Navbar />

      {/* 1. Hero Section (Above the Fold) */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden border-b border-border">
        {/* Glow grid mesh background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-75" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10 py-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-secondary border border-border rounded-full text-[10px] font-bold text-primary font-mono uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
            Ingested via Snowflake CoCo CLI
          </div>

          <h1 className="text-[40px] md:text-[64px] font-bold tracking-tight leading-none text-foreground select-none max-w-4xl mx-auto">
            Make Public Spending <br className="hidden md:inline" />
            <span className="text-primary">Transparent with AI</span>
          </h1>

          <p className="text-[16px] text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            SALAY transforms public spending logs, civic works registries, and citizen reports into queryable vector spaces using Snowflake Cortex. Fast, verifiable government audits.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="px-6 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl shadow-lg hover:shadow-primary/20 transition-all flex items-center space-x-2"
            >
              <span>Get Started & Register</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#architecture"
              className="px-6 py-3.5 border border-border bg-card hover:bg-secondary text-foreground font-semibold text-xs rounded-xl transition-all"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Floating Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground animate-bounce flex flex-col items-center text-[10px] font-mono tracking-widest uppercase">
          <span>Scroll to explore</span>
          <span className="text-xs mt-1">↓</span>
        </div>
      </section>

      {/* 2. Interactive AI Preview Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full text-center border-b border-border/60">
        <div className="space-y-4 mb-12">
          <span className="text-[10px] uppercase font-bold tracking-wider text-primary font-mono">Ask SALAY</span>
          <h2 className="text-[28px] font-bold text-foreground">Verifiable Cortex Search</h2>
          <p className="text-[13px] text-muted-foreground max-w-md mx-auto">
            Click one of the suggestions to see how Cortex structures query responses instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch text-left">
          {/* Sample input triggers */}
          <div className="space-y-3 flex flex-col justify-center">
            <div className="p-4 border border-border bg-card rounded-2xl flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Which infrastructure projects exceeded budget?</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="p-4 border border-border bg-card rounded-2xl flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Show delayed road projects in Ward 4.</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="p-4 border border-border bg-card rounded-2xl flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Summarize citizen complaints this month.</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* AI Response Card Identity */}
          <div className="p-6 border border-primary/20 bg-card rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border/40 text-[9px] text-muted-foreground font-mono">
              <span className="flex items-center space-x-1 font-bold text-primary">
                <span>✨</span> <span>AI Summary</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>🤖 Cortex Response</span>
                <span>•</span>
                <span className="text-emerald-500 font-bold">96% Conf.</span>
              </span>
            </div>
            <p className="text-xs text-foreground leading-relaxed">
              Based on the **Municipal Budget Outlay Registry 2025**, the **Maple Street Bridge Safety Reconstruction** (PRJ-9904) has exceeded its current phase allocation by **₱350,000.00** due to safety reinforcement costs. Staged records sync reports 14 weeks delay.
            </p>
            <div className="flex justify-between text-[9px] text-muted-foreground font-mono pt-2 border-t border-border/40">
              <span>Model: Llama-3-70b</span>
              <span>Sync status: Live</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Snowflake Tech Architecture Section */}
      <section id="architecture" className="py-20 px-6 max-w-5xl mx-auto w-full text-center border-b border-border/60">
        <div className="space-y-4 mb-16">
          <span className="text-[10px] uppercase font-bold tracking-wider text-primary font-mono">Ingestion Pipeline</span>
          <h2 className="text-[28px] font-bold text-foreground">Snowflake Ingestion Stack</h2>
          <p className="text-[13px] text-muted-foreground max-w-md mx-auto">
            From raw civic spreadsheets to semantic search layers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 border border-border bg-card rounded-2xl space-y-4">
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl w-fit text-primary">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-[20px] font-bold text-foreground">1. CoCo CLI</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Automated command scripts copy municipal records files securely to secure Snowflake stages.
            </p>
          </div>

          <div className="p-6 border border-border bg-card rounded-2xl space-y-4">
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl w-fit text-primary">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-[20px] font-bold text-foreground">2. Snowpark Stages</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Raw budgets CSV registries are transformed dynamically and parsed into secure, structured schemas.
            </p>
          </div>

          <div className="p-6 border border-border bg-card rounded-2xl space-y-4">
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl w-fit text-primary">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-[20px] font-bold text-foreground">3. Cortex AI</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Snowflake Cortex LLM maps natural queries directly to vector spaces with zero external model loops.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Testimonials (Fictional Municipality) */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full text-center border-b border-border/60">
        <div className="max-w-2xl mx-auto space-y-6">
          <p className="text-base md:text-xl text-foreground font-semibold italic leading-relaxed">
            "By deploying SALAY at the Auditor General Office, we compressed our municipal works timeline delay reviews from 12 days to 30 seconds. Snowflake Cortex verifies lead contractors timelines lag instantly."
          </p>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-foreground">Maria Santos</h4>
            <span className="text-[10px] text-muted-foreground uppercase font-mono">Lead Auditor, Municipality of Salay</span>
          </div>
        </div>
      </section>

      {/* 5. FAQs Accordion */}
      <section className="py-20 px-6 max-w-3xl mx-auto w-full text-left">
        <h2 className="text-[28px] font-bold text-foreground text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="border border-border bg-card rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-4 flex justify-between items-center text-xs font-semibold text-foreground hover:bg-secondary/40 transition-colors text-left"
              >
                <span>{faq.q}</span>
                <span className="text-muted-foreground">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/40">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. Footer (Notion style) */}
      <footer className="py-12 px-6 border-t border-border bg-card text-xs text-muted-foreground select-none">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="SALAY Logo" className="w-5 h-5 object-contain" />
            <span className="font-bold text-foreground tracking-tight">SALAY Transparency Engine</span>
          </div>
          <div className="flex space-x-6 text-[11px] font-medium">
            <Link to="/demo" className="hover:text-foreground">Demo Center</Link>
            <a href="#architecture" className="hover:text-foreground">Architecture</a>
            <span className="hover:text-foreground">FastAPI</span>
            <span className="hover:text-foreground font-mono text-[10px] text-emerald-500">Live Stages</span>
          </div>
          <p className="text-[10px] font-mono">
            © 2026 SALAY. Snowflake Hackathon MVP.
          </p>
        </div>
      </footer>
    </div>
  );
};
export default Landing;
