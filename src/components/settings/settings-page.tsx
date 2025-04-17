import { useState } from 'react';
import { 
  Bell, 
  Moon, 
  Sun, 
  Laptop, 
  Mail, 
  Smartphone, 
  Globe, 
  Shield, 
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import type { Theme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { saveUserSettings, deleteUserAccount } from '@/lib/user-settings';

interface SettingsPageProps {
  user: {
    email: string;
    notifications: {
      email: boolean;
      push: boolean;
      desktop: boolean;
    };
    refreshInterval: number;
    timezone: string;
  };
}

export function SettingsPage({ user }: SettingsPageProps) {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(user.notifications);
  const [refreshInterval, setRefreshInterval] = useState(user.refreshInterval);
  const [timezone, setTimezone] = useState(user.timezone);

  const handleSave = async () => {
    try {
      // Save settings to backend
      await saveUserSettings({
        notifications,
        refreshInterval,
        timezone,
      });
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    // Show confirmation dialog
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      // Delete account logic
      await deleteUserAccount();
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-2xl py-10">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Separator />

        {/* Appearance */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Appearance</h3>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">
                Select your preferred theme
              </p>
            </div>
            <Select
              value={theme}
              onValueChange={(value: Theme) => setTheme(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center">
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center">
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center">
                    <Laptop className="mr-2 h-4 w-4" />
                    System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notifications</h3>
          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, email: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications on your devices
                </p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, push: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  Desktop Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Show notifications on your desktop
                </p>
              </div>
              <Switch
                checked={notifications.desktop}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, desktop: checked })
                }
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Preferences</h3>
          <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-2">
              <Label className="flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Interval
              </Label>
              <Select
                value={refreshInterval.toString()}
                onValueChange={(value) => setRefreshInterval(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">Every 5 minutes</SelectItem>
                  <SelectItem value="600">Every 10 minutes</SelectItem>
                  <SelectItem value="900">Every 15 minutes</SelectItem>
                  <SelectItem value="1800">Every 30 minutes</SelectItem>
                  <SelectItem value="3600">Every hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">
                <Globe className="mr-2 h-4 w-4" />
                Timezone
              </Label>
              <Select
                value={timezone}
                onValueChange={setTimezone}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Security</h3>
          <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-2">
              <Label className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Change Password
              </Label>
              <div className="space-y-2">
                <Input type="password" placeholder="Current password" />
                <Input type="password" placeholder="New password" />
                <Input type="password" placeholder="Confirm new password" />
                <Button variant="outline" className="w-full">
                  Update Password
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
          <div className="rounded-lg border border-destructive/50 p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-destructive">Delete Account</Label>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                className="flex items-center"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
