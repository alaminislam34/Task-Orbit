"use client";

import { useMemo, useState } from "react";

import { useClientOrderDetail, useClientOrders } from "@/hooks/api";
import type { ClientOrderStatus } from "@/types/client.types";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STATUS_FILTERS: Array<{ label: string; value: "ALL" | ClientOrderStatus }> = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Active", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Disputed", value: "DISPUTED" },
  { label: "Refunded", value: "REFUNDED" },
];

export default function ClientOrdersPanel() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | ClientOrderStatus>("ALL");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      page,
      limit: 10,
      search: search.trim() || undefined,
      status: status === "ALL" ? undefined : status,
      sortBy: "updatedAt" as const,
      sortOrder: "desc" as const,
    }),
    [page, search, status],
  );

  const { data, isLoading, isError, isFetching, refetch } = useClientOrders(filters);
  const orderList = data?.data ?? [];
  const meta = data?.meta;

  const detailQuery = useClientOrderDetail(selectedOrderId || undefined);
  const detail = detailQuery.data?.data;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="My Orders"
        description={`Monitor all client orders with status and progress.${isFetching ? " Updating..." : ""}`}
        actions={(
          <Button size="sm" variant="outline" onClick={() => void refetch()}>
            Refresh
          </Button>
        )}
      />

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-border/70 bg-background p-4 md:grid-cols-3">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search orders"
          className="md:col-span-2"
        />
        <select
          className="h-10 rounded-md border bg-transparent px-3 text-sm"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as "ALL" | ClientOrderStatus);
            setPage(1);
          }}
        >
          {STATUS_FILTERS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border/70 p-6 text-sm text-muted-foreground">Loading orders...</div>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          Could not load orders.
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="space-y-3">
            {orderList.length === 0 ? (
              <div className="rounded-xl border border-border/70 p-6 text-sm text-muted-foreground">No orders found.</div>
            ) : (
              orderList.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  className="w-full rounded-xl border border-border/70 bg-background p-4 text-left hover:bg-muted/40"
                  onClick={() => setSelectedOrderId(order.id)}
                >
                  <p className="font-medium">{order.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {order.status} • {order.currency} {order.amount}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Progress: {order.progress.completedPhases}/{order.progress.totalPhases} ({order.progress.percentage}%)
                  </p>
                </button>
              ))
            )}

            {meta ? (
              <div className="flex items-center justify-between rounded-xl border border-border/70 bg-background p-3 text-sm">
                <p className="text-muted-foreground">
                  Page {meta.page} of {Math.max(1, meta.totalPages)}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={meta.page <= 1}
                    onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                  >
                    Prev
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={meta.page >= meta.totalPages}
                    onClick={() => setPage((previous) => previous + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-xl border border-border/70 bg-background p-4">
            <h2 className="font-semibold">Order Detail</h2>
            {!selectedOrderId ? (
              <p className="mt-2 text-sm text-muted-foreground">Select an order from the list.</p>
            ) : detailQuery.isLoading ? (
              <p className="mt-2 text-sm text-muted-foreground">Loading order detail...</p>
            ) : !detail ? (
              <p className="mt-2 text-sm text-muted-foreground">Order detail not found.</p>
            ) : (
              <div className="mt-3 space-y-3 text-sm">
                <div className="rounded-lg border border-border/60 p-3">
                  <p className="font-medium">{detail.order.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {detail.order.status} • {detail.order.currency} {detail.order.amount}
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 p-3">
                  <p className="text-xs text-muted-foreground">Seller</p>
                  <p>{detail.seller.name || "-"}</p>
                  <p className="text-xs text-muted-foreground">{detail.seller.email || ""}</p>
                </div>
                <div className="rounded-lg border border-border/60 p-3">
                  <p className="text-xs text-muted-foreground">Permitted Actions</p>
                  <p>Review deliverables: {detail.permittedActions.canReviewDeliverables ? "Yes" : "No"}</p>
                  <p>Send message: {detail.permittedActions.canSendMessage ? "Yes" : "No"}</p>
                  <p>Request cancellation: {detail.permittedActions.canRequestCancellation ? "Yes" : "No"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
