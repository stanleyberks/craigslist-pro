"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowUpDown } from "lucide-react";
import { ListingCard } from "./listing-card";
import { CraigslistListing, CategoryKey } from "@/lib/types";
import { useRealTimeAlerts } from "@/hooks/use-real-time-alerts";
import { useToast } from "@/components/ui/use-toast";
import { useSubscription } from "@/hooks/use-subscription";
import { supabase } from "@/lib/supabase";
import { plans, type PlanType } from "@/config/pricing";
import { UpgradePrompt } from "@/components/app/upgrade-prompt";

export function ResultsList() {
  const [results, setResults] = React.useState<CraigslistListing[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filters, setFilters] = React.useState({
    search: "",
    priceRange: "all",
    listingAge: "all",
    sortBy: "newest" as "newest" | "price-asc" | "price-desc",
  });
  const { subscription } = useSubscription();
  const { toast } = useToast();
  const [newItemIds, setNewItemIds] = React.useState<Set<string>>(new Set());
  const [showUpgradePrompt, setShowUpgradePrompt] = React.useState(false);

  // Function to mark all items as seen
  const markAllAsSeen = React.useCallback(() => {
    setNewItemIds(new Set());
  }, []);

  // Fetch initial results
  React.useEffect(() => {
    async function fetchResults() {
      try {
        const { data, error } = await supabase
          .from("matches")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(
            subscription?.limits?.results_per_alert || plans.free.limits.results_per_alert
          );

        if (error) throw error;

        const listings = data
          .map((match) => ({
            id: match.craigslist_id,
            url: match.url,
            title: match.title,
            description: match.post_content || undefined,
            price: match.price || undefined,
            datetime: match.datetime,
            location: match.location,
            thumbnail: match.pics?.[0],
            pics: match.pics || undefined,
            category: match.category as CategoryKey
          } as CraigslistListing))
          .filter(Boolean);
        
        // Show upgrade prompt if user could benefit from upgrading
        const currentLimit = subscription?.limits?.results_per_alert || plans.free.limits.results_per_alert;
        if (data.length >= currentLimit && subscription?.plan_tier !== 'business') {
          setShowUpgradePrompt(true);
        }
        setResults(listings);
      } catch (error) {
        console.error("Error fetching results:", error);
        toast({
          title: "Error",
          description: "Failed to fetch results",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [subscription?.plan_tier, toast]);

  // Subscribe to real-time updates
  useRealTimeAlerts({
    onNewMatch: (match) => {
      const listing: CraigslistListing = {
        id: match.craigslist_id,
        url: match.url,
        title: match.title,
        description: match.post_content || undefined,
        price: match.price || undefined,
        datetime: match.datetime,
        location: match.location,
        thumbnail: match.pics?.[0],
        pics: match.pics || undefined,
        category: match.category as CategoryKey
      };
      setResults((prev) => [listing, ...prev]);
      setNewItemIds((prev) => new Set(prev).add(listing.id));
    },
  });

  // Apply filters and sorting
  const filteredResults = React.useMemo(() => {
    // First apply filters
    const filtered = results.filter((listing) => {
      // Search filter
      if (
        filters.search &&
        !listing.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !listing.description?.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Price range filter
      if (filters.priceRange !== "all" && listing.price) {
        const price = parseFloat(listing.price.replace(/[^0-9.-]+/g, ""));
        switch (filters.priceRange) {
          case "under-100":
            if (price >= 100) return false;
            break;
          case "100-500":
            if (price < 100 || price > 500) return false;
            break;
          case "500-1000":
            if (price < 500 || price > 1000) return false;
            break;
          case "over-1000":
            if (price <= 1000) return false;
            break;
        }
      }

      // Listing age filter
      if (filters.listingAge !== "all") {
        const listingDate = new Date(listing.datetime);
        const now = new Date();
        const hoursDiff = (now.getTime() - listingDate.getTime()) / (1000 * 60 * 60);
        switch (filters.listingAge) {
          case "1h":
            if (hoursDiff > 1) return false;
            break;
          case "24h":
            if (hoursDiff > 24) return false;
            break;
          case "7d":
            if (hoursDiff > 168) return false;
            break;
        }
      }

      return true;
    });

    // Then apply sorting
    return filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-asc":
          return (parseFloat(a.price?.replace(/[^0-9.-]+/g, "") || "0") || 0) -
            (parseFloat(b.price?.replace(/[^0-9.-]+/g, "") || "0") || 0);
        case "price-desc":
          return (parseFloat(b.price?.replace(/[^0-9.-]+/g, "") || "0") || 0) -
            (parseFloat(a.price?.replace(/[^0-9.-]+/g, "") || "0") || 0);
        case "newest":
        default:
          return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
      }
    });
  }, [results, filters]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showUpgradePrompt && subscription?.plan_tier && (
        <div className="mb-6">
          <UpgradePrompt currentPlan={subscription.plan_tier} />
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          {newItemIds.size > 0 && (
            <button
              onClick={markAllAsSeen}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Mark all as seen
            </button>
          )}
        </div>
        {showUpgradePrompt && (
          <div className="bg-muted/50 text-muted-foreground rounded-lg p-4 text-sm flex items-center gap-4">
            <p>Upgrade to see more results (up to 100 with Pro plan)</p>
            <a
              href="/settings"
              className="text-primary hover:text-primary/90 font-medium"
            >
              Upgrade now →
            </a>
          </div>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search in titles and descriptions..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="price-range">Price Range</Label>
          <Select
            value={filters.priceRange}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, priceRange: value }))
            }
          >
            <SelectTrigger id="price-range">
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under-100">Under $100</SelectItem>
              <SelectItem value="100-500">$100 - $500</SelectItem>
              <SelectItem value="500-1000">$500 - $1000</SelectItem>
              <SelectItem value="over-1000">Over $1000</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="listing-age">Listing Age</Label>
          <Select
            value={filters.listingAge}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, listingAge: value }))
            }
          >
            <SelectTrigger id="listing-age">
              <SelectValue placeholder="Select listing age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="sort-by">Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value: typeof filters.sortBy) =>
              setFilters((prev) => ({ ...prev, sortBy: value }))
            }
          >
            <SelectTrigger id="sort-by">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No results found</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResults.map((listing) => (
            <HoverCard key={listing.id}>
              <HoverCardTrigger asChild>
                <div className="cursor-pointer">
                  <ListingCard
                    listing={listing}
                    isNew={newItemIds.has(listing.id)}
                  />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-4">
                  {listing.description && (
                    <p className="text-sm text-muted-foreground line-clamp-6">
                      {listing.description}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(listing.url, "_blank")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open on Craigslist
                  </Button>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      )}
    </div>
  );
}
