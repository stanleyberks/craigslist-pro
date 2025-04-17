"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert } from "@/types/alert";
import { useAlerts } from "@/hooks/use-alerts";
import { useRealTimeAlerts } from "@/hooks/use-real-time-alerts";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/components/ui/use-toast";

export function AlertsTable() {
  const { alerts, toggleAlert, deleteAlert } = useAlerts();
  const [localAlerts, setLocalAlerts] = React.useState<Alert[]>([]);

  React.useEffect(() => {
    if (alerts) {
      setLocalAlerts(alerts);
    }
  }, [alerts]);

  useRealTimeAlerts({
    onNewMatch: (match) => {
      setLocalAlerts((current) =>
        current.map((alert) =>
          alert.id === match.alert_id
            ? { ...alert, new_matches_count: (alert.new_matches_count || 0) + 1 }
            : alert
        )
      );
      
      toast({
        title: "New Match Found",
        description: `A new match was found for your alert "${
          localAlerts.find((a) => a.id === match.alert_id)?.name
        }"`,
      });
    },
  });

  const handleToggle = async (alertId: string, isActive: boolean) => {
    try {
      await toggleAlert(alertId, isActive);
      toast({
        title: isActive ? "Alert Activated" : "Alert Paused",
        description: isActive
          ? "You'll start receiving matches for this alert."
          : "You won't receive any new matches until you reactivate this alert.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle alert status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (alertId: string) => {
    try {
      await deleteAlert(alertId);
      toast({
        title: "Alert Deleted",
        description: "The alert has been permanently deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete alert.",
        variant: "destructive",
      });
    }
  };

  if (!localAlerts?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No alerts found. Create your first alert to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Keywords</TableHead>
            <TableHead>Cities</TableHead>
            <TableHead>New Matches</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localAlerts.map((alert) => (
            <TableRow key={alert.id}>
              <TableCell className="font-medium">{alert.name}</TableCell>
              <TableCell>{Array.isArray(alert.keywords) ? alert.keywords.join(", ") : alert.keywords}</TableCell>
              <TableCell>{alert.cities.join(", ")}</TableCell>
              <TableCell>
                {(alert.new_matches_count ?? 0) > 0 && (
                  <Badge variant="secondary">
                    {alert.new_matches_count} new
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {alert.updated_at
                  ? formatDistanceToNow(new Date(alert.updated_at), {
                      addSuffix: true,
                    })
                  : "Never"}
              </TableCell>
              <TableCell>
                <Switch
                  checked={alert.is_active}
                  onCheckedChange={(checked) => handleToggle(alert.id, checked)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      // TODO: Implement edit functionality
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(alert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
