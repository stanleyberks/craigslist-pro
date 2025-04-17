"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search, Bell, List, Settings, LogOut, } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
const sidebarItems = [
    {
        title: "Search",
        icon: Search,
        href: "/app",
    },
    {
        title: "Alerts",
        icon: Bell,
        href: "/app/alerts",
    },
    {
        title: "Results",
        icon: List,
        href: "/app/results",
    },
    {
        title: "Settings",
        icon: Settings,
        href: "/app/settings",
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
        }
        else {
            router.push("/");
            router.refresh();
        }
    };
    return (<div className="flex h-screen w-[200px] flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/app" className="font-semibold">
          Craigslist Alert Pro
        </Link>
      </div>
      <div className="flex-1 space-y-1 p-2">
        {sidebarItems.map((item) => (<Button key={item.href} variant={pathname === item.href ? "secondary" : "ghost"} className={cn("w-full justify-start", pathname === item.href && "bg-muted")} asChild>
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4"/>
              {item.title}
            </Link>
          </Button>))}
      </div>
      <div className="border-t p-2">
        <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4"/>
          Sign Out
        </Button>
      </div>
    </div>);
}
