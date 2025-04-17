import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchForm } from "@/components/app/search-form";
import { AlertsList } from "@/components/app/alerts-list";
import { ResultsList } from "@/components/app/results-list";
export default function DashboardPage() {
    return (<div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor Craigslist listings across multiple cities
        </p>
      </div>

      <Tabs defaultValue="search" className="space-y-4">
        <TabsList>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        <TabsContent value="search" className="space-y-4">
          <SearchForm />
        </TabsContent>
        <TabsContent value="alerts" className="space-y-4">
          <AlertsList />
        </TabsContent>
        <TabsContent value="results" className="space-y-4">
          <ResultsList />
        </TabsContent>
      </Tabs>
    </div>);
}
