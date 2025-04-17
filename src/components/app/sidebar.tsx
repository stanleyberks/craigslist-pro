"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Search,
  Bell,
  List,
  Settings,
  LogOut,
  Home
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Card, CardContent } from "@/components/ui/card";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/app",
    description: "Overview of your alerts and latest matches",
  },
  {
    title: "Alerts",
    icon: Bell,
    href: "/app/alerts",
    description: "Manage your Craigslist search alerts",
  },
  {
    title: "Results",
    icon: List,
    href: "/app/results",
    description: "View and filter your matches",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/app/settings",
    description: "Configure your account settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "There was a problem signing out.",
        variant: "destructive",
      });
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <Card className="flex h-screen w-[240px] flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <Link 
          href="/app" 
          className="font-semibold tracking-tight hover:text-primary transition-colors"
        >
          Craigslist Alert Pro
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          {sidebarItems.map((item) => (
            <HoverCard key={item.href} openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-all",
                    pathname === item.href
                      ? "bg-secondary hover:bg-secondary/80"
                      : "hover:bg-secondary/50"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon 
                      className={cn(
                        "mr-2 h-4 w-4 transition-colors",
                        pathname === item.href
                          ? "text-primary"
                          : "text-muted-foreground"
                      )} 
                      aria-hidden="true" 
                    />
                    {item.title}
                  </Link>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent side="right" className="w-64">
                <p className="text-sm">{item.description}</p>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </ScrollArea>
      <Separator />
      <CardContent className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start transition-colors hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
}
