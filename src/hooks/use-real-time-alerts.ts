import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Match } from '@/lib/types';

interface UseRealTimeAlertsProps {
  onNewMatch?: (match: Match) => void;
}

export function useRealTimeAlerts({ onNewMatch }: UseRealTimeAlertsProps) {
  useEffect(() => {
    const channel = supabase
      .channel('alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches'
        },
        (payload) => {
          if (onNewMatch) {
            onNewMatch(payload.new as Match);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onNewMatch]);
}
