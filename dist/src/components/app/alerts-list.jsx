"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Edit, Trash, Loader2 } from "lucide-react";
import { useAlerts } from "@/hooks/use-alerts";
import { useSubscription } from "@/hooks/use-subscription";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
export function AlertsList() {
    const { alerts, loading, deleteAlert } = useAlerts();
    const { subscription } = useSubscription();
    const [deletingId, setDeletingId] = useState(null);
    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await deleteAlert(id);
        }
        finally {
            setDeletingId(null);
        }
    };
    if (loading) {
        return (<div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin"/>
      </div>);
    }
    return (<div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Alerts</h2>
          <p className="text-sm text-muted-foreground">
            {alerts.length} of {subscription?.alert_limit || 0} alerts used
          </p>
        </div>
        <Button>
          <Bell className="mr-2 h-4 w-4"/>
          New Alert
        </Button>
      </div>

      <div className="grid gap-4">
        {alerts.map((alert) => (<Card key={alert.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {alert.name}
                    {(alert.error_count || 0) > 0 ? (<Badge variant="destructive" title={alert.last_error || 'Error occurred'}>
                        Error
                      </Badge>) : alert.is_active ? (<Badge variant="default">
                        Active
                      </Badge>) : (<Badge variant="secondary">
                        Paused
                      </Badge>)}
                  </CardTitle>
                  <CardDescription>
                    Created on {format(new Date(alert.created_at), "PPP")}
                    {alert.last_check_at && (<> · Last checked {format(new Date(alert.last_check_at), "Pp")}</>)}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => {
                // TODO: Implement edit functionality
                toast({
                    title: "Coming Soon",
                    description: "Edit functionality will be available soon.",
                });
            }}>
                    <Edit className="h-4 w-4"/>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4"/>
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
                        <Button variant="destructive" onClick={() => handleDelete(alert.id)} disabled={deletingId === alert.id}>
                          {deletingId === alert.id ? (<Loader2 className="mr-2 h-4 w-4 animate-spin"/>) : (<Trash className="mr-2 h-4 w-4"/>)}
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
                  {alert.keywords}
                </div>
                <div>
                  <span className="font-medium">Cities: </span>
                  {alert.cities.join(", ")}
                </div>
                <div>
                  <span className="font-medium">Category: </span>
                  {alert.category}
                </div>
                {(alert.error_count || 0) > 0 && alert.last_error && (<div className="mt-2 text-sm text-destructive">
                    <span className="font-medium">Last Error: </span>
                    {alert.last_error}
                  </div>)}
              </div>
            </CardContent>
          </Card>))}

        {alerts.length === 0 && (<Card>
            <CardHeader>
              <CardTitle>No alerts yet</CardTitle>
              <CardDescription>
                Create your first alert to start monitoring Craigslist listings
              </CardDescription>
            </CardHeader>
          </Card>)}
      </div>
    </div>);
}
