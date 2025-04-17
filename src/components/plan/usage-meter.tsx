import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import Link from 'next/link';

interface UsageMeterProps {
  label: string;
  current: number;
  limit: number;
  type: 'alerts' | 'cities' | 'results';
}

export function UsageMeter({ label, current, limit, type }: UsageMeterProps) {
  const progress = (current / limit) * 100;
  const isNearLimit = current >= limit * 0.8;
  const isAtLimit = current >= limit;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-700">{label}</div>
        <div className="text-sm text-slate-600">
          {current} of {limit} {type}
        </div>
      </div>
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
        <Progress
          value={progress}
          className={
            isAtLimit
              ? 'bg-red-500'
              : isNearLimit
              ? 'bg-amber-500'
              : 'bg-primary'
          }
        />
      </div>
      {(isNearLimit || isAtLimit) && (
        <div
          className={`p-3 rounded-lg ${
            isAtLimit ? 'bg-red-50' : 'bg-amber-50'
          }`}
        >
          <div className="flex items-start space-x-3">
            <Crown
              className={`w-5 h-5 mt-0.5 ${
                isAtLimit ? 'text-red-500' : 'text-amber-500'
              }`}
            />
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  isAtLimit ? 'text-red-800' : 'text-amber-800'
                }`}
              >
                {isAtLimit
                  ? `You've reached your ${type} limit`
                  : `You're almost at your ${type} limit`}
              </p>
              <p
                className={`text-sm ${
                  isAtLimit ? 'text-red-600' : 'text-amber-600'
                } mt-1`}
              >
                Upgrade to Pro for{' '}
                {type === 'alerts'
                  ? 'unlimited alerts'
                  : type === 'cities'
                  ? 'up to 10 cities per alert'
                  : 'up to 100 results per alert'}
                .
              </p>
              <Link href="/app/upgrade" className="inline-block mt-2">
                <Button
                  size="sm"
                  variant={isAtLimit ? 'destructive' : 'default'}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
