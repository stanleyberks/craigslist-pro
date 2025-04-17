import { useRouter } from 'next/navigation';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { plans, type PlanType } from "@/config/pricing";

interface UpgradePromptProps {
  currentPlan: PlanType;
}

export function UpgradePrompt({ currentPlan }: UpgradePromptProps) {
  const router = useRouter();
  
  // Determine next tier
  const nextTier = currentPlan === 'free' ? 'starter' : 
                  currentPlan === 'starter' ? 'pro' : 'business';
  
  const currentPlanDetails = plans[currentPlan];
  const nextPlanDetails = plans[nextTier];

  return (
    <Alert>
      <AlertTitle>Upgrade to {nextPlanDetails.name}</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="space-y-2">
          <p>
            You&apos;re currently on the {currentPlanDetails.name} plan with:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>{currentPlanDetails.limits.alerts_count === -1 ? 'Unlimited alerts' : `${currentPlanDetails.limits.alerts_count} alerts`}</li>
            <li>{currentPlanDetails.limits.results_per_alert} results per alert</li>
            <li>{currentPlanDetails.limits.history_days} days of history</li>
            <li>{Math.round(currentPlanDetails.limits.refresh_rate / 60)} minute refresh rate</li>
          </ul>
          
          <p className="font-medium mt-4">
            Upgrade to {nextPlanDetails.name} for:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>{nextPlanDetails.limits.alerts_count === -1 ? 'Unlimited alerts' : `${nextPlanDetails.limits.alerts_count} alerts`}</li>
            <li>{nextPlanDetails.limits.results_per_alert} results per alert</li>
            <li>{nextPlanDetails.limits.history_days} days of history</li>
            <li>{Math.round(nextPlanDetails.limits.refresh_rate / 60)} minute refresh rate</li>
          </ul>

          <div className="mt-4">
            <Button 
              onClick={() => router.push('/app/settings/subscription')}
              variant="default"
            >
              Upgrade Now for ${nextPlanDetails.price}/month
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
