"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AlertsTable } from "@/components/app/alerts/alerts-table";
import { ResultsList } from "@/components/app/results-list";
import { Sidebar } from "@/components/app/sidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAlerts } from "@/hooks/use-alerts";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SearchForm } from "@/components/app/search-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { alerts } = useAlerts();

  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Your Alerts</h1>
              <p className="text-muted-foreground">
                Monitor Craigslist listings across multiple cities
              </p>
            </div>
            <HoverCard openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="transition-all hover:shadow-md">
                      <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                      New Alert
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <SearchForm
                      onSuccess={() => {
                        const closeButton = document.querySelector('[data-dialog-close]');
                        if (closeButton instanceof HTMLElement) {
                          closeButton.click();
                        }
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </HoverCardTrigger>
              <HoverCardContent className="w-64">
                <p className="text-sm">Create a new alert to monitor Craigslist listings</p>
              </HoverCardContent>
            </HoverCard>
          </div>

          <Separator className="my-6" />

          {alerts?.length === 0 ? (
            <Card className="border-dashed">
              <CardHeader className="space-y-4 text-center">
                <CardTitle>No Alerts Yet</CardTitle>
                <CardDescription className="mx-auto max-w-sm">
                  Create your first alert to start monitoring Craigslist listings across multiple cities
                </CardDescription>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg" 
                      className="mx-auto mt-2 transition-all hover:shadow-md"
                    >
                      <PlusCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                      Create Your First Alert
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <SearchForm
                      onSuccess={() => {
                        const closeButton = document.querySelector('[data-dialog-close]');
                        if (closeButton instanceof HTMLElement) {
                          closeButton.click();
                        }
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </CardHeader>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Alerts</CardTitle>
                  <CardDescription>
                    Manage and monitor your active Craigslist alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertsTable />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Latest Results</CardTitle>
                  <CardDescription>
                    Recent matches from your active alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResultsList />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>
    </DashboardLayout>
  );
}
