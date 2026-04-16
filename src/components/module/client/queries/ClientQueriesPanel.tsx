"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  useAddClientQueryReply,
  useClientQueries,
  useCloseClientQuery,
  useCreateClientQuery,
  useReopenClientQuery,
} from "@/hooks/api";
import { getApiErrorMessage } from "@/lib/api-error";
import type { ClientQueryPriority, ClientQueryStatus } from "@/types/client.types";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const STATUS_FILTERS: Array<{ label: string; value: "ALL" | ClientQueryStatus }> = [
  { label: "All", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Closed", value: "CLOSED" },
];

const PRIORITY_FILTERS: Array<{ label: string; value: "ALL" | ClientQueryPriority }> = [
  { label: "All", value: "ALL" },
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
];

export default function ClientQueriesPanel() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | ClientQueryStatus>("ALL");
  const [priority, setPriority] = useState<"ALL" | ClientQueryPriority>("ALL");

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("billing");
  const [formPriority, setFormPriority] = useState<ClientQueryPriority>("MEDIUM");

  const [activeQueryId, setActiveQueryId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const filters = useMemo(
    () => ({
      page,
      limit: 10,
      search: search.trim() || undefined,
      status: status === "ALL" ? undefined : status,
      priority: priority === "ALL" ? undefined : priority,
      sortBy: "updatedAt" as const,
      sortOrder: "desc" as const,
    }),
    [page, search, status, priority],
  );

  const listQuery = useClientQueries(filters);
  const createQuery = useCreateClientQuery();
  const addReply = useAddClientQueryReply(activeQueryId || "");
  const closeQuery = useCloseClientQuery(activeQueryId || "");
  const reopenQuery = useReopenClientQuery(activeQueryId || "");

  const items = listQuery.data?.data ?? [];
  const activeQuery = items.find((item) => item.id === activeQueryId) || null;
  const meta = listQuery.data?.meta;

  const handleCreate = async () => {
    if (subject.trim().length < 3) {
      toast.error("Subject must be at least 3 characters.");
      return;
    }

    if (description.trim().length < 5) {
      toast.error("Description must be at least 5 characters.");
      return;
    }

    if (!category.trim()) {
      toast.error("Category is required.");
      return;
    }

    try {
      await createQuery.mutateAsync({
        subject: subject.trim(),
        description: description.trim(),
        category: category.trim(),
        priority: formPriority,
      });
      toast.success("Query created successfully.");
      setSubject("");
      setDescription("");
      setCategory("billing");
      setFormPriority("MEDIUM");
      await listQuery.refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleReply = async () => {
    if (!activeQueryId) {
      toast.error("Select a query first.");
      return;
    }

    if (!replyMessage.trim()) {
      toast.error("Reply message is required.");
      return;
    }

    try {
      await addReply.mutateAsync({ message: replyMessage.trim() });
      toast.success("Reply added.");
      setReplyMessage("");
      await listQuery.refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleClose = async () => {
    if (!activeQueryId) {
      return;
    }

    try {
      await closeQuery.mutateAsync();
      toast.success("Query closed.");
      await listQuery.refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleReopen = async () => {
    if (!activeQueryId) {
      return;
    }

    try {
      await reopenQuery.mutateAsync();
      toast.success("Query reopened.");
      await listQuery.refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Support Queries"
        description="Create and track support tickets for billing, order, and account issues."
      />

      <div className="rounded-xl border border-border/70 bg-background p-4">
        <h2 className="font-semibold">Create Query</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Subject" />
          <Input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
          <select
            className="h-10 rounded-md border bg-transparent px-3 text-sm"
            value={formPriority}
            onChange={(event) => setFormPriority(event.target.value as ClientQueryPriority)}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
          <Button onClick={() => void handleCreate()} disabled={createQuery.isPending}>Create</Button>
          <div className="md:col-span-2">
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe your issue"
              className="min-h-24"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-border/70 bg-background p-4 md:grid-cols-4">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search queries"
          className="md:col-span-2"
        />
        <select
          className="h-10 rounded-md border bg-transparent px-3 text-sm"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as "ALL" | ClientQueryStatus);
            setPage(1);
          }}
        >
          {STATUS_FILTERS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          className="h-10 rounded-md border bg-transparent px-3 text-sm"
          value={priority}
          onChange={(event) => {
            setPriority(event.target.value as "ALL" | ClientQueryPriority);
            setPage(1);
          }}
        >
          {PRIORITY_FILTERS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {listQuery.isLoading ? (
        <div className="rounded-xl border border-border/70 p-6 text-sm text-muted-foreground">Loading queries...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="rounded-xl border border-border/70 p-6 text-sm text-muted-foreground">No queries found.</div>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="w-full rounded-xl border border-border/70 bg-background p-4 text-left hover:bg-muted/40"
                  onClick={() => setActiveQueryId(item.id)}
                >
                  <p className="font-medium">{item.subject}</p>
                  <p className="text-xs text-muted-foreground">{item.status} • {item.priority}</p>
                </button>
              ))
            )}

            {meta ? (
              <div className="flex items-center justify-between rounded-xl border border-border/70 bg-background p-3 text-sm">
                <p className="text-muted-foreground">Page {meta.page} of {Math.max(1, meta.totalPages)}</p>
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
            <h2 className="font-semibold">Query Actions</h2>
            {!activeQuery ? (
              <p className="mt-2 text-sm text-muted-foreground">Select a query from the list.</p>
            ) : (
              <div className="mt-3 space-y-3">
                <div className="rounded-lg border border-border/60 p-3 text-sm">
                  <p className="font-medium">{activeQuery.subject}</p>
                  <p className="text-xs text-muted-foreground">Status: {activeQuery.status}</p>
                </div>

                <Textarea
                  value={replyMessage}
                  onChange={(event) => setReplyMessage(event.target.value)}
                  placeholder="Reply message"
                  className="min-h-24"
                />

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => void handleReply()} disabled={addReply.isPending}>
                    Add Reply
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => void handleClose()} disabled={closeQuery.isPending}>
                    Close
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => void handleReopen()} disabled={reopenQuery.isPending}>
                    Reopen
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
