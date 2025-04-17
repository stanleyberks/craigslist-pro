"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { plans, type PlanType } from "@/config/pricing";
import { securityCheck, sanitizeInput } from "@/lib/security";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAlerts } from "@/hooks/use-alerts";
import { useSubscription } from "@/hooks/use-subscription";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { alertFormSchema, type AlertFormValues } from "@/lib/schemas/alert-schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  NameField,
  KeywordsField,
  CitiesField,
  CategoryField,
  PriceFields,
} from "./form-fields";

interface SearchFormProps {
  onSuccess?: () => void;
}

export function SearchForm({ onSuccess }: SearchFormProps): JSX.Element {
  const formStartTime = React.useRef(Date.now());
  const router = useRouter();
  const [showTutorial, setShowTutorial] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('alert_tutorial_shown') !== 'true';
    }
    return true;
  });
  const { createAlert } = useAlerts();
  const { subscription, canCreateAlert } = useSubscription();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentAlerts = subscription?.alerts_count || 0;
  const maxAlerts = subscription?.limits.alerts_count || 3;
  const alertsLeft = Math.max(0, maxAlerts - currentAlerts);

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      name: "",
      keywords: "",
      cities: [],
      category: "",
      min_price: null,
      max_price: null,
    },
  });

  async function onSubmit(values: AlertFormValues & { website?: string; email2?: string; _gotcha?: string }) {
    const formData = {
      formStartTime: formStartTime.current,
      honeypot: {
        website: values.website || '',
        email2: values.email2 || '',
        _gotcha: values._gotcha || ''
      },
      userAgent: window.navigator.userAgent,
      headers: new Headers(),
      ip: '' // Will be set by the server
    };

    try {
      await securityCheck(formData);
    } catch (error: any) {
      console.error('Security check failed:', error);
      toast({
        title: 'Error',
        description: 'Invalid form submission',
        variant: 'destructive',
      });
      return;
    }
    if (!canCreateAlert()) {
      const planType = subscription?.plan_tier || 'free';
      const nextTier = planType === 'free' ? 'starter' : 
                      planType === 'starter' ? 'pro' : 'business';
      toast({
        title: "Alert Limit Reached",
        description: `Upgrade to ${plans[nextTier].name} to create up to ${plans[nextTier].limits.alerts_count} alerts.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Clean up and sanitize keywords
      const cleanKeywords = sanitizeInput(values.keywords)
        .split(',')
        .map((k: string) => k.trim())
        .filter((k: string) => k.length > 0)
        .join(', ');

      // Normalize cities
      const response = await fetch('/api/cities/normalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cities: values.cities }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to normalize cities');
      }

      const { cities: normalizedCities } = await response.json();

      if (!normalizedCities?.length) {
        throw new Error('No valid cities found');
      }

      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Create alert in Supabase
      const { error: createError } = await createAlert({
        name: values.name,
        keywords: cleanKeywords,
        cities: normalizedCities,
        category: values.category,
        min_price: values.min_price,
        max_price: values.max_price,
        user_id: userId,
        is_active: true,
        error_count: 0,
        last_error: null,
        use_advanced_filter: false
      });

      if (createError) {
        throw createError;
      }

      toast({
        title: "Alert Created",
        description: `Your alert "${values.name}" has been created successfully.`,
      });

      // Reset form
      form.reset();

      // Call onSuccess callback if provided
      // Show tutorial toast if it's the user's first alert
      if (showTutorial) {
        toast({
          title: "What's Next?",
          description: "Your alert is now active. Head to the Results page to see matches as they come in.",
          action: <Button variant="link" size="sm" onClick={() => router.push('/app/results')}>View Results</Button>
        });
        localStorage.setItem('alert_tutorial_shown', 'true');
        setShowTutorial(false);
      }
      
      onSuccess?.();
      return true;
    } catch (error: any) {
      console.error('Error creating alert:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create alert",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  // Subscription info is already handled above

  return (
    <Card className="w-full max-w-2xl mx-auto relative">
      {alertsLeft > 0 && alertsLeft <= 3 && (
        <div className="absolute -top-12 left-0 right-0">
          <Alert>
            <AlertTitle>Almost at limit</AlertTitle>
            <AlertDescription>
              You have {alertsLeft} alert{alertsLeft === 1 ? '' : 's'} remaining in your {subscription?.plan_tier} plan.
              {subscription?.plan_tier === "business" && (
                <Button variant="link" className="p-0 h-auto" onClick={() => router.push('/app/settings/subscription')}>
                  Upgrade for more
                </Button>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}
      <CardHeader>
        <CardTitle>Create New Alert</CardTitle>
        <CardDescription>
          Set up a new alert to track listings matching your criteria.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!canCreateAlert() && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Alert Limit Reached</AlertTitle>
            <AlertDescription>
              You've reached your plan's alert limit. Upgrade to create more alerts.
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Honeypot fields - hidden from real users */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
              <input
                type="text"
                {...form.register('website')}
                tabIndex={-1}
                autoComplete="off"
              />
              <input
                type="email"
                {...form.register('email2')}
                tabIndex={-1}
                autoComplete="off"
              />
              <input
                type="text"
                {...form.register('_gotcha')}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <div className="space-y-6">
              <NameField form={form} />
              <KeywordsField form={form} />
              <div className="grid gap-6 sm:grid-cols-2">
                <CitiesField form={form} />
                <CategoryField form={form} />
              </div>
              <PriceFields form={form} />
            </div>
            <CardFooter className="px-0 pb-0">
              <Button 
                type="submit" 
                disabled={isSubmitting || !canCreateAlert()} 
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Alert...
                  </>
                ) : (
                  "Create Alert"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
