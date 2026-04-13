"use client";

import {
  Bell,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NOTIFICATIONS = [
  {
    id: 1,
    title: "New Application",
    description: "John Doe applied for Senior Designer",
    time: "2m ago",
    icon: <Briefcase className="size-4 text-blue-500" />,
    unread: true,
  },
  {
    id: 2,
    title: "Payout Successful",
    description: "Transaction #4429 has been processed.",
    time: "1h ago",
    icon: <CheckCircle2 className="size-4 text-green-500" />,
    unread: true,
  },
  {
    id: 3,
    title: "Server Warning",
    description: "High CPU usage detected on Node-01.",
    time: "5h ago",
    icon: <AlertCircle className="size-4 text-amber-500" />,
    unread: false,
  },
];

export function Notifications() {
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-accent"
            aria-label="Open notifications"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-primary"></span>
              </span>
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden">
        <DropdownMenuGroup>
          <div className="flex items-center justify-between px-4 py-3">
            <DropdownMenuLabel className="p-0 text-base font-semibold text-foreground">
              Notifications
            </DropdownMenuLabel>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                {unreadCount} NEW
              </span>
            )}
          </div>

          <DropdownMenuSeparator className="m-0" />

          <div className="max-h-95 overflow-y-auto">
            {NOTIFICATIONS.length > 0 ? (
              NOTIFICATIONS.map((note) => (
                <DropdownMenuItem
                  key={note.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 border-b border-border/40 px-4 py-4 last:border-0 focus:bg-accent/50",
                    note.unread && "bg-primary/5",
                  )}
                >
                  <div className="mt-0.5 rounded-full bg-background p-2 shadow-sm ring-1 ring-border">
                    {note.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          note.unread
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {note.title}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="size-3" />
                        {note.time}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {note.description}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Bell className="mb-2 size-8 text-muted/40" />
                <p className="text-sm text-muted-foreground">
                  No notifications yet
                </p>
              </div>
            )}
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="m-0" />

        <Button
          variant="ghost"
          className="w-full rounded-none py-4 text-xs font-medium text-primary hover:bg-primary/5 hover:text-primary"
        >
          View all notifications
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
