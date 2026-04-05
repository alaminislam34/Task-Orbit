"use client";

import { useEffect, useState } from "react"; // ২.১: useEffect এবং useState ইমপোর্ট করুন
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Menu,
  Briefcase,
  UserCircle,
  LogIn,
  Compass,
  LogOut,
  LayoutDashboard,
  User,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "../theme/ThemeToggler";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useStateContext } from "@/providers/StateProvider";
import { useRouter } from "next/navigation";
import { AccountType } from "@/types/state.types";
import { useUserStore } from "@/store/useUserStore";
import { useUser } from "@/hooks/useUser";

const Navbar = () => {
  const { setSignUpModal, setSignInModal, setAccountType } = useStateContext();
  const router = useRouter();
  const { user, logout } = useUserStore();
  const { data: userData, isLoading } = useUser();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData, setUser]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleJoin = () => {
    setAccountType(AccountType.SELLER);
    setSignUpModal(true);
    router.push("/start_selling?source=top_nav");
  };

  const getDashboardLink = () => {
    if (user?.role === "ADMIN") return "/dashboard/admin";
    switch (user?.accountType) {
      case AccountType.SELLER: return "/dashboard/seller";
      case AccountType.JOB_SEEKER: return "/dashboard/job_seeker";
      case AccountType.CLIENT: return "/dashboard/client";
      default: return "/dashboard";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="max-w-360 w-11/12 mx-auto flex h-16 items-center justify-between gap-4">

        {/* Left: Logo & Search */}
        <div className="flex items-center gap-6 flex-1 lg:flex-none">
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
            <Image
              src={"/logos/T_O.png"}
              alt="TaskOrbit Logo"
              width={120}
              height={40}
              className="object-contain h-14 w-auto"
            />
          </Link>

          <div className="hidden lg:flex relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="What service are you looking for today?"
              className="pl-10 h-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary w-full"
            />
          </div>
        </div>

        {/* Right: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          <div className="flex items-center gap-6 text-sm font-semibold text-muted-foreground">
            <Link href="/explore" className="hover:text-primary transition-colors">Explore</Link>
            <Link href="/career" className="hover:text-primary transition-colors">Career</Link>
            {mounted && !user && (
              <Link href={"/start_selling"} onClick={() => setAccountType(AccountType.SELLER)}>
                <span className="hover:text-primary transition-colors cursor-pointer">Become a Seller</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3 border-l pl-6">
            {mounted && user && (
              <p className="text-sm font-semibold text-muted-foreground">
                $ 0.00
              </p>
            )}
            <ModeToggle />

            {mounted ? (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <div className="flex items-center gap-2 cursor-pointer transition-transform active:scale-95">
                      <Avatar className="h-9 w-9 border-2 border-transparent hover:border-primary/20">
                        <AvatarImage src={user.image || ""} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-60 mt-2 shadow-xl border-muted-foreground/10" align="end">
                    <div className="px-3 py-2.5">
                      <p className="text-sm font-bold leading-none truncate">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground mt-1.5 truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(getDashboardLink())} className="cursor-pointer py-2.5 gap-3">
                      <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer py-2.5 gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer py-2.5 gap-3">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="text-destructive focus:text-destructive focus:bg-destructive/5 cursor-pointer py-2.5 gap-3 font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={() => setSignInModal(true)} className="font-semibold px-4">
                    Sign In
                  </Button>
                  <Button size="sm" className="px-6 font-bold shadow-sm" onClick={handleJoin}>
                    Join
                  </Button>
                </div>
              )
            ) : (
              <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ModeToggle />
          <Sheet>
            <SheetTrigger className="p-2 hover:bg-muted rounded-md focus:outline-none">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0 flex flex-col border-l">
              <SheetHeader className="p-6 text-left border-b bg-muted/20">
                <SheetTitle className="flex items-center gap-3 text-primary">
                  {mounted && user ? (
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={user.image} />
                      <AvatarFallback className="font-bold">{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : <UserCircle className="h-7 w-7 text-muted-foreground" />}
                  <span className="truncate text-base font-bold">
                    {mounted && user ? user.name : "Welcome to TaskOrbit"}
                  </span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">General</h4>
                  <div className="grid gap-3">
                    <div onClick={() => router.push("/explore")} className="flex items-center gap-3 font-semibold text-sm cursor-pointer p-2 hover:bg-muted rounded-lg transition-colors">
                      <Compass className="h-5 w-5 text-muted-foreground" /> Explore Jobs
                    </div>
                    {mounted && user && (
                      <div onClick={() => router.push(getDashboardLink())} className="flex items-center gap-3 font-semibold text-sm cursor-pointer p-2 hover:bg-muted rounded-lg transition-colors">
                        <LayoutDashboard className="h-5 w-5 text-muted-foreground" /> Dashboard
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="opacity-50" />

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Account</h4>
                  {mounted && user ? (
                    <button onClick={() => logout()} className="w-full flex items-center gap-3 font-semibold text-sm text-destructive p-2 hover:bg-destructive/5 rounded-lg transition-colors text-left">
                      <LogOut className="h-5 w-5" /> Log Out
                    </button>
                  ) : (
                    <div className="grid gap-3">
                      <button onClick={() => setSignInModal(true)} className="flex items-center gap-3 font-semibold text-sm text-left p-2 hover:bg-muted rounded-lg transition-colors">
                        <LogIn className="h-5 w-5 text-muted-foreground" /> Sign In
                      </button>
                      <div onClick={() => { setAccountType(AccountType.SELLER); router.push("/start_selling"); }} className="flex items-center gap-3 font-semibold text-sm cursor-pointer p-2 hover:bg-muted rounded-lg transition-colors">
                        <Briefcase className="h-5 w-5 text-muted-foreground" /> Become a Seller
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {mounted && !user && (
                <div className="p-6 border-t mt-auto bg-muted/30">
                  <Button className="w-full font-bold h-12 shadow-lg" size="lg" onClick={handleJoin}>
                    Join TaskOrbit
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;