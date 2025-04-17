import { useState } from 'react';
import { useRouter } from 'next/router';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@supabase/auth-helpers-react';
import { updateEmailPreferences, updateProfile, deleteAccount } from '@/lib/services/profile-service';
import type { Database } from '@/lib/database.types';
import type { EmailFrequency } from '@/lib/types';

type Profile = Database['public']['Tables']['profiles']['Row'] & {
  email_frequency: EmailFrequency;
};
import { UsageMeter } from '@/components/plan/usage-meter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Crown, Mail, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  
  const user = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with real data from your database
  const profile = {
    email: user?.email,
    subscription_tier: 'free',
    subscription_status: 'active',
    subscription_end_date: null,
    alert_limit: 3,
    city_limit: 2,
    email_notifications: true,
    email_frequency: 'daily' as EmailFrequency,
    alerts_used: 2,
    cities_used: 3,
  };

  const handleUpdateProfile = async (data: Partial<Profile>) => {
    setIsLoading(true);
    try {
      await updateProfile(user?.id as string, data);

      toast({
        title: 'Settings updated',
        description: 'Your preferences have been saved.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Plan Information */}
        <Card>
          <CardHeader>
            <CardTitle>Plan & Usage</CardTitle>
            <CardDescription>
              View your current plan and resource usage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  {profile.subscription_tier === 'free' ? 'Free Plan' : 'Pro Plan'}
                </h3>
                <p className="text-sm text-slate-600">
                  {profile.subscription_tier === 'free'
                    ? 'Basic features for occasional use'
                    : 'Advanced features for power users'}
                </p>
              </div>
              {profile.subscription_tier === 'free' && (
                <Button onClick={() => router.push('/app/upgrade')}>
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <UsageMeter
                label="Alert Usage"
                current={profile.alerts_used}
                limit={profile.alert_limit}
                type="alerts"
              />
              <UsageMeter
                label="Cities per Alert"
                current={profile.cities_used}
                limit={profile.city_limit}
                type="cities"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure how and when you want to be notified.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-slate-600">
                  Receive email updates for your alerts
                </p>
              </div>
              <Switch
                checked={profile.email_notifications}
                onCheckedChange={async (checked: boolean) => {
                  try {
                    await updateEmailPreferences(user?.id as string, checked, profile.email_frequency);
                    toast({
                      title: 'Settings updated',
                      description: 'Email notification preferences saved.',
                    });
                  } catch (error: any) {
                    toast({
                      title: 'Error',
                      description: error.message,
                      variant: 'destructive',
                    });
                  }
                }}
              />
            </div>

            {profile.email_notifications && (
              <div className="space-y-2">
                <Label>Email Frequency</Label>
                <Select
                  value={profile.email_frequency as EmailFrequency}
                  onValueChange={(value: EmailFrequency) =>
                    handleUpdateProfile({ email_frequency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Update your account information and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                value={profile.email}
                disabled
                className="max-w-md"
              />
              <p className="text-sm text-slate-600">
                Contact support to change your email address.
              </p>
            </div>

            <div>
              <Button variant="outline" onClick={() => router.push('/reset-password')}>
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={async () => {
                const confirmed = window.confirm(
                  'Are you sure you want to delete your account? This action cannot be undone.'
                );
                if (confirmed) {
                  setIsLoading(true);
                  try {
                    await deleteAccount(user?.id as string);
                    router.push('/');
                  } catch (error: any) {
                    toast({
                      title: 'Error',
                      description: error.message,
                      variant: 'destructive',
                    });
                  } finally {
                    setIsLoading(false);
                  }
                }
              }}
              disabled={isLoading}
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
