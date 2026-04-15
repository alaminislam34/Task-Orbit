"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
import { useNotifications } from "@/hooks/api/notifications/useNotifications";
import { INotification, NotificationType } from "@/types/notification.types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useUser as useStoredUser } from "@/store/useUserStore";
import { AccountType } from "@/types/state.types";

/**
 * NotificationDropdown Component
 *
 * Displays user notifications from backend with:
 * - Real-time socket updates via useNotifications hook
 * - Mark as read functionality
 * - Notification type-based icons
 * - Unread count badge
 * - Responsive dropdown UI
 */
export function Notifications() {
  const router = useRouter();
  const user = useStoredUser();
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
  } = useNotifications({
    enableSocket: true,
    enablePolling: true,
    limit: 10,
  });

  const [isOpen, setIsOpen] = useState(false);

  const getDashboardBasePath = useCallback(() => {
    if (user?.role === "SUPER_ADMIN") {
      return "/dashboard/super-admin";
    }

    if (user?.role === "ADMIN") {
      return "/dashboard/admin";
    }

    switch (user?.accountType) {
      case AccountType.SELLER:
        return "/dashboard/seller";
      case AccountType.JOB_SEEKER:
        return "/dashboard/seeker";
      case AccountType.CLIENT:
        return "/dashboard/client";
      case AccountType.RECRUITER:
        return "/dashboard/recruiter";
      default:
        return "/dashboard";
    }
  }, [user?.accountType, user?.role]);

  const getConversationPath = useCallback(() => {
    switch (user?.accountType) {
      case AccountType.SELLER:
        return "/dashboard/seller/conversation";
      case AccountType.CLIENT:
        return "/dashboard/client/conversation";
      case AccountType.RECRUITER:
        return "/dashboard/recruiter/conversations";
      case AccountType.JOB_SEEKER:
        return "/dashboard/seeker/conversations";
      default:
        return `${getDashboardBasePath()}/conversations`;
    }
  }, [getDashboardBasePath, user?.accountType]);

  const resolveNotificationPath = useCallback(
    (notification: INotification) => {
      const rawActionUrl = notification.actionUrl?.trim();
      const metadata = notification.metadata ?? {};

      if (rawActionUrl) {
        if (/^https?:\/\//i.test(rawActionUrl)) {
          window.location.assign(rawActionUrl);
          return;
        }

        if (rawActionUrl.startsWith("/")) {
          router.push(rawActionUrl);
          return;
        }

        router.push(`/${rawActionUrl.replace(/^\/+/, "")}`);
        return;
      }

      if (notification.type === "MESSAGE") {
        const conversationId =
          typeof metadata.conversationId === "string"
            ? metadata.conversationId
            : typeof metadata.chatConversationId === "string"
              ? metadata.chatConversationId
              : null;

        if (conversationId) {
          router.push(`${getConversationPath()}?conversationId=${encodeURIComponent(conversationId)}`);
          return;
        }

        router.push(getConversationPath());
        return;
      }

      const redirectPath =
        typeof metadata.redirectPath === "string"
          ? metadata.redirectPath
          : typeof metadata.path === "string"
            ? metadata.path
            : null;

      if (redirectPath) {
        router.push(redirectPath.startsWith("/") ? redirectPath : `/${redirectPath}`);
        return;
      }

      router.push(getDashboardBasePath());
    },
    [getConversationPath, getDashboardBasePath, router],
  );

  /**
   * Get icon component based on notification type
   */
  const getNotificationIcon = (type: NotificationType) => {
    const iconConfig: Record<
      NotificationType,
      { icon: LucideIcon; color: string }
    > = {
      APPLICATION: { icon: Briefcase, color: "text-blue-500" },
      JOB: { icon: Briefcase, color: "text-blue-500" },
      MESSAGE: { icon: AlertCircle, color: "text-purple-500" },
      ORDER: { icon: CheckCircle2, color: "text-green-500" },
      PAYMENT: { icon: CheckCircle2, color: "text-green-500" },
      ADMIN: { icon: AlertCircle, color: "text-orange-500" },
      ALERT: { icon: AlertCircle, color: "text-amber-500" },
      SYSTEM: { icon: Bell, color: "text-slate-500" },
    };

    const config = iconConfig[type] || iconConfig.SYSTEM;
    const Icon = config.icon;
    return <Icon className={`size-4 ${config.color}`} />;
  };

  /**
   * Handle marking notification as read
   */
  const handleMarkAsRead = useCallback(
    async (notificationId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await markAsRead.mutateAsync(notificationId);
      } catch (error) {
        toast.error("Failed to mark notification as read");
      }
    },
    [markAsRead],
  );

  /**
   * Handle notification click (navigate to action URL if available)
   */
  const handleNotificationClick = useCallback(
    (notification: INotification) => {
      if (!notification.isRead) {
        markAsRead.mutate(notification.id);
      }
      resolveNotificationPath(notification);
    },
    [markAsRead, resolveNotificationPath],
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger>
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
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden">
        <DropdownMenuGroup>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <DropdownMenuLabel className="p-0 text-base font-semibold text-foreground">
              Notifications ({notifications.length})
            </DropdownMenuLabel>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {unreadCount} NEW
                </span>
              )}
            </div>
          </div>

          <DropdownMenuSeparator className="m-0" />

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="animate-spin size-5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground mt-2">
                  Loading notifications...
                </p>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification: INotification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 border-b border-border/40 px-2 py-2 last:border-0 transition-colors hover:bg-accent/50",
                    !notification.isRead && "bg-primary/5",
                  )}
                  role="button"
                  tabIndex={0}
                >
                  {/* Icon */}
                  <div className="mt-0.5 rounded-full bg-background p-1.5 shadow-sm ring-1 ring-border shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={cn(
                          "text-xs wrap-break-word",
                          !notification.isRead
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {notification.title}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap ml-2 shrink-0">
                        <Clock className="size-3" />
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        disabled={markAsRead.isPending}
                        title="Mark as read"
                      >
                        {markAsRead.isPending ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <div className="size-2 rounded-full bg-primary" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
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

        {/* Footer Button */}
        <Button
          variant="ghost"
          className="w-full rounded-none py-3 text-xs font-medium text-primary hover:bg-primary/5 hover:text-primary"
          onClick={() => {
            setIsOpen(false);
            // Navigate to full notifications page if available
            router.push("/dashboard/notifications");
          }}
        >
          View all notifications →
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
