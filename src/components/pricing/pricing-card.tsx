import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText?: string;
  onSelect: () => void;
}

interface PricingCardProps {
  tier: PricingTier;
}

export function PricingCard({ tier }: PricingCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md',
        tier.highlighted && 'border-primary shadow-md'
      )}
    >
      {tier.highlighted && (
        <div className="absolute -top-5 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
          Most Popular
        </div>
      )}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            {tier.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {tier.description}
          </p>
        </div>
        <div className="flex items-baseline text-3xl font-semibold">
          {tier.price}
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            /month
          </span>
        </div>
        <div className="space-y-4">
          <ul className="space-y-3 text-sm">
            {tier.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <Button
          onClick={tier.onSelect}
          className="w-full"
          variant={tier.highlighted ? 'default' : 'outline'}
        >
          {tier.buttonText || 'Get Started'}
        </Button>
      </div>
    </div>
  );
}

export function PricingSection() {
  const tiers: PricingTier[] = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for trying out the service',
      features: [
        '3 active alerts',
        'Basic email notifications',
        'Standard refresh rate',
        '7-day result history',
      ],
      onSelect: () => {},
    },
    {
      name: 'Pro',
      price: '$9',
      description: 'For power users who need more',
      features: [
        'Unlimited alerts',
        'Instant notifications',
        'Priority refresh rate',
        '30-day result history',
        'Advanced filters',
        'Price tracking',
        'Export data',
      ],
      highlighted: true,
      buttonText: 'Start Pro Trial',
      onSelect: () => {},
    },
    {
      name: 'Business',
      price: '$29',
      description: 'For teams and businesses',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'API access',
        'Custom integrations',
        'Priority support',
        'Analytics dashboard',
        '90-day result history',
      ],
      onSelect: () => {},
    },
  ];

  return (
    <div className="container py-20">
      <div className="mx-auto max-w-md text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the plan that's right for you and start finding the best deals on
          Craigslist today.
        </p>
      </div>
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          <PricingCard key={tier.name} tier={tier} />
        ))}
      </div>
      <div className="mt-12 text-center text-sm text-muted-foreground">
        All plans include a 14-day free trial. No credit card required.
      </div>
    </div>
  );
}
