"use client";

import Link from "next/link";
import { BriefcaseBusiness, CircleDollarSign, Layers3, ListChecks } from "lucide-react";

import { useSellerServices } from "@/hooks/api";
import { useSellerOrders } from "@/hooks/api/orders/useSellerOrderWorkflow";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";

const formatAmount = (amount?: number, currency?: string) => {
  if (typeof amount !== "number") {
    return "-";
  }

  return `${currency || "USD"} ${amount.toLocaleString()}`;
};

export function SellerDashboardOverview() {
  const servicesQuery = useSellerServices();
  const ordersQuery = useSellerOrders({ page: 1, limit: 20 });

  const services = servicesQuery.data?.data ?? [];
  const orders = ordersQuery.data?.data ?? [];

  const activeOrders = orders.filter((order) => order.status === "ACTIVE").length;
  const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
  const totalValue = orders.reduce((total, order) => total + (order.amount || 0), 0);

  const latestOrder = orders[0];

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Seller Dashboard"
        description="Monitor services, order pipeline, and delivery progress from one place."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border bg-background p-4">
          <p className="text-xs text-muted-foreground">Total Services</p>
          <p className="mt-2 inline-flex items-center gap-2 text-2xl font-semibold">
            <BriefcaseBusiness className="size-5 text-muted-foreground" />
            {services.length}
          </p>
        </div>

        <div className="rounded-lg border bg-background p-4">
          <p className="text-xs text-muted-foreground">Active Orders</p>
          <p className="mt-2 inline-flex items-center gap-2 text-2xl font-semibold">
            <Layers3 className="size-5 text-muted-foreground" />
            {activeOrders}
          </p>
        </div>

        <div className="rounded-lg border bg-background p-4">
          <p className="text-xs text-muted-foreground">Pending Orders</p>
          <p className="mt-2 inline-flex items-center gap-2 text-2xl font-semibold">
            <ListChecks className="size-5 text-muted-foreground" />
            {pendingOrders}
          </p>
        </div>

        <div className="rounded-lg border bg-background p-4">
          <p className="text-xs text-muted-foreground">Order Value (Tracked)</p>
          <p className="mt-2 inline-flex items-center gap-2 text-lg font-semibold">
            <CircleDollarSign className="size-5 text-muted-foreground" />
            {formatAmount(totalValue, latestOrder?.currency)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-background p-4">
          <h2 className="font-semibold">Manage Services</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create and update gigs, prices, packages, and service extras.
          </p>
          <Link href="/dashboard/seller/manage-services" className="mt-4 inline-block">
            <Button size="sm">Open Services</Button>
          </Link>
        </div>

        <div className="rounded-lg border bg-background p-4">
          <h2 className="font-semibold">Manage Orders</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create custom offers and track order status, notes, and milestones.
          </p>
          <Link href="/dashboard/seller/manage-orders" className="mt-4 inline-block">
            <Button size="sm" variant="outline">Open Orders</Button>
          </Link>
        </div>

        <div className="rounded-lg border bg-background p-4">
          <h2 className="font-semibold">Manage Phases</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start and complete phases, submit deliverables, and coordinate delivery.
          </p>
          <Link href="/dashboard/seller/manage-phases" className="mt-4 inline-block">
            <Button size="sm" variant="outline">Open Phases</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-lg border bg-background p-4">
        <h2 className="font-semibold">Recent Order Snapshot</h2>
        {!latestOrder ? (
          <p className="mt-2 text-sm text-muted-foreground">No orders available yet.</p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
            <p>
              <span className="text-muted-foreground">Title:</span> {latestOrder.title}
            </p>
            <p>
              <span className="text-muted-foreground">Status:</span> {latestOrder.status}
            </p>
            <p>
              <span className="text-muted-foreground">Amount:</span> {formatAmount(latestOrder.amount, latestOrder.currency)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerDashboardOverview;
