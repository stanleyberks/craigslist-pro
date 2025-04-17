import * as React from 'react';
import { Bell, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50',
        className
      )}
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {(action || secondaryAction) && (
        <div className="mt-6 flex gap-4">
          {action && (
            <Button onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Example usage:
export function NoAlertsState() {
  return (
    <EmptyState
      icon={<Bell className="h-10 w-10 text-muted-foreground" />}
      title="No alerts yet"
      description="Create your first alert to start tracking items on Craigslist. We'll notify you when we find matches."
      action={{
        label: 'Create Alert',
        onClick: () => {},
      }}
      secondaryAction={{
        label: 'Learn More',
        onClick: () => {},
      }}
    />
  );
}

export function NoResultsState() {
  return (
    <EmptyState
      icon={<Search className="h-10 w-10 text-muted-foreground" />}
      title="No matches found"
      description="We haven't found any items matching your alerts yet. We'll keep looking and notify you when we do."
      action={{
        label: 'Modify Alerts',
        onClick: () => {},
      }}
    />
  );
}

export function FirstTimeState() {
  return (
    <EmptyState
      icon={<Sparkles className="h-10 w-10 text-muted-foreground" />}
      title="Welcome to Craigslist Alert Pro!"
      description="Get started by creating your first alert. We'll help you find the best deals on Craigslist."
      action={{
        label: 'Start Tutorial',
        onClick: () => {},
      }}
      secondaryAction={{
        label: 'Skip Tutorial',
        onClick: () => {},
      }}
    />
  );
}
