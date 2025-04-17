import { useState } from 'react';
import { useRouter } from 'next/router';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@supabase/auth-helpers-react';
import {
  Check,
  Zap,
  Bell,
  Search,
  Mail,
  Shield,
  Globe,
  Clock,
  Crown,
} from 'lucide-react';

const features = [
  {
    title: 'Unlimited Alerts',
    description: 'Create as many search alerts as you need',
    icon: Bell,
    free: '3 alerts',
    pro: 'Unlimited',
  },
  {
    title: 'Cities per Alert',
    description: 'Search across multiple cities simultaneously',
    icon: Globe,
    free: '2 cities',
    pro: '10 cities',
  },
  {
    title: 'Results per Alert',
    description: 'See more matching listings for each alert',
    icon: Search,
    free: '5 results',
    pro: '100 results',
  },
  {
    title: 'Email Digests',
    description: 'Get daily or weekly email summaries',
    icon: Mail,
    free: false,
    pro: true,
  },
  {
    title: 'Advanced Spam Filter',
    description: 'Enhanced protection against spam and duplicates',
    icon: Shield,
    free: 'Basic',
    pro: 'Advanced',
  },
  {
    title: 'Real-time Updates',
    description: 'Get notified as soon as new listings appear',
    icon: Clock,
    free: '1 hour delay',
    pro: 'Instant',
  },
];

const testimonials = [
  {
    quote: "I found my dream apartment in 2 days using the multi-city search. It's a game changer!",
    author: "Sarah M.",
    role: "Apartment Hunter",
  },
  {
    quote: "The spam filter alone is worth the upgrade. No more wasting time on fake listings.",
    author: "Mike R.",
    role: "Car Dealer",
  },
  {
    quote: "Being able to search across multiple cities helped me find the best deals for my business.",
    author: "David L.",
    role: "Small Business Owner",
  },
];

export default function UpgradePage() {
  const router = useRouter();
  const { toast } = useToast();
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async (plan: 'pro' | 'enterprise') => {
    setIsLoading(true);
    try {
      // TODO: Implement Stripe checkout
      toast({
        title: 'Coming Soon',
        description: 'Payment processing will be available soon.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process upgrade. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Upgrade to Pro
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get unlimited alerts, more cities per search, and advanced features to
            find exactly what you're looking for.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Free Plan</CardTitle>
              <CardDescription>For occasional searches</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-slate-600">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature.title} className="flex items-start">
                    <feature.icon className="w-5 h-5 text-slate-400 mt-1 mr-3" />
                    <div>
                      <div className="font-medium">{feature.title}</div>
                      <div className="text-sm text-slate-600">
                        {typeof feature.free === 'boolean'
                          ? feature.free
                            ? 'Included'
                            : 'Not included'
                          : feature.free}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full mt-6"
                disabled
              >
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-primary-200 bg-primary-50">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm">
                Most Popular
              </span>
            </div>
            <CardHeader>
              <CardTitle>Pro Plan</CardTitle>
              <CardDescription>For power users</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$9</span>
                <span className="text-slate-600">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature.title} className="flex items-start">
                    <feature.icon className="w-5 h-5 text-primary-600 mt-1 mr-3" />
                    <div>
                      <div className="font-medium">{feature.title}</div>
                      <div className="text-sm text-slate-600">
                        {typeof feature.pro === 'boolean'
                          ? feature.pro
                            ? 'Included'
                            : 'Not included'
                          : feature.pro}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full mt-6"
                onClick={() => handleUpgrade('pro')}
                disabled={isLoading}
              >
                <Crown className="w-4 h-4 mr-2" />
                {isLoading ? 'Processing...' : 'Upgrade to Pro'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Why upgrade to Pro?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.slice(0, 3).map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-lg border border-slate-200"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-600 mb-4">{feature.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <div className="w-20 font-medium">Free:</div>
                    <div className="text-slate-600">
                      {typeof feature.free === 'boolean'
                        ? feature.free
                          ? 'Yes'
                          : 'No'
                        : feature.free}
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-20 font-medium">Pro:</div>
                    <div className="text-primary-600 font-medium">
                      {typeof feature.pro === 'boolean'
                        ? feature.pro
                          ? 'Yes'
                          : 'No'
                        : feature.pro}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            What our Pro users say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border border-slate-200"
              >
                <p className="text-slate-600 mb-4">"{testimonial.quote}"</p>
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-slate-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Section */}
        <div className="bg-slate-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need more?</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Our Enterprise plan includes unlimited cities, API access, and priority
            support. Perfect for businesses and power users.
          </p>
          <Button
            variant="outline"
            className="bg-transparent text-white hover:bg-white hover:text-slate-900"
            onClick={() => handleUpgrade('enterprise')}
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
