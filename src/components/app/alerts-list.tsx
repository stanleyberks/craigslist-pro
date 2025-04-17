"use client";

import * as React from "react";
import { useState } from "react";
import { categories } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Edit, Trash, Loader2 } from "lucide-react";
import { useAlerts } from "@/hooks/use-alerts";
import { useSubscription } from "@/hooks/use-subscription";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

import { Alert } from '@/types/alert';
import { Subscription } from '@/types/subscription';

export function AlertsList() {
  const { alerts, loading, deleteAlert } = useAlerts();
  const { subscription } = useSubscription() as { subscription: Subscription | null };
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  // Calculate alert usage
  const alertLimit = subscription?.alert_limit || 3; // Default to free tier
  const alertsUsed = alerts.length;
  const alertsRemaining = Math.max(0, alertLimit - alertsUsed);
  const usagePercentage = (alertsUsed / alertLimit) * 100;

  // Show upgrade prompt when close to limit
  React.useEffect(() => {
    if (usagePercentage >= 80 && !subscription?.plan_tier?.includes('pro')) {
      setShowUpgradePrompt(true);
    }
  }, [usagePercentage, subscription?.plan_tier]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteAlert(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Your Alerts</h2>
            <p className="text-sm text-muted-foreground">
              {alertsUsed} of {alertLimit} alerts used
            </p>
          </div>
          <Button
            disabled={alertsRemaining === 0}
            onClick={() => {
              if (alertsRemaining === 0) {
                toast({
                  title: "Alert Limit Reached",
                  description: "Upgrade your plan to create more alerts.",
                  variant: "destructive",
                });
                return;
              }
              // TODO: Implement new alert creation
            }}
          >
            <Bell className="mr-2 h-4 w-4" />
            New Alert
          </Button>
        </div>

        {showUpgradePrompt && (
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-lg">Upgrade Your Plan</CardTitle>
              <CardDescription>
                You're approaching your alert limit. Upgrade to our Pro plan for unlimited alerts
                and up to 100 results per alert.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="default" onClick={() => {
                // TODO: Implement upgrade flow
                toast({
                  title: "Coming Soon",
                  description: "Upgrade functionality will be available soon.",
                });
              }}>
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-4">
        {alerts.map((alert) => (
          <Card key={alert.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {alert.name}
                    {(alert.error_count || 0) > 0 ? (
                      <Badge variant="destructive" title={alert.last_error || 'Error occurred'}>
                        Error
                      </Badge>
                    ) : alert.is_active ? (
                      <Badge variant="default">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Paused
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Created on {format(new Date(alert.created_at), "PPP")}
                    {alert.last_check_at && (
                      <> · Last checked {format(new Date(alert.last_check_at), "Pp")}</>
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      // TODO: Implement edit functionality
                      toast({
                        title: "Coming Soon",
                        description: "Edit functionality will be available soon.",
                      });
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Alert</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this alert? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(alert.id)}
                          disabled={deletingId === alert.id}
                        >
                          {deletingId === alert.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Trash className="mr-2 h-4 w-4" />
                          )}
                          Delete
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div>
                  <span className="font-medium">Keywords: </span>
                  {alert.keywords ? (Array.isArray(alert.keywords) ? alert.keywords.join(", ") : alert.keywords) : "None"}
                </div>
                <div>
                  <span className="font-medium">Cities: </span>
                  {(alert.cities as string[]).join(", ")}
                </div>
                <div>
                  <span className="font-medium">Category: </span>
                  {categories.find(c => c.value === alert.category)?.label || alert.category}
                </div>
                {(alert.min_price !== undefined || alert.max_price !== undefined) && (
                  <div>
                    <span className="font-medium">Price Range: </span>
                    {alert.min_price !== undefined && alert.max_price !== undefined
                      ? `$${alert.min_price} - $${alert.max_price}`
                      : alert.min_price !== undefined
                      ? `$${alert.min_price}+`
                      : `Up to $${alert.max_price}`
                    }
                  </div>
                )}
                {(alert.error_count || 0) > 0 && alert.last_error && (
                  <div className="mt-2 text-sm text-destructive">
                    <span className="font-medium">Last Error: </span>
                    {alert.last_error}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {alerts.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No alerts yet</CardTitle>
              <CardDescription>
                Create your first alert to start monitoring Craigslist listings
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
