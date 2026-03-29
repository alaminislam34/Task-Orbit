// src/components/shared/UserActionDropDown.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup, // IMPORTANT
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  UserCheck,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Eye,
} from "lucide-react";

interface UserActionDropdownProps {
  user: any;
  onStatusChange: (id: string, status: string) => void;
}

export function UserActionDropdown({
  user,
  onStatusChange,
}: UserActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 hover:bg-slate-100 transition-colors"
        >
          <MoreHorizontal className="size-4 text-slate-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 shadow-xl border-slate-200"
      >
        {/* Wrap content in a group to satisfy Base UI requirements */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[10px] text-slate-400 font-bold uppercase py-2">
            User Options
          </DropdownMenuLabel>
          <DropdownMenuItem className="cursor-pointer gap-2">
            <Eye className="size-4 text-slate-400" /> View Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2">
            <Mail className="size-4 text-slate-400" /> Send Message
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[10px] text-slate-400 font-bold uppercase py-2">
            Account Status
          </DropdownMenuLabel>
          {user.status !== "Verified" && (
            <DropdownMenuItem
              onClick={() => onStatusChange(user.id, "Verified")}
              className="cursor-pointer gap-2 text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50"
            >
              <UserCheck className="size-4" /> Verify Account
            </DropdownMenuItem>
          )}

          {user.status !== "Suspended" ? (
            <DropdownMenuItem
              onClick={() => onStatusChange(user.id, "Suspended")}
              className="cursor-pointer gap-2 text-rose-600 focus:text-rose-700 focus:bg-rose-50"
            >
              <ShieldAlert className="size-4" /> Suspend User
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => onStatusChange(user.id, "Verified")}
              className="cursor-pointer gap-2 text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50"
            >
              <ShieldCheck className="size-4" /> Lift Suspension
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
