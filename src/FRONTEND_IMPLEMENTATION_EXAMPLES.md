# Frontend Implementation Examples

This document contains copy-paste ready examples for common use cases in your Task-Orbit application.

---

## 1️⃣ Apply for Job (With Restriction Check)

**File**: `src/components/module/career/ApplyJobButton.tsx`

```typescript
"use client";

import React, { useState } from "react";
import { useUserStatus } from "@/hooks/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ApplyJobButtonProps {
  jobId: string;
  jobTitle: string;
  onApplySuccess?: () => void;
}

export function ApplyJobButton({
  jobId,
  jobTitle,
  onApplySuccess,
}: ApplyJobButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isRestricted, reason } = useUserStatus();

  const handleApply = async () => {
    if (isRestricted) {
      toast.error(reason || "Your account is restricted");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/applications/${jobId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      toast.success(`Applied to ${jobTitle}!`);
      onApplySuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to apply"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleApply}
      disabled={isLoading || isRestricted}
      size="lg"
      className="w-full"
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isRestricted
        ? `Cannot Apply (${reason ? "Account " + reason : "Restricted"})`
        : "Apply Now"}
    </Button>
  );
}
```

**Usage**:
```typescript
<ApplyJobButton
  jobId={job.id}
  jobTitle={job.title}
  onApplySuccess={() => {
    // Refresh applications list
    void refetch();
  }}
/>
```

---

## 2️⃣ Send Chat Message (With Restriction Check)

**File**: `src/components/module/chat/ChatMessageInput.tsx`

```typescript
"use client";

import React, { useState } from "react";
import { useUserStatus } from "@/hooks/api";
import { chatSocketManager } from "@/lib/chat/socketManager";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, AlertCircle } from "lucide-react";

interface ChatMessageInputProps {
  conversationId: string;
  recipientId: string;
  onMessageSent?: () => void;
}

export function ChatMessageInput({
  conversationId,
  recipientId,
  onMessageSent,
}: ChatMessageInputProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isRestricted, reason } = useUserStatus();

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    if (isRestricted) {
      toast.error(reason || "Your account is restricted");
      return;
    }

    setIsLoading(true);
    try {
      const socket = chatSocketManager.getSocket();
      if (!socket?.connected) {
        throw new Error("Not connected to chat server");
      }

      // Emit message via socket
      socket.emit("send_message", {
        conversationId,
        receiverId: recipientId,
        text: message,
        timestamp: new Date().toISOString(),
      });

      setMessage("");
      onMessageSent?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isRestricted) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-red-900">Cannot Send Messages</h3>
          <p className="text-sm text-red-800 mt-1">{reason}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 resize-none"
        rows={3}
        disabled={isLoading}
      />
      <Button
        onClick={handleSendMessage}
        disabled={!message.trim() || isLoading}
        size="lg"
      >
        {isLoading ? (
          <span className="animate-spin">⏳</span>
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
```

---

## 3️⃣ Notification Badge with Unread Count

**File**: `src/components/shared/Header/NotificationBadge.tsx`

```typescript
"use client";

import React from "react";
import { useUnreadCount } from "@/hooks/api/notifications/useNotifications";
import { Badge } from "@/components/ui/badge";

export function NotificationBadge() {
  const { data, isLoading } = useUnreadCount();
  const unreadCount = data?.unreadCount ?? 0;

  if (isLoading || unreadCount === 0) {
    return null;
  }

  return (
    <Badge
      variant="destructive"
      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
    >
      {unreadCount > 99 ? "99+" : unreadCount}
    </Badge>
  );
}
```

---

## 4️⃣ Notification List Page (Full Implementation)

**File**: `src/app/dashboard/notifications/page.tsx`

```typescript
"use client";

import React, { useState } from "react";
import { useNotifications } from "@/hooks/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  MessageSquare,
  AlertCircle,
  Trash2,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { NotificationType } from "@/types/notification.types";

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  APPLICATION: <Briefcase className="w-5 h-5" />,
  JOB: <Briefcase className="w-5 h-5" />,
  MESSAGE: <MessageSquare className="w-5 h-5" />,
  ORDER: <AlertCircle className="w-5 h-5" />,
  PAYMENT: <AlertCircle className="w-5 h-5" />,
  ADMIN: <AlertCircle className="w-5 h-5" />,
  ALERT: <AlertCircle className="w-5 h-5" />,
  SYSTEM: <AlertCircle className="w-5 h-5" />,
};

export default function NotificationsPage() {
  const [typeFilter, setTypeFilter] = useState<NotificationType | "ALL">("ALL");
  const [readFilter, setReadFilter] = useState<"ALL" | "UNREAD">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead,
    deleteNotification,
    refetch,
  } = useNotifications({
    limit: 100,
    enableSocket: true,
    enablePolling: true,
  });

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    const matchesType = typeFilter === "ALL" || notif.type === typeFilter;
    const matchesRead =
      readFilter === "ALL" || (readFilter === "UNREAD" && !notif.isRead);
    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesRead && matchesSearch;
  });

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification.mutateAsync(notificationId);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "No unread notifications"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0 || markAllAsRead.isPending}
            variant="outline"
          >
            {markAllAsRead.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Marking...
              </>
            ) : (
              "Mark all as read"
            )}
          </Button>
          <Button onClick={() => void refetch()} variant="outline">
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value as any)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="MESSAGE">Messages</SelectItem>
              <SelectItem value="APPLICATION">Applications</SelectItem>
              <SelectItem value="ORDER">Orders</SelectItem>
              <SelectItem value="PAYMENT">Payments</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={readFilter}
            onValueChange={(value) => setReadFilter(value as any)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="UNREAD">Unread Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {isLoading ? (
            <Card className="p-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </Card>
          ) : filteredNotifications.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                {notifications.length === 0
                  ? "No notifications yet"
                  : "No notifications match your filters"}
              </p>
            </Card>
          ) : (
            filteredNotifications.map((notif) => (
              <Card
                key={notif.id}
                className={`p-4 cursor-pointer transition hover:shadow-md ${
                  !notif.isRead ? "bg-blue-50 border-blue-200" : ""
                }`}
                onClick={() => {
                  if (!notif.isRead) {
                    markAsRead.mutate(notif.id);
                  }
                  if (notif.actionUrl) {
                    window.location.href = notif.actionUrl;
                  }
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-muted-foreground mt-1">
                    {notificationIcons[notif.type] || notificationIcons.SYSTEM}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-base">
                          {notif.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notif.message}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(
                          new Date(notif.createdAt),
                          { addSuffix: true }
                        )}
                      </span>
                      {notif.actionLabel && (
                        <span className="text-xs font-medium text-primary">
                          {notif.actionLabel} →
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notif.id);
                    }}
                    disabled={deleteNotification.isPending}
                    className="flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 5️⃣ Create Order with Restrictions

**File**: `src/components/module/orders/CreateOrderForm.tsx`

```typescript
"use client";

import React, { useState } from "react";
import { useUserStatus } from "@/hooks/api";
import { RestrictionBannerCompact } from "@/components/shared/RestrictionBanner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface CreateOrderFormProps {
  onOrderCreated?: (orderId: string) => void;
}

export function CreateOrderForm({ onOrderCreated }: CreateOrderFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { isRestricted } = useUserStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRestricted) {
      toast.error("You cannot create orders while your account is restricted");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/orders/create-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create order");

      const { data } = await response.json();
      toast.success("Order created successfully!");
      setFormData({ title: "", description: "", budget: "" });
      onOrderCreated?.(data.id);
    } catch (error) {
      toast.error("Failed to create order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      {isRestricted && (
        <div className="mb-6">
          <RestrictionBannerCompact />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Order Title</label>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            disabled={isRestricted || isLoading}
            placeholder="E.g., Website redesign"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            disabled={isRestricted || isLoading}
            placeholder="Describe what you need..."
            rows={4}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Budget</label>
          <Input
            type="number"
            value={formData.budget}
            onChange={(e) =>
              setFormData({ ...formData, budget: e.target.value })
            }
            disabled={isRestricted || isLoading}
            placeholder="0.00"
          />
        </div>

        <Button
          type="submit"
          disabled={isRestricted || isLoading}
          className="w-full"
        >
          {isLoading ? "Creating..." : "Create Order"}
        </Button>
      </form>
    </Card>
  );
}
```

---

## 6️⃣ Presence Status Indicator (Real-time User Status)

**File**: `src/components/shared/UserPresenceIndicator.tsx`

```typescript
"use client";

import React, { useEffect, useState } from "react";
import { chatSocketManager } from "@/lib/chat/socketManager";
import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";

interface UserPresenceIndicatorProps {
  userId: string;
  showLabel?: boolean;
}

export function UserPresenceIndicator({
  userId,
  showLabel = true,
}: UserPresenceIndicatorProps) {
  const [status, setStatus] = useState<"ONLINE" | "OFFLINE">("OFFLINE");

  useEffect(() => {
    const socket = chatSocketManager.getSocket();
    if (!socket) return;

    // Listen for status updates
    const handleStatusUpdate = (payload: { userId: string; status: "ONLINE" | "OFFLINE" }) => {
      if (payload.userId === userId) {
        setStatus(payload.status);
      }
    };

    socket.on("user_status", handleStatusUpdate);

    return () => {
      socket.off("user_status", handleStatusUpdate);
    };
  }, [userId]);

  const isOnline = status === "ONLINE";

  return (
    <Badge variant={isOnline ? "default" : "secondary"} className="ml-2">
      <Circle className={`w-2 h-2 mr-1 ${isOnline ? "fill-current" : ""}`} />
      {showLabel ? (isOnline ? "Online" : "Offline") : ""}
    </Badge>
  );
}
```

---

## ✅ Implementation Checklist

- [ ] Copy examples into your project files
- [ ] Update imports to match your project structure
- [ ] Test with dev server running
- [ ] Verify socket connection in browser console
- [ ] Test restriction behavior (create test suspended user)
- [ ] Test real-time notifications
- [ ] Check performance with React Query DevTools
- [ ] Deploy to staging for team review
- [ ] Test on multiple devices/browsers
- [ ] Deploy to production

---

**All examples follow your project's existing patterns and conventions!**
