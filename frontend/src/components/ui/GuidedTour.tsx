import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { showToast } from './Toast';
import { ChevronRight, ChevronLeft, X, Sparkles } from 'lucide-react';

interface TourStep {
  title: string;
  content: string;
  targetPath?: string;
  actionRequired?: string;
}

export const GuidedTour: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleStartTour = () => {
      setIsOpen(true);
      setCurrentStep(0);
      showToast('Guided Tour Started! Follow steps on bottom left.', 'info');
    };

    window.addEventListener('start-guided-tour', handleStartTour);
    return () => window.removeEventListener('start-guided-tour', handleStartTour);
  }, []);

  const steps: TourStep[] = [
    {
      title: 'Welcome to SALAY Demo Tour',
      content: 'This guided tour will take you through the live Civic Transparency Engine. Click Next to begin.',
    },
    {
      title: 'Step 1: Sign Up & Choose Role',
      content: 'Navigate to the Register page to sign up with your chosen role (Citizen, Official, Auditor, Admin).',
      targetPath: '/register',
      actionRequired: 'Click Register Account or navigate to /register',
    },
    {
      title: 'Step 2: Role-Based Dashboard',
      content: `You are currently logged in as a ${user?.role || 'Guest'}. Notice that your dashboard widgets and personalization greeting are tailored to your role.`,
      targetPath: '/dashboard',
    },
    {
      title: 'Step 3: Cortex AI Q&A',
      content: 'Open the AI Chat panel. Click one of the suggested question chips to watch Cortex LLM summarize database records instantly.',
      targetPath: '/dashboard/chat',
    },
    {
      title: 'Step 4: Budget Analytics',
      content: 'Verify municipal expenditures under Analytics. (Note: Citizens are restricted from accessing detailed audits pages!).',
      targetPath: '/dashboard/analytics',
    },
    {
      title: 'Step 5: Citizen Feedback',
      content: 'Visit the Feedback section to file complaints or view public complaints. Validation ensures data cleanliness before indexing.',
      targetPath: '/dashboard/feedback',
    },
    {
      title: 'Step 6: Universal Shortcuts',
      content: 'Press CTRL + K to open the Command Palette. Search public projects, navigate paths, or switch roles immediately.',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      const target = steps[nextStep].targetPath;
      if (target && location.pathname !== target) {
        navigate(target);
        showToast(`Guided Tour: Navigated to ${steps[nextStep].title}`, 'info');
      }
    } else {
      setIsOpen(false);
      showToast('Guided Tour Completed! Enjoy auditing SALAY.', 'success');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      const target = steps[prevStep].targetPath;
      if (target && location.pathname !== target) {
        navigate(target);
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  const step = steps[currentStep];

  return (
    <div className="fixed bottom-6 left-6 z-50 w-80 bg-neutral-950 border border-neutral-800 rounded-xl p-5 shadow-2xl space-y-4 animate-slide-in text-left">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SALAY Guided Tour</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-neutral-500 hover:text-neutral-300 transition-colors"
          aria-label="Dismiss tour"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1.5">
        <h4 className="text-xs font-bold text-neutral-200">{step.title}</h4>
        <p className="text-[10px] text-neutral-400 leading-relaxed">{step.content}</p>
        {step.actionRequired && (
          <div className="text-[9px] text-emerald-500 font-medium bg-emerald-950/20 p-2 rounded border border-emerald-900/50 mt-2">
            Action: {step.actionRequired}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-neutral-900">
        <span className="text-[9px] text-neutral-600 font-mono">
          Step {currentStep + 1} of {steps.length}
        </span>
        <div className="flex items-center space-x-2">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="p-1 border border-neutral-850 bg-neutral-900 rounded text-neutral-400 hover:text-neutral-200"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleNext}
            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-[10px] rounded flex items-center space-x-1 transition-all active:scale-95"
          >
            <span>{currentStep === steps.length - 1 ? 'Finish' : 'Next'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default GuidedTour;
