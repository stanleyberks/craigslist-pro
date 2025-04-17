import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  refreshInterval: number;
  timezone: string;
}

export async function saveUserSettings(settings: UserSettings): Promise<void> {
  const supabase = createClientComponentClient();
  const { error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      ...settings,
    });

  if (error) {
    throw new Error('Failed to save settings');
  }
}

export async function deleteUserAccount(): Promise<void> {
  const supabase = createClientComponentClient();
  const { error } = await supabase.rpc('delete_user_account');

  if (error) {
    throw new Error('Failed to delete account');
  }
}
