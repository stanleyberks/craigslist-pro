"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Nav } from "@/components/app/nav";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export function DashboardLayout({ children, sidebar }: DashboardLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const Sidebar = (
    <div className="w-full h-full bg-background border-r p-4 space-y-4">
      {sidebar}
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {isMobile ? (
        <>
          <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-40 md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              {Sidebar}
            </SheetContent>
          </Sheet>
          <div className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-center border-b bg-background px-4 md:hidden">
            <Nav />
          </div>
          <main className="flex-1 overflow-y-auto p-4 pt-20">{children}</main>
        </>
      ) : (
        <>
          <div className="hidden md:block w-72 h-screen">{Sidebar}</div>
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </>
      )}
    </div>
  );
}
