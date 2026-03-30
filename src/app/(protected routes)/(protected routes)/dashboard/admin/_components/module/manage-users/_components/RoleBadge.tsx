import { Badge } from "@/components/ui/badge";

import type { UserRole } from "../types";
import { toTitleCase } from "../utils";

interface RoleBadgeProps {
  role: UserRole;
}

const roleClassMap: Record<UserRole, string> = {
  client: "bg-sky-100 text-sky-800 hover:bg-sky-100",
  seller: "bg-violet-100 text-violet-800 hover:bg-violet-100",
  recruiter: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100",
  admin: "bg-rose-100 text-rose-800 hover:bg-rose-100",
  normal: "bg-slate-100 text-slate-700 hover:bg-slate-100",
};

const RoleBadge = ({ role }: RoleBadgeProps) => {
  return (
    <Badge className={roleClassMap[role]} variant="secondary">
      {toTitleCase(role)}
    </Badge>
  );
};

export default RoleBadge;
