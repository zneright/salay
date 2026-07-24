import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { showToast } from '../components/ui/Toast';
import { AuthLayout } from '../layouts/AuthLayout';
import { 
  User, 
  Building, 
  ShieldCheck, 
  GraduationCap,
  ArrowRight,
  MapPin,
  CheckCircle2,
  LayoutDashboard
} from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { updateOnboarding } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'Citizen' | 'Government Official' | 'Auditor' | 'Administrator'>('Citizen');
  const [municipality, setMunicipality] = useState('');

  const rolesList = [
    { value: 'Citizen' as const, label: 'Citizen Observer', desc: 'Queries public projects, budgets summaries, and submits feedback.', icon: User },
    { value: 'Government Official' as const, label: 'Government Official', desc: 'Monitors division spent margins and oversees ticket lines.', icon: Building },
    { value: 'Auditor' as const, label: 'Accountability Auditor', desc: 'Conducts audits checks, checks delay logs, and verifies anomalies.', icon: ShieldCheck },
    { value: 'Administrator' as const, label: 'System Admin', desc: 'Maintains LLM search registries and monitors settings status logs.', icon: GraduationCap },
  ];

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const org = municipality || 'Metro City Civic Council';
    updateOnboarding(role, org);
    showToast('Profile configuration complete!', 'success');
    navigate('/dashboard');
  };

  const handleSkip = () => {
    updateOnboarding(role || 'Citizen', 'Metro City Civic Council');
    navigate('/dashboard');
  };

  return (
    <AuthLayout>
      <div className="space-y-6 text-left font-semibold">
        {/* Step indicators */}
        <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
          <span>Step {step} of 2</span>
          <span>{step === 1 ? 'Select Role Profile' : 'Configure Organization'}</span>
        </div>

        {/* Step 1: Select Role */}
        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-white">How will you use SALAY?</h2>
              <p className="text-[10px] text-neutral-400">Select a stakeholder profile below to customize your dashboard views.</p>
            </div>

            <div className="space-y-2.5">
              {rolesList.map((item) => {
                const Icon = item.icon;
                const isSelected = role === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setRole(item.value)}
                    className={`w-full text-left p-3.5 border rounded-xl transition-all flex items-start space-x-3.5 ${
                      isSelected 
                        ? 'border-sky-500 bg-sky-500/10 text-sky-400' 
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold block">{item.label}</span>
                      <span className="text-[10px] text-neutral-400 leading-normal">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Step 2: Configure Municipality */
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-white">Municipal Scope Setup</h2>
              <p className="text-[10px] text-neutral-400">Associate your account with a target municipality region.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400">Municipality / Organization</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    placeholder="e.g. Metro City Civic Council"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-xs text-white outline-none focus:border-sky-500 placeholder-neutral-600"
                  />
                </div>
              </div>

              <div className="p-3.5 border border-neutral-800 bg-neutral-900/40 rounded-xl flex items-start space-x-2.5 text-[10px] text-neutral-400 leading-normal">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p>This links your workspace filters to that specific geographic boundary records by default. You can adjust this later inside settings.</p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800 gap-2">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="text-[10px] text-neutral-400 hover:text-white font-semibold px-3 py-2"
            >
              Back
            </button>
          ) : (
            <button
              onClick={handleSkip}
              className="text-[10px] text-neutral-400 hover:text-sky-400 font-semibold px-3 py-2 flex items-center gap-1"
            >
              <LayoutDashboard className="w-3 h-3" />
              <span>Skip to Dashboard</span>
            </button>
          )}

          <button
            onClick={handleNext}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5 active:scale-95 shadow-sm ml-auto"
          >
            <span>{step === 1 ? 'Continue' : 'Finish Setup'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
export default Onboarding;
