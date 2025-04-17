"use client";

import { useState } from "react";
import { useMatches } from "@/hooks/use-matches";
import { toast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ResultsHeader } from "@/components/app/results/results-header";
import { ResultCard } from "@/components/app/results/result-card";
import { NoResults } from "@/components/app/results/no-results";
import { type Match } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function ResultsList() {
  const { matches, loading, markAsViewed } = useMatches();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/cron/check-listings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to refresh listings');
      }

      // Refresh matches list
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for matches to be processed
      window.location.reload(); // Refresh the page to show new matches
    } catch (error) {
      console.error('Error refreshing listings:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to refresh listings',
        variant: 'destructive',
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkAsViewed = async (matchId: string) => {
    await markAsViewed(matchId);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-[200px]" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
          </CardContent>
        </Card>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-[300px]" />
                  <Skeleton className="h-6 w-[100px]" />
                </div>
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <ResultsHeader onRefresh={handleRefresh} refreshing={refreshing} />
        </CardContent>
      </Card>

      {refreshing && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Refreshing listings... This may take a few moments.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {matches.map((match) => (
          <ResultCard
            key={match.id}
            match={match}
            onMarkAsViewed={handleMarkAsViewed}
          />
        ))}

        {matches.length === 0 && !refreshing && <NoResults />}
      </div>
    </div>
  );
}
