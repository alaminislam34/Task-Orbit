"use client";

import Link from "next/link";
import { Bell, MessageSquare, ReceiptText, Wallet } from "lucide-react";

import { useClientDashboardSummary } from "@/hooks/api";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export default function ClientDashboardOverview() {
  const { data, isLoading, isFetching, refetch, isError } = useClientDashboardSummary();
  const summary = data?.data;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Client Dashboard"
        description={`Track your orders, support requests, and account health.${isFetching ? " Syncing..." : ""}`}
        actions={(
          <Button size="sm" variant="outline" onClick={() => void refetch()}>
            Refresh
          </Button>
        )}
      />

      {isLoading ? (
        <div className="rounded-xl border border-border/70 p-6 text-sm text-muted-foreground">Loading dashboard summary...</div>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          Failed to load dashboard summary.
        </div>
      ) : null}

      {summary ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-border/70 bg-background p-4">
              <p className="text-xs text-muted-foreground">Total Orders</p>
              <p className="mt-2 inline-flex items-center gap-2 text-2xl font-semibold">
                <ReceiptText className="size-5 text-muted-foreground" />
                {summary.orderCounts.total}
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-background p-4">
              <p className="text-xs text-muted-foreground">Active Orders</p>
              <p className="mt-2 text-2xl font-semibold">{summary.orderCounts.active}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-background p-4">
              <p className="text-xs text-muted-foreground">Month Spend</p>
              <p className="mt-2 inline-flex items-center gap-2 text-2xl font-semibold">
                <Wallet className="size-5 text-muted-foreground" />
                {summary.spending.currency} {summary.spending.monthSpend}
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-background p-4">
              <p className="text-xs text-muted-foreground">Unread Alerts</p>
              <p className="mt-2 inline-flex items-center gap-4 text-2xl font-semibold">
                <span className="inline-flex items-center gap-1"><MessageSquare className="size-4" /> {summary.unreadMessagesCount}</span>
                <span className="inline-flex items-center gap-1"><Bell className="size-4" /> {summary.unreadNotificationsCount}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-background p-4">
              <h2 className="font-semibold">Pending Actions</h2>
              <p className="mt-2 text-sm text-muted-foreground">Pending approvals: {summary.pendingActions.pendingApprovals}</p>
              <p className="text-sm text-muted-foreground">Deliverable reviews: {summary.pendingActions.pendingDeliverableReviews}</p>
            </div>

            <div className="rounded-xl border border-border/70 bg-background p-4">
              <h2 className="font-semibold">Quick Access</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/dashboard/client/orders">
                  <Button size="sm">Open Orders</Button>
                </Link>
                <Link href="/dashboard/client/queries">
                  <Button size="sm" variant="outline">Open Queries</Button>
                </Link>
                <Link href="/dashboard/client/settings">
                  <Button size="sm" variant="outline">Open Settings</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-background p-4">
            <h2 className="font-semibold">Recent Orders</h2>
            {summary.recentOrders.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No recent orders found.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {summary.recentOrders.map((order) => (
                  <div key={order.id} className="rounded-lg border border-border/60 p-3">
                    <p className="font-medium">{order.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.status} • {order.currency} {order.amount}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
