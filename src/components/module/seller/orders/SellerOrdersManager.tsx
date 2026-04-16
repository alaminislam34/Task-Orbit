"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import {
  useCreateOffer,
  useUpdateSellerOrderLimited,
} from "@/hooks/api";
import { useSellerOrders } from "@/hooks/api/orders/useSellerOrderWorkflow";
import { getApiErrorMessage } from "@/lib/api-error";
import type { CreateOfferPayload, OrderStatus, UpdateOrderLimitedPayload } from "@/types/orders.types";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: Array<{ label: string; value: "ALL" | OrderStatus }> = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Active", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Disputed", value: "DISPUTED" },
  { label: "Refunded", value: "REFUNDED" },
];

type OfferForm = {
  clientId: string;
  serviceId: string;
  title: string;
  description: string;
  amount: string;
  currency: string;
  deliveryDate: string;
  requirements: string;
  notes: string;
};

const emptyOfferForm: OfferForm = {
  clientId: "",
  serviceId: "",
  title: "",
  description: "",
  amount: "",
  currency: "USD",
  deliveryDate: "",
  requirements: "",
  notes: "",
};

const toNum = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function SellerOrdersManager() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | OrderStatus>("ALL");
  const [page, setPage] = useState(1);

  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [offerForm, setOfferForm] = useState<OfferForm>(emptyOfferForm);

  const [editingOrderId, setEditingOrderId] = useState("");
  const [notes, setNotes] = useState("");
  const [requirements, setRequirements] = useState("");

  const filters = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: search.trim() || undefined,
      status: status === "ALL" ? undefined : status,
      sortBy: "updatedAt" as const,
      sortOrder: "desc" as const,
    }),
    [page, search, status],
  );

  const ordersQuery = useSellerOrders(filters);
  const orders = ordersQuery.data?.data ?? [];
  const meta = ordersQuery.data?.meta;

  const createOffer = useCreateOffer();
  const updateLimited = useUpdateSellerOrderLimited(editingOrderId || "");

  const handleCreateOffer = async () => {
    if (!offerForm.clientId.trim() || !offerForm.serviceId.trim() || !offerForm.title.trim()) {
      toast.error("Client ID, service ID, and title are required.");
      return;
    }

    const payload: CreateOfferPayload = {
      clientId: offerForm.clientId.trim(),
      serviceId: offerForm.serviceId.trim(),
      title: offerForm.title.trim(),
      description: offerForm.description.trim(),
      amount: toNum(offerForm.amount),
      currency: offerForm.currency.trim() || "USD",
      deliveryDate: offerForm.deliveryDate,
      requirements: offerForm.requirements.trim(),
      notes: offerForm.notes.trim() || undefined,
    };

    try {
      await createOffer.mutateAsync(payload);
      toast.success("Order offer created.");
      setOfferForm(emptyOfferForm);
      setIsOfferDialogOpen(false);
      await ordersQuery.refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const startEdit = (orderId: string, existingNotes?: string, existingRequirements?: string) => {
    setEditingOrderId(orderId);
    setNotes(existingNotes || "");
    setRequirements(existingRequirements || "");
  };

  const saveOrderUpdate = async () => {
    if (!editingOrderId) {
      return;
    }

    const payload: UpdateOrderLimitedPayload = {
      notes: notes.trim() || undefined,
      requirements: requirements.trim() || undefined,
    };

    try {
      await updateLimited.mutateAsync(payload);
      toast.success("Order notes updated.");
      setEditingOrderId("");
      await ordersQuery.refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Manage Orders"
        description="Create offers, monitor statuses, and keep order requirements updated."
        actions={(
          <Button onClick={() => setIsOfferDialogOpen(true)}>
            <Plus className="mr-2 size-4" />
            Create Offer
          </Button>
        )}
      />

      <div className="grid grid-cols-1 gap-3 rounded-lg border bg-background p-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by title or description"
          />
        </div>
        <div>
          <select
            className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as "ALL" | OrderStatus);
              setPage(1);
            }}
          >
            {STATUS_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Link href="/dashboard/seller/manage-phases">
            <Button variant="outline" className="w-full">Go To Phase Manager</Button>
          </Link>
        </div>
      </div>

      {ordersQuery.isLoading ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">No orders found.</div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border bg-background p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-semibold">{order.title}</h2>
                  <p className="text-xs text-muted-foreground">
                    Status: {order.status} • {order.currency || "USD"} {order.amount || 0}
                  </p>
                </div>
                <Link href={`/dashboard/seller/manage-phases?orderId=${order.id}`}>
                  <Button size="sm" variant="outline">Manage This Order</Button>
                </Link>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="rounded-md border p-2 text-xs">
                  <p className="font-medium">Requirements</p>
                  <p className="mt-1 text-muted-foreground">{order.requirements || "-"}</p>
                </div>
                <div className="rounded-md border p-2 text-xs">
                  <p className="font-medium">Notes</p>
                  <p className="mt-1 text-muted-foreground">{order.notes || "-"}</p>
                </div>
              </div>

              {editingOrderId === order.id ? (
                <div className="mt-3 space-y-2">
                  <Textarea
                    value={requirements}
                    onChange={(event) => setRequirements(event.target.value)}
                    placeholder="Update requirements"
                  />
                  <Textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Update notes"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => void saveOrderUpdate()} disabled={updateLimited.isPending}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingOrderId("")}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(order.id, order.notes, order.requirements)}
                  >
                    Edit Notes/Requirements
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {meta ? (
        <div className="flex items-center justify-between rounded-lg border bg-background p-4 text-sm">
          <p className="text-muted-foreground">Page {meta.page} of {Math.max(1, meta.totalPages)}</p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={meta.page <= 1}
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
            >
              Previous
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

      <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Order Offer</DialogTitle>
            <DialogDescription>
              Prepare a custom offer for a client. Use valid IDs from your backend records.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Input
              value={offerForm.clientId}
              onChange={(event) => setOfferForm((prev) => ({ ...prev, clientId: event.target.value }))}
              placeholder="Client ID"
            />
            <Input
              value={offerForm.serviceId}
              onChange={(event) => setOfferForm((prev) => ({ ...prev, serviceId: event.target.value }))}
              placeholder="Service ID"
            />
            <div className="md:col-span-2">
              <Input
                value={offerForm.title}
                onChange={(event) => setOfferForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Offer title"
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                value={offerForm.description}
                onChange={(event) => setOfferForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Offer description"
                className="min-h-24"
              />
            </div>
            <Input
              type="number"
              value={offerForm.amount}
              onChange={(event) => setOfferForm((prev) => ({ ...prev, amount: event.target.value }))}
              placeholder="Amount"
            />
            <Input
              value={offerForm.currency}
              onChange={(event) => setOfferForm((prev) => ({ ...prev, currency: event.target.value }))}
              placeholder="Currency"
            />
            <Input
              type="date"
              value={offerForm.deliveryDate}
              onChange={(event) => setOfferForm((prev) => ({ ...prev, deliveryDate: event.target.value }))}
            />
            <Input
              value={offerForm.requirements}
              onChange={(event) => setOfferForm((prev) => ({ ...prev, requirements: event.target.value }))}
              placeholder="Requirements"
            />
            <div className="md:col-span-2">
              <Textarea
                value={offerForm.notes}
                onChange={(event) => setOfferForm((prev) => ({ ...prev, notes: event.target.value }))}
                placeholder="Notes"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOfferDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => void handleCreateOffer()} disabled={createOffer.isPending}>Create Offer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SellerOrdersManager;
