import { CheckCheck, EllipsisVertical, Eye, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Application } from "../types";

interface ActionDropdownProps {
  application: Application;
  onView: (application: Application) => void;
  onStatusChange: (applicationId: string, status: "accepted" | "rejected") => void;
}

const ActionDropdown = ({
  application,
  onView,
  onStatusChange,
}: ActionDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button aria-label="Open actions" size="icon-sm" variant="ghost" />
        }
      >
        <EllipsisVertical className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => onView(application)}>
          <Eye className="size-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={application.status === "accepted"}
          onClick={() => onStatusChange(application.id, "accepted")}
        >
          <CheckCheck className="size-4" />
          Accept
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={application.status === "rejected"}
          onClick={() => onStatusChange(application.id, "rejected")}
          variant="destructive"
        >
          <XCircle className="size-4" />
          Reject
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionDropdown;
