"use client";

import { useEffect, useState } from "react";
import { supabase, type Match } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export function useMatches(alertId?: string) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Initial fetch of matches
    fetchMatches();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('matches-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: alertId ? `alert_id=eq.${alertId}` : undefined,
        },
        (payload) => {
          setMatches((current) => [payload.new as Match, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [alertId]);

  async function fetchMatches() {
    try {
      let query = supabase
        .from('matches')
        .select('*')
        .order('created_at', { ascending: false });

      if (alertId) {
        query = query.eq('alert_id', alertId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMatches(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch matches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function markAsViewed(matchId: string) {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ is_read: true })
        .eq('id', matchId);

      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark match as viewed",
        variant: "destructive",
      });
    }
  }

  async function markAllAsViewed(alertId?: string) {
    try {
      let query = supabase
        .from('matches')
        .update({ is_read: true });

      if (alertId) {
        query = query.eq('alert_id', alertId);
      }

      const { error } = await query;

      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark matches as viewed",
        variant: "destructive",
      });
    }
  }

  return {
    matches,
    loading,
    markAsViewed,
    markAllAsViewed,
  };
}
