import { Badge } from "@/components/ui/badge";

import type { ManagedUser } from "../types";

interface StatusBadgeProps {
  status: ManagedUser["status"];
}

const styles: Record<ManagedUser["status"], string> = {
  active: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  inactive: "bg-amber-100 text-amber-900 hover:bg-amber-100",
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <Badge className={styles[status]} variant="secondary">
      {status === "active" ? "Active" : "Inactive"}
    </Badge>
  );
};

export default StatusBadge;
