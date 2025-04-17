"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

import { Alert } from '@/types/alert';

type DatabaseAlert = {
  id: string;
  user_id: string;
  name: string;
  keywords: string;
  cities: string[];
  category: string;
  min_price: number | null;
  max_price: number | null;
  is_active: boolean;
  use_advanced_filter: boolean;
  created_at: string;
  updated_at: string;
  last_check_at: string | null;
  error_count: number;
  last_error: string | null;
  new_matches_count?: number;
};

function transformDatabaseAlert(alert: DatabaseAlert): Alert {
  return {
    ...alert,
    keywords: alert.keywords.split(',').map(k => k.trim()),
    min_price: alert.min_price ?? undefined,
    max_price: alert.max_price ?? undefined,
    last_check_at: alert.last_check_at ?? undefined,
    last_error: alert.last_error ?? undefined,
    error_count: alert.error_count ?? 0,
    use_advanced_filter: alert.use_advanced_filter ?? false
  };
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Initial fetch of alerts
    fetchAlerts();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('alerts-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAlerts((current) => [...current, transformDatabaseAlert(payload.new as DatabaseAlert)]);
          } else if (payload.eventType === 'DELETE') {
            setAlerts((current) =>
              current.filter((alert) => alert.id !== payload.old.id)
            );
          } else if (payload.eventType === 'UPDATE') {
            setAlerts((current) =>
              current.map((alert) =>
                alert.id === payload.new.id ? transformDatabaseAlert(payload.new as DatabaseAlert) : alert
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchAlerts() {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data.map(transformDatabaseAlert));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch alerts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function createAlert(alert: Omit<DatabaseAlert, 'id' | 'created_at' | 'updated_at' | 'last_check_at'>) {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .insert(alert)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      if (error.message.includes('Alert limit reached')) {
        toast({
          title: "Error",
          description: "You've reached your alert limit. Please upgrade your plan.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create alert",
          variant: "destructive",
        });
      }
      throw error;
    }
  }

  async function updateAlert(id: string, updates: Partial<DatabaseAlert>) {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update alert",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function deleteAlert(id: string) {
    try {
      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete alert",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function toggleAlert(id: string, isActive: boolean) {
    return updateAlert(id, { is_active: isActive });
  }

  return {
    alerts,
    loading,
    createAlert,
    updateAlert,
    deleteAlert,
    toggleAlert,
  };
}
