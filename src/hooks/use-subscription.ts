"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { plans, type PlanType, type SubscriptionLimits } from "@/config/pricing";

interface Subscription {
  id: string;
  user_id: string;
  plan_tier: PlanType;
  price: number;
  currency: string;
  billing_period: 'monthly' | 'yearly';
  started_at: string;
  expires_at: string | null;
  cancelled_at: string | null;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  next_billing_date: string | null;
  created_at: string;
  updated_at: string;
}

interface SubscriptionWithCount extends Subscription {
  alerts_count: number;
  limits: SubscriptionLimits;
  features: string[];
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionWithCount | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscription();

    const channel = supabase
      .channel('subscription-channel')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'subscriptions',
        },
        async (payload) => {
          // Get alerts count when subscription updates
          const { count: alertsCount } = await supabase
            .from('alerts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', payload.new.user_id);

          // Get subscription features
          const { data: features } = await supabase
            .from('subscription_features')
            .select('feature_name')
            .eq('plan_tier', payload.new.plan_tier);

          // Get subscription limits
          const { data: limits } = await supabase
            .from('subscription_limits')
            .select('*')
            .eq('plan_tier', payload.new.plan_tier)
            .single();

          const planTier = payload.new.plan_tier as PlanType;
          setSubscription({
            ...payload.new as Subscription,
            alerts_count: alertsCount || 0,
            limits: limits || plans[planTier].limits,
            features: features?.map(f => f.feature_name) || []
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchSubscription() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Get subscription data
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (subscriptionError) throw subscriptionError;

      // Get alerts count
      const { count: alertsCount, error: alertsError } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      if (alertsError) throw alertsError;

      // Get subscription features
      const { data: features } = await supabase
        .from('subscription_features')
        .select('feature_name')
        .eq('plan_tier', subscriptionData.plan_tier);

      // Get subscription limits
      const { data: limits } = await supabase
        .from('subscription_limits')
        .select('*')
        .eq('plan_tier', subscriptionData.plan_tier)
        .single();

      const planTier = subscriptionData.plan_tier as PlanType;
      // Combine the data
      const data = {
        ...subscriptionData,
        alerts_count: alertsCount || 0,
        limits: limits || plans[planTier].limits,
        features: features?.map(f => f.feature_name) || []
      };

      setSubscription(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch subscription details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    subscription,
    loading,
    // Helper functions to check plan limits
    canCreateAlert: () => {
      if (!subscription) return false;
      return subscription.limits.alerts_count === -1 || // unlimited
             subscription.alerts_count < subscription.limits.alerts_count;
    },
    getResultsLimit: () => subscription?.limits.results_per_alert || 0,
    getRefreshRate: () => subscription?.limits.refresh_rate || 1800, // 30 minutes default
    getHistoryDays: () => subscription?.limits.history_days || 7,
    hasFeature: (feature: string) => subscription?.features.includes(feature) || false,
    isPro: () => subscription?.plan_tier === 'pro',
    isBusiness: () => subscription?.plan_tier === 'business',
    isStarter: () => subscription?.plan_tier === 'starter',
    isFree: () => subscription?.plan_tier === 'free' || !subscription,
  };
}
