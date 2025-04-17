import { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useTheme } from "@/hooks/use-theme";
import { useDefaultShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { 
  Home, 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Crown
} from 'lucide-react';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/app',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'Search',
    href: '/app/search',
    icon: <Search className="w-5 h-5" />,
  },
  {
    label: 'Alerts',
    href: '/app/alerts',
    icon: <Bell className="w-5 h-5" />,
  },
  {
    label: 'Settings',
    href: '/app/settings',
    icon: <Settings className="w-5 h-5" />,
  },
  {
    label: 'Upgrade to Pro',
    href: '/app/upgrade',
    icon: <Crown className="w-5 h-5" />,
  },
];

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { theme, setTheme } = useTheme();

  useDefaultShortcuts();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
        <Link href="/app" className="font-semibold text-xl">
          Craigslist Pro
        </Link>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out z-40',
          {
            'translate-x-0': isSidebarOpen || !isMobile,
            '-translate-x-full': !isSidebarOpen && isMobile,
          }
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-6">
            <Link href="/app" className="font-semibold text-xl">
              Craigslist Pro
            </Link>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    {
                      'bg-primary-50 text-primary-700': isActive,
                      'text-slate-600 hover:bg-slate-100': !isActive,
                    }
                  )}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-600 hover:text-slate-900"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn('transition-all duration-200 ease-in-out', {
          'ml-64': !isMobile,
          'mt-16': isMobile,
        })}
      >
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
