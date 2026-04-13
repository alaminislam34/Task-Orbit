"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, LayoutDashboard, Settings, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Define a proper interface instead of 'any'
interface UserData {
  name?: string;
  email?: string;
  image?: string | null;
}

interface UserMenuProps {
  user: UserData;
  logout: () => Promise<void>;
  getDashboardLink: () => string;
}

export const UserMenu = ({ user, logout, getDashboardLink }: UserMenuProps) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none" aria-label="Open user menu">
        <div className="flex items-center gap-2 cursor-pointer transition-transform active:scale-95 group">
          <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-primary/20 transition-all">
            <AvatarImage src={user.image || ""} alt={user?.name || "User"} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60 mt-2 shadow-xl border-muted-foreground/10" align="end">
        <div className="px-3 py-2.5">
          <p className="text-sm font-bold leading-none truncate">{user.name || "Account"}</p>
          <p className="text-xs leading-none text-muted-foreground mt-1.5 truncate">
            {user.email}
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => handleNavigation(getDashboardLink())}
          className="cursor-pointer py-2.5 gap-3"
        >
          <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          <span>Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleNavigation("/profile")}
          className="cursor-pointer py-2.5 gap-3"
        >
          <User className="h-4 w-4 text-muted-foreground" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleNavigation("/settings")}
          className="cursor-pointer py-2.5 gap-3"
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-destructive focus:text-destructive focus:bg-destructive/5 cursor-pointer py-2.5 gap-3 font-medium"
        >
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};