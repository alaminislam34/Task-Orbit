"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useNotifications } from "@/hooks/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import SeekerPageHeader from "@/components/module/seeker/shared/SeekerPageHeader";

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
};

export default function SeekerNotificationsPanel() {
  const {
    notifications,
    unreadCount,
    isLoading,
    isFetching,
    refetch,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications({
    enableSocket: true,
    enablePolling: true,
    limit: 50,
  });

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead.mutateAsync();
      toast.success("All notifications marked as read.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification.mutateAsync(notificationId);
      toast.success("Notification deleted.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleMarkRead = async (notificationId: string) => {
    try {
      await markAsRead.mutateAsync(notificationId);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-5">
      <SeekerPageHeader
        title="Notifications"
        description={`Unread: ${unreadCount}${isFetching ? " (syncing...)" : ""}`}
        actions={(
          <>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => void handleMarkAllRead()}
              disabled={markAllAsRead.isPending || unreadCount === 0}
            >
              Mark all read
            </Button>
          </>
        )}
      />

      {isLoading ? (
        <div className="rounded-xl border border-border/70 p-6 text-sm text-muted-foreground">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="rounded-xl border border-border/70 p-8 text-center text-sm text-muted-foreground">
          No notifications found.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div key={item.id} className="rounded-xl border border-border/70 bg-background p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.message}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
                </div>

                <div className="flex items-center gap-2">
                  {!item.isRead ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void handleMarkRead(item.id)}
                      disabled={markAsRead.isPending}
                    >
                      Mark read
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void handleDelete(item.id)}
                    disabled={deleteNotification.isPending}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
