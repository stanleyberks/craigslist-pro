"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, RefreshCw, Loader2 } from "lucide-react";
import { useMatches } from "@/hooks/use-matches";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
export function ResultsList() {
    const { matches, loading, markAsViewed, markAllAsViewed } = useMatches();
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
        }
        catch (error) {
            console.error('Error refreshing listings:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to refresh listings',
                variant: 'destructive',
            });
        }
        finally {
            setRefreshing(false);
        }
    };
    const handleMarkAsViewed = async (matchId) => {
        await markAsViewed(matchId);
    };
    if (loading) {
        return (<div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin"/>
      </div>);
    }
    return (<div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Search Results</h2>
          <p className="text-sm text-muted-foreground">
            Latest matches from your alerts
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? (<Loader2 className="mr-2 h-4 w-4 animate-spin"/>) : (<RefreshCw className="mr-2 h-4 w-4"/>)}
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {matches.map((match) => {
            const listing = match;
            return (<Card key={match.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {listing.title}
                      {match.is_new && (<Badge variant="default" onClick={() => handleMarkAsViewed(match.id)} className="cursor-pointer">
                          New
                        </Badge>)}
                    </CardTitle>
                    <CardDescription>
                      {listing.location} · Posted {format(new Date(match.created_at), "PPP")}
                    </CardDescription>
                  </div>
                  <div className="text-xl font-bold">{listing.price}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {listing.description}
                  </p>
                  <Button variant="outline" className="w-full sm:w-auto" asChild>
                    <a href={listing.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4"/>
                      View on Craigslist
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>);
        })}

        {matches.length === 0 && (<Card>
            <CardHeader>
              <CardTitle>No results yet</CardTitle>
              <CardDescription>
                Create alerts to start receiving Craigslist matches
              </CardDescription>
            </CardHeader>
          </Card>)}
      </div>
    </div>);
}
