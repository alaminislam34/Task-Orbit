"use client";

import { useState } from "react";
import {
  Menu,
  Briefcase,
  UserCircle,
  LogIn,
  Compass,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../theme/ThemeToggler";
import { useStateContext } from "@/providers/StateProvider";
import { useRouter } from "next/navigation";
import { AccountType } from "@/types/state.types";
import { Skeleton } from "@/components/ui/skeleton";

interface MobileNavProps {
  user: any;
  mounted: boolean;
  logout: () => Promise<void>;
  getDashboardLink: () => string;
  isLoading?: boolean;
}

export const MobileNav = ({ user, mounted, logout, getDashboardLink, isLoading }: MobileNavProps) => {
  const { setSignUpModal, setSignInModal, setAccountType } = useStateContext();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleJoin = () => {
    setAccountType(AccountType.SELLER);
    setSignUpModal(true);
    router.push("/start_selling?source=top_nav");
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
    <div className="flex md:hidden items-center gap-2">
      <ModeToggle />
      <Sheet>
        <SheetTrigger className="p-2 hover:bg-muted rounded-md focus:outline-none" aria-label="Open mobile menu">
          <Menu className="h-6 w-6" />
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] p-0 flex flex-col border-l">
          <SheetHeader className="p-6 text-left border-b bg-muted/20">
            <SheetTitle className="flex items-center gap-3 text-primary">
              {!mounted || isLoading ? (
                 <>
                   <Skeleton className="h-9 w-9 rounded-full" />
                   <Skeleton className="h-6 w-32 rounded-md" />
                 </>
              ) : mounted && user ? (
                <Avatar className="h-9 w-9 border">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback className="font-bold">{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              ) : (
                <UserCircle className="h-7 w-7 text-muted-foreground" />
              )}
              {mounted && !isLoading && (
                 <span className="truncate text-base font-bold">
                    {user ? user.name : "Welcome to TaskOrbit"}
                 </span>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">General</h4>
              <div className="grid gap-3">
                <div onClick={() => router.push("/explore")} className="flex items-center gap-3 font-semibold text-sm cursor-pointer p-2 hover:bg-muted rounded-lg transition-colors">
                  <Compass className="h-5 w-5 text-muted-foreground" /> Explore Jobs
                </div>
                {mounted && !isLoading && user && (
                  <div onClick={() => router.push(getDashboardLink())} className="flex items-center gap-3 font-semibold text-sm cursor-pointer p-2 hover:bg-muted rounded-lg transition-colors">
                    <LayoutDashboard className="h-5 w-5 text-muted-foreground" /> Dashboard
                  </div>
                )}
              </div>
            </div>

            <Separator className="opacity-50" />

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Account</h4>
              {!mounted || isLoading ? (
                  <div className="grid gap-3">
                     <Skeleton className="h-9 w-full rounded-md" />
                     <Skeleton className="h-9 w-full rounded-md" />
                  </div>
              ) : mounted && user ? (
                <button 
                  onClick={handleLogout} 
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 font-semibold text-sm text-destructive p-2 hover:bg-destructive/5 rounded-lg transition-colors text-left" 
                  aria-label="Log Out"
                >
                  {isLoggingOut ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-destructive border-t-transparent"/> : <LogOut className="h-5 w-5" />}
                  {isLoggingOut ? "Logging Out..." : "Log Out"}
                </button>
              ) : (
                <div className="grid gap-3">
                  <button onClick={() => setSignInModal(true)} className="flex items-center gap-3 font-semibold text-sm text-left p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Sign In">
                    <LogIn className="h-5 w-5 text-muted-foreground" /> Sign In
                  </button>
                  <div onClick={() => { setAccountType(AccountType.SELLER); router.push("/start_selling"); }} className="flex items-center gap-3 font-semibold text-sm cursor-pointer p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Become a Seller">
                    <Briefcase className="h-5 w-5 text-muted-foreground" /> Become a Seller
                  </div>
                </div>
              )}
            </div>
          </div>

          {mounted && !isLoading && !user && (
            <div className="p-6 border-t mt-auto bg-muted/30">
              <Button className="w-full font-bold h-12 shadow-lg" size="lg" onClick={handleJoin} aria-label="Join TaskOrbit">
                Join TaskOrbit
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
