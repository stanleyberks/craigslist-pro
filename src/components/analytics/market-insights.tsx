import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart } from "@/components/ui/charts";
import { Badge } from "@/components/ui/badge";
import { SearchStats } from "@/lib/search/enhanced-filters";
import { formatCurrency } from "@/lib/utils";

interface MarketInsightsProps {
  stats: SearchStats;
  isLoading?: boolean;
}

export function MarketInsights({ stats, isLoading }: MarketInsightsProps) {
  if (isLoading) {
    return <div>Loading insights...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Price Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Price Trends</CardTitle>
          <CardDescription>
            Market average: {formatCurrency(stats.averagePrice)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            data={stats.marketInsights.priceHistory}
            xDataKey="date"
            yDataKey="avgPrice"
          />
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={stats.marketInsights.trend === 'up' ? 'default' : 'secondary'}>
              Trend: {stats.marketInsights.trend}
            </Badge>
            <Badge variant={stats.marketInsights.competition === 'high' ? 'destructive' : 'default'}>
              Competition: {stats.marketInsights.competition}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Popular Keywords */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Keywords</CardTitle>
          <CardDescription>
            Top terms in your search category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {stats.popularKeywords.map((keyword) => (
              <Badge key={keyword} variant="outline">
                {keyword}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Location Analysis</CardTitle>
          <CardDescription>
            Most active areas in your search
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            data={stats.topLocations.map((loc) => ({
              location: loc,
              count: Math.floor(Math.random() * 100), // Replace with actual data
            }))}
            xDataKey="location"
            yDataKey="count"
          />
        </CardContent>
      </Card>

      {/* Best Times */}
      <Card>
        <CardHeader>
          <CardTitle>Best Times to Search</CardTitle>
          <CardDescription>
            When new listings are most likely to appear
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.marketInsights.bestTimeToSearch.map((time) => (
              <div key={time} className="flex items-center justify-between">
                <span>{time}</span>
                <Badge variant="outline">High Activity</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
