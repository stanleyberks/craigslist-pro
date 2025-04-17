import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { SearchForm } from '@/components/app/search-form';
import { AlertsList } from '@/components/app/alerts-list';
import { ResultsList } from '@/components/app/results-list';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@supabase/auth-helpers-react';
import { Crown, ArrowRight, Check } from 'lucide-react';
import { HTMLAttributes } from 'react';

interface OnboardingStep {
  title: string;
  description: string;
  component: React.ReactNode;
}

export function OnboardingWizard() {
  const router = useRouter();
  const { toast } = useToast();
  const user = useUser();
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      title: 'Create your first search',
      description: 'Start by setting up a search across multiple cities. This will help you find exactly what you\'re looking for.',
      component: (
        <div className="p-6 bg-white rounded-lg border border-slate-200">
          <SearchForm
            onSuccess={() => {
              toast({
                title: 'Search created',
                description: 'Your search has been saved as an alert.'
              });
              setCurrentStep(1);
            }}
          />
        </div>
      )
    },
    {
      title: 'View your alerts',
      description: 'Your search has been saved as an alert. You\'ll be notified when new matches are found.',
      component: (
        <div className="space-y-6">
          <AlertsList />
          <div className="p-6 bg-primary-50 rounded-lg border border-primary-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-primary-900">
                  Upgrade to Pro
                </h3>
                <p className="mt-1 text-primary-700">
                  Get unlimited alerts, more cities per alert, and advanced spam
                  filtering.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => router.push('/app/upgrade')}
                >
                  View Pro features
                </Button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Check your results',
      description: 'Here are the latest matches for your alert. We\'ve automatically filtered out spam and duplicate listings.',
      component: <ResultsList />
    },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Progress value={progress} />
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>Getting started</span>
          <span>{currentStep + 1} of {steps.length}</span>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {steps[currentStep].title}
          </h2>
          <p className="mt-2 text-slate-600">{steps[currentStep].description}</p>
        </div>

        <div>{steps[currentStep].component}</div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button
            onClick={() => {
              if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
              } else {
                router.push('/app');
              }
            }}
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Finish
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
