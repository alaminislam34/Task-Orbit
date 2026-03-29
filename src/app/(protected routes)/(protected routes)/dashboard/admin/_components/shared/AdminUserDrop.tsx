"use client";

import { LogOut, Settings, User, ShieldCheck, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminUserDrop() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="group flex h-10 items-center gap-2 rounded-full px-2 py-1.5 hover:bg-accent/50 data-[state=open]:bg-accent transition-all"
            aria-label="Open profile menu"
          >
            <Avatar className="size-7 border border-border/80 shadow-sm transition-transform group-hover:scale-105">
              <AvatarImage src="/path-to-your-avatar.png" alt="Admin User" />
              <AvatarFallback className="bg-primary/5 text-[10px] font-bold text-primary">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:flex flex-col items-start leading-none gap-1">
              <span className="text-[13px] font-semibold text-foreground">
                Admin
              </span>
            </div>
            <ChevronDown className="size-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-60 p-1.5 shadow-lg">
        <DropdownMenuGroup>
          <div className="flex items-center gap-2.5 px-2 py-2.5">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-semibold leading-none">Admin User</p>
              <p className="text-xs text-muted-foreground truncate w-32.5">
                admin@yourdomain.com
              </p>
            </div>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="-mx-1.5 my-1.5" />

        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer gap-2 py-2 focus:bg-accent">
            <User className="size-4 text-muted-foreground/80" />
            <span className="text-sm">My Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer gap-2 py-2 focus:bg-accent">
            <Settings className="size-4 text-muted-foreground/80" />
            <span className="text-sm">Account Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer gap-2 py-2 focus:bg-accent">
            <ShieldCheck className="size-4 text-muted-foreground/80" />
            <span className="text-sm">Security</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="-mx-1.5 my-1.5" />

        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer gap-2 py-2 focus:bg-destructive/10"
        >
          <LogOut className="size-4" />
          <span className="text-sm font-medium">Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
