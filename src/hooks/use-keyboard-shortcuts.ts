import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : true;
        const metaMatch = shortcut.metaKey ? event.metaKey : true;

        if (keyMatch && ctrlMatch && metaMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export function useDefaultShortcuts() {
  const router = useRouter();

  useKeyboardShortcuts([
    {
      key: 'n',
      metaKey: true,
      action: () => router.push('/app/alerts/new'),
    },
    {
      key: 'f',
      metaKey: true,
      action: () => document.querySelector<HTMLInputElement>('[data-search]')?.focus(),
    },
    {
      key: '/',
      action: () => document.querySelector<HTMLInputElement>('[data-search]')?.focus(),
    },
    {
      key: 'h',
      metaKey: true,
      action: () => router.push('/app'),
    },
    {
      key: 's',
      metaKey: true,
      action: () => router.push('/app/settings'),
    },
  ]);
}
