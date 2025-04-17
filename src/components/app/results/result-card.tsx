import { format } from "date-fns";
import { ExternalLink, MapPin, DollarSign, Clock } from "lucide-react";
import { type Match } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  match: Match;
  onMarkAsViewed: (id: string) => Promise<void>;
}

export function ResultCard({ match, onMarkAsViewed }: ResultCardProps) {
  const formattedDate = format(new Date(match.created_at), "PPP");

  return (
    <Card className={cn(
      "transition-all hover:shadow-md",
      match.is_read && 'opacity-75', !match.is_read && "ring-2 ring-primary/20"
    )}>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <span className="line-clamp-1">{match.title}</span>
                {!match.is_read && (
                  <HoverCard openDelay={200} closeDelay={100}>
                    <HoverCardTrigger>
                      <Badge
                        variant="default"
                        onClick={() => onMarkAsViewed(match.id)}
                        className="cursor-pointer transition-colors hover:bg-primary/90"
                        role="button"
                        aria-label="Mark as read"
                      >
                        New
                      </Badge>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-48">
                      <p className="text-sm">Click to mark as read</p>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </CardTitle>
              <div className="flex items-center gap-1 text-xl font-bold text-primary">
                <DollarSign className="h-5 w-5" aria-hidden="true" />
                <span>{match.price}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <span>{match.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <time dateTime={match.created_at}>
                  Posted {formattedDate}
                </time>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto transition-colors hover:bg-primary hover:text-primary-foreground" 
            asChild
          >
            <a 
              href={match.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
              View on Craigslist
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
