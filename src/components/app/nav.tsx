"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search, Bell, List, Settings } from "lucide-react";

const navItems = [
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

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-2">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "secondary" : "ghost"}
          className={cn(
            "justify-start",
            pathname === item.href && "bg-muted"
          )}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="h-4 w-4" />
            <span className="sr-only">{item.title}</span>
          </Link>
        </Button>
      ))}
    </nav>
  );
}
