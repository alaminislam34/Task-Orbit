import { Badge } from "@/components/ui/badge";

import type { ApplicationStatus } from "../types";
import { STATUS_LABELS } from "../utils";

interface StatusBadgeProps {
  status: ApplicationStatus;
}

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  pending: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  accepted: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  rejected: "bg-rose-100 text-rose-800 hover:bg-rose-100",
  shortlisted: "bg-blue-100 text-blue-800 hover:bg-blue-100",
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <Badge className={STATUS_STYLES[status]} variant="secondary">
      {STATUS_LABELS[status]}
    </Badge>
  );
};

export default StatusBadge;
