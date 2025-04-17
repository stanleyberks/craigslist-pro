import { useState } from 'react';
import { Bell, Edit2, Trash2, ChevronDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Alert } from '@/types/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';

interface AlertCardProps {
  alert: Alert;
  onEdit: (alert: Alert) => void;
  onDelete: (alert: Alert) => void;
  onToggle: (alert: Alert, enabled: boolean) => void;
}

export function AlertCard({ alert, onEdit, onDelete, onToggle }: AlertCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>{alert.name}</CardTitle>
              <CardDescription>
                Created {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HoverCard openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Switch
                  checked={alert.is_active}
                  onCheckedChange={(checked) => onToggle(alert, checked)}
                  aria-label={`Toggle ${alert.name} alert`}
                />
              </HoverCardTrigger>
              <HoverCardContent className="w-48">
                <p className="text-sm">
                  {alert.is_active ? 'Disable' : 'Enable'} this alert
                </p>
              </HoverCardContent>
            </HoverCard>
            
            <HoverCard openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(alert)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Edit ${alert.name} alert`}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-48">
                <p className="text-sm">Edit alert settings</p>
              </HoverCardContent>
            </HoverCard>

            <HoverCard openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(alert)}
                  className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Delete ${alert.name} alert`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-48">
                <p className="text-sm text-destructive">Delete this alert</p>
              </HoverCardContent>
            </HoverCard>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                'transition-transform',
                isExpanded && 'rotate-180'
              )}
              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} alert details`}
              aria-expanded={isExpanded}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <div
        className={cn(
          'grid transition-all',
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
        aria-hidden={!isExpanded}
      >
        <div className="overflow-hidden">
          <CardContent className="border-t bg-muted/50 p-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2" role="list" aria-label="Alert filters">
                <Badge variant="secondary" role="listitem">
                  {alert.category}
                </Badge>
                {alert.min_price && alert.max_price && (
                  <Badge variant="secondary" role="listitem">
                    ${alert.min_price} - ${alert.max_price}
                  </Badge>
                )}
                {alert.keywords?.map((keyword: string) => (
                  <Badge key={keyword} variant="outline" role="listitem">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
