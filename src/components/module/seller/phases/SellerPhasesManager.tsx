"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  useCompleteSellerPhase,
  useMarkOrderCommunicationRead,
  useOrderCommunications,
  useSellerOrders,
  useSendOrderCommunication,
  useStartSellerPhase,
  useSubmitSellerDeliverable,
} from "@/hooks/api/orders/useSellerOrderWorkflow";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from "@/components/shared/PageHeader";

const PAGE_SIZE = 20;

export function SellerPhasesManager() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";

  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedPhaseId, setSelectedPhaseId] = useState("");
  const [deliverableTitle, setDeliverableTitle] = useState("");
  const [deliverableDescription, setDeliverableDescription] = useState("");
  const [deliverableFileUrl, setDeliverableFileUrl] = useState("");

  const [messageText, setMessageText] = useState("");

  const ordersQuery = useSellerOrders({ page: 1, limit: 50, sortBy: "updatedAt", sortOrder: "desc" });
  const orders = ordersQuery.data?.data ?? [];

  useEffect(() => {
    if (initialOrderId) {
      setSelectedOrderId(initialOrderId);
      return;
    }

    if (!selectedOrderId && orders.length) {
      setSelectedOrderId(orders[0].id);
    }
  }, [initialOrderId, orders, selectedOrderId]);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId),
    [orders, selectedOrderId],
  );

  useEffect(() => {
    if (!selectedOrder?.phases?.length) {
      setSelectedPhaseId("");
      return;
    }

    const activeOrPending = selectedOrder.phases.find(
      (phase) => phase.status === "ACTIVE" || phase.status === "PENDING" || phase.status === "IN_REVIEW",
    );

    setSelectedPhaseId(activeOrPending?.id || selectedOrder.phases[0].id || "");
  }, [selectedOrder]);

  const startPhase = useStartSellerPhase(selectedOrderId || "");
  const completePhase = useCompleteSellerPhase(selectedOrderId || "");
  const submitDeliverable = useSubmitSellerDeliverable(selectedOrderId || "");

  const messagesQuery = useOrderCommunications(selectedOrderId, { page: 1, limit: PAGE_SIZE });
  const sendMessage = useSendOrderCommunication();
  const markRead = useMarkOrderCommunicationRead(selectedOrderId || "");

  const handleStartPhase = async () => {
    if (!selectedPhaseId) {
      toast.error("Select a phase first.");
      return;
    }

    try {
      await startPhase.mutateAsync({ phaseId: selectedPhaseId });
      toast.success("Phase started.");
      await ordersQuery.refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleCompletePhase = async () => {
    if (!selectedPhaseId) {
      toast.error("Select a phase first.");
      return;
    }

    try {
      await completePhase.mutateAsync({ phaseId: selectedPhaseId });
      toast.success("Phase completed.");
      await ordersQuery.refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleSubmitDeliverable = async () => {
    if (!selectedPhaseId || !deliverableTitle.trim()) {
      toast.error("Phase and deliverable title are required.");
      return;
    }

    try {
      await submitDeliverable.mutateAsync({
        phaseId: selectedPhaseId,
        title: deliverableTitle.trim(),
        description: deliverableDescription.trim() || undefined,
        fileUrl: deliverableFileUrl.trim() || undefined,
      });
      toast.success("Deliverable submitted.");
      setDeliverableTitle("");
      setDeliverableDescription("");
      setDeliverableFileUrl("");
      await ordersQuery.refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleSendMessage = async () => {
    if (!selectedOrderId || !messageText.trim()) {
      toast.error("Select an order and write a message.");
      return;
    }

    try {
      await sendMessage.mutateAsync({
        orderId: selectedOrderId,
        message: messageText.trim(),
      });
      setMessageText("");
      await messagesQuery.refetch();
      toast.success("Message sent.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Manage Phases"
        description="Run phase transitions, submit deliverables, and communicate with clients by order."
      />

      <div className="grid grid-cols-1 gap-3 rounded-lg border bg-background p-4 md:grid-cols-2">
        <div>
          <p className="mb-1 text-xs text-muted-foreground">Select Order</p>
          <select
            className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
            value={selectedOrderId}
            onChange={(event) => setSelectedOrderId(event.target.value)}
          >
            <option value="">Select order</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.title} ({order.status})
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-1 text-xs text-muted-foreground">Select Phase</p>
          <select
            className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
            value={selectedPhaseId}
            onChange={(event) => setSelectedPhaseId(event.target.value)}
            disabled={!selectedOrder?.phases?.length}
          >
            <option value="">Select phase</option>
            {(selectedOrder?.phases || []).map((phase) => (
              <option key={phase.id} value={phase.id}>
                {phase.title} ({phase.status || "PENDING"})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-lg border bg-background p-4">
        <h2 className="font-semibold">Phase Actions</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={() => void handleStartPhase()} disabled={startPhase.isPending || !selectedPhaseId}>
            Start Phase
          </Button>
          <Button
            variant="outline"
            onClick={() => void handleCompletePhase()}
            disabled={completePhase.isPending || !selectedPhaseId}
          >
            Complete Phase
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-background p-4">
        <h2 className="font-semibold">Submit Deliverable</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input
            value={deliverableTitle}
            onChange={(event) => setDeliverableTitle(event.target.value)}
            placeholder="Deliverable title"
          />
          <Input
            value={deliverableFileUrl}
            onChange={(event) => setDeliverableFileUrl(event.target.value)}
            placeholder="Deliverable file URL"
          />
          <div className="md:col-span-2">
            <Textarea
              value={deliverableDescription}
              onChange={(event) => setDeliverableDescription(event.target.value)}
              placeholder="Deliverable description"
              className="min-h-24"
            />
          </div>
        </div>
        <Button className="mt-3" onClick={() => void handleSubmitDeliverable()} disabled={submitDeliverable.isPending || !selectedPhaseId}>
          Submit Deliverable
        </Button>
      </div>

      <div className="rounded-lg border bg-background p-4">
        <h2 className="font-semibold">Order Communication</h2>
        <div className="mt-3 flex gap-2">
          <Input
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            placeholder="Type message for order"
          />
          <Button onClick={() => void handleSendMessage()} disabled={sendMessage.isPending || !selectedOrderId}>
            Send
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {!selectedOrderId ? (
            <p className="text-sm text-muted-foreground">Select an order to load messages.</p>
          ) : messagesQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading messages...</p>
          ) : (messagesQuery.data?.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          ) : (
            (messagesQuery.data?.data ?? []).map((message) => (
              <div key={message.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm">{message.message}</p>
                  {!message.isRead ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void markRead.mutateAsync(message.id)}
                    >
                      Mark Read
                    </Button>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{message.createdAt || "-"}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerPhasesManager;
