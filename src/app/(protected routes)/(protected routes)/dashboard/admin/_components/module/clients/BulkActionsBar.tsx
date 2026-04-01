"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearAll: () => void;
  onChangeStatus: (status: "ONLINE" | "OFFLINE") => void;
  onMarkVerified: () => void;
  onDelete: () => void;
}

export default function BulkActionsBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearAll,
  onChangeStatus,
  onMarkVerified,
  onDelete,
}: BulkActionsBarProps) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const selectionLabel = useMemo(
    () => `${selectedCount} selected`,
    [selectedCount],
  );

  const applyAndClose = (action: () => void, message: string) => {
    action();
    setOpen(false);
    toast.success(message);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="ml-2" disabled={!selectedCount}>
            Bulk Actions{selectedCount ? ` (${selectedCount})` : ""}
          </Button>
        }
      />

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Bulk Actions</DialogTitle>
          <DialogDescription>
            Choose one action to apply to the current selection.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/30 px-3 py-2 text-sm font-medium">
          {selectionLabel}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() =>
              applyAndClose(
                onSelectAll,
                `All ${totalCount} clients are now selected.`,
              )
            }
          >
            Select all ({totalCount})
          </Button>

          <Button
            variant="outline"
            className="justify-start"
            onClick={() => applyAndClose(onClearAll, "Selection cleared.")}
          >
            Unselect all
          </Button>

          <Button
            variant="outline"
            className="justify-start"
            onClick={() =>
              applyAndClose(
                () => onChangeStatus("ONLINE"),
                "Status changed to online.",
              )
            }
          >
            Set status: Online
          </Button>

          <Button
            variant="outline"
            className="justify-start"
            onClick={() =>
              applyAndClose(
                () => onChangeStatus("OFFLINE"),
                "Status changed to offline.",
              )
            }
          >
            Set status: Offline
          </Button>

          <Button
            variant="outline"
            className="justify-start sm:col-span-2"
            onClick={() =>
              applyAndClose(
                onMarkVerified,
                "Selected clients marked as verified.",
              )
            }
          >
            Mark verified
          </Button>

          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogTrigger
              render={
                <Button className="justify-start sm:col-span-2" variant="destructive">
                  <Trash2 className="mr-1.5 h-4 w-4" /> Delete selected clients
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete selected clients?</DialogTitle>
                <DialogDescription>
                  This will permanently remove {selectedCount} selected client(s).
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete();
                    setConfirmOpen(false);
                    setOpen(false);
                    toast.success("Selected clients deleted.");
                  }}
                >
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
