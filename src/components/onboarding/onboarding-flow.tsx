import { motion } from 'framer-motion';
import { Bell, Search, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ElementType;
}

const steps: OnboardingStep[] = [
  {
    title: 'Set up your first alert',
    description: 'Create your first search alert to start monitoring Craigslist listings.',
    icon: Bell,
  },
  {
    title: 'Configure search preferences',
    description: 'Customize your search criteria and notification settings.',
    icon: Search,
  },
  {
    title: 'Review your settings',
    description: 'Make sure everything is set up according to your preferences.',
    icon: Settings,
  },
];

interface OnboardingFlowProps {
  onComplete?: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Craigslist Alert Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full',
                      index === currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>
                );
              })}
            </div>
            <div className="mb-6">
              <Progress value={progress} />
            </div>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-2">{steps[currentStep].title}</h3>
              <p className="text-muted-foreground mb-6">{steps[currentStep].description}</p>
              <div className="flex justify-between">
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
                    } else if (onComplete) {
                      onComplete();
                    }
                  }}
                >
                  {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      <div className="mt-8 flex justify-center gap-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-2 w-2 rounded-full',
              index === currentStep
                ? 'bg-primary'
                : index < currentStep
                ? 'bg-primary/30'
                : 'bg-muted'
            )}
          />
        ))}
      </div>
    </div>
  );
}
