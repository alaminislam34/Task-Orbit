import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { User } from "../types";
import { formatDate, getInitials, toTitleCase } from "../utils";
import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";

interface UserModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

const UserModal = ({ user, open, onOpenChange }: UserModalProps) => {
  if (!user) {
    return null;
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Full information for moderation and account actions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-4">
            <Avatar size="lg">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg border p-3">
              <p className="mb-1 text-xs text-muted-foreground">Role</p>
              <RoleBadge role={user.role} />
            </div>
            <div className="rounded-lg border p-3">
              <p className="mb-1 text-xs text-muted-foreground">Status</p>
              <StatusBadge status={user.status} />
            </div>
            <div className="rounded-lg border p-3">
              <p className="mb-1 text-xs text-muted-foreground">Created Date</p>
              <p className="font-medium">{formatDate(user.createdAt)}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="mb-1 text-xs text-muted-foreground">Source Status</p>
              <p className="font-medium">{toTitleCase(user.sourceStatus?.toLowerCase() ?? "N/A")}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
