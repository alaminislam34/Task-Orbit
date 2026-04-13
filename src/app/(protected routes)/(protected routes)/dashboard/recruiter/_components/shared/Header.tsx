"use client";

import { Search } from "lucide-react";
import { ModeToggle } from "@/components/shared/theme/ThemeToggler";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Notifications } from "@/components/shared/notification/NotificationDropdown";
import { RecruiterProfileDropDown } from "./RecruiterProfileDropDown";

export function RecruiterHeader() {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-border/60 bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        {/* Navigation Controls */}
        <SidebarTrigger className="shrink-0" />

        {/* Desktop Search Center */}
        <div className="relative hidden w-full max-w-md items-center md:flex">
          <Search className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search dashboard..."
            className="pl-8 focus-visible:ring-1 bg-muted/40"
            aria-label="Search dashboard"
          />
        </div>

        {/* Action Items */}
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <Notifications />
          <RecruiterProfileDropDown />
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8 bg-muted/40"
            aria-label="Search dashboard"
          />
        </div>
      </div>
    </header>
  );
}
