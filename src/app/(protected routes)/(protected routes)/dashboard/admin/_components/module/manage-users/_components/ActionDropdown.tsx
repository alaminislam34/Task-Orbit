import { CheckCheck, EllipsisVertical, Eye, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { User } from "../types";

interface ActionDropdownProps {
  user: User;
  onView: (user: User) => void;
  onStatusChange: (userId: string, status: "active" | "inactive") => void;
}

const ActionDropdown = ({ user, onView, onStatusChange }: ActionDropdownProps) => {
  const isActive = user.status === "active";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button aria-label="Open user actions" size="icon-sm" variant="ghost" />}
      >
        <EllipsisVertical className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => onView(user)}>
          <Eye className="size-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isActive}
          onClick={() => onStatusChange(user.id, "active")}
        >
          <CheckCheck className="size-4" />
          Activate
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!isActive}
          onClick={() => onStatusChange(user.id, "inactive")}
          variant="destructive"
        >
          <XCircle className="size-4" />
          Deactivate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionDropdown;
