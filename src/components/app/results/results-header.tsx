import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

interface ResultsHeaderProps {
  onRefresh: () => Promise<void>;
  refreshing: boolean;
}

export function ResultsHeader({ onRefresh, refreshing }: ResultsHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Search Results</h2>
        <p className="text-sm text-muted-foreground">
          Latest matches from your alerts
        </p>
      </div>
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={refreshing}
            className={cn(
              "transition-all",
              refreshing && "animate-pulse"
            )}
            aria-label={refreshing ? "Refreshing results" : "Refresh results"}
          >
            {refreshing ? (
              <LoadingSpinner className="mr-2 h-4 w-4" aria-hidden="true" />
            ) : (
              <RefreshCw 
                className={cn(
                  "mr-2 h-4 w-4 transition-transform",
                  "hover:rotate-180"
                )} 
                aria-hidden="true" 
              />
            )}
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-64">
          <p className="text-sm">
            {refreshing
              ? "Checking for new matches from your alerts..."
              : "Check for new matches from your alerts"}
          </p>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
