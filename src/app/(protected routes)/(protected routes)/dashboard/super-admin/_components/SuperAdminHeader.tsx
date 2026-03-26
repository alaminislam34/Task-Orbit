"use client";

import { Bell, Search } from "lucide-react";

import { ModeToggle } from "@/components/shared/theme/ThemeToggler";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SuperAdminHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <SidebarTrigger className="shrink-0" />

        <div className="relative hidden w-full max-w-md items-center md:flex">
          <Search className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search users, projects, jobs..."
            className="pl-8"
            aria-label="Search dashboard"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="relative"
                  aria-label="Open notifications"
                />
              }
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuItem>You have 4 new applications.</DropdownMenuItem>
              <DropdownMenuItem>2 payout requests are pending.</DropdownMenuItem>
              <DropdownMenuItem>Server health report is ready.</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-2"
                  aria-label="Open profile menu"
                />
              }
            >
              <Avatar size="sm" className="border border-border/70">
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">Super Admin</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>My Profile</DropdownMenuItem>
              <DropdownMenuItem>Account Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="px-4 pb-3 md:hidden">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-8"
            aria-label="Search dashboard"
          />
        </div>
      </div>
    </header>
  );
}
