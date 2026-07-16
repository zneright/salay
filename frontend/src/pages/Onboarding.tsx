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
  CheckCircle2
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

  return (
    <AuthLayout>
      <div className="space-y-6 text-left">
        {/* Step indicators */}
        <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono">
          <span>Step {step} of 2</span>
          <span>{step === 1 ? 'Select Role Profile' : 'Configure Organization'}</span>
        </div>

        {/* Step 1: Select Role */}
        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-neutral-200">How will you use SALAY?</h2>
              <p className="text-[10px] text-neutral-500">Select a stakeholder profile below to customize your dashboard views.</p>
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
                    className={`w-full text-left p-3.5 border rounded-lg transition-all flex items-start space-x-3.5 ${
                      isSelected 
                        ? 'border-neutral-100 bg-neutral-900 text-neutral-100' 
                        : 'border-neutral-900 hover:border-neutral-850 text-neutral-400 hover:text-neutral-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold block">{item.label}</span>
                      <span className="text-[10px] text-neutral-500 leading-normal">{item.desc}</span>
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
              <h2 className="text-sm font-bold text-neutral-200">Municipal Scope Setup</h2>
              <p className="text-[10px] text-neutral-500">Associate your account with a target municipality region.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400">Municipality / Organization</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    placeholder="e.g. Metro City Civic Council"
                    className="w-full bg-neutral-900 border border-neutral-850 rounded pl-10 pr-4 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-700 placeholder-neutral-600"
                  />
                </div>
              </div>

              <div className="p-3.5 border border-neutral-900 bg-neutral-900/20 rounded-lg flex items-start space-x-2.5 text-[10px] text-neutral-500 leading-normal">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p>This links your workspace filters to that specific geographic boundary records by default. You can adjust this later inside settings.</p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex justify-between items-center pt-4 border-t border-neutral-900">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="text-[10px] text-neutral-500 hover:text-neutral-300 font-semibold px-3 py-1.5"
            >
              Back
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-xs rounded transition-all flex items-center space-x-1.5 active:scale-95 shadow-md"
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
