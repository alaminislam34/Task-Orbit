"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useUser } from "@/hooks/useUser";
import { AccountType } from "@/types/state.types";
import { ModeToggle } from "../theme/ThemeToggler";

import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { DesktopNav } from "./DesktopNav";
import { UserMenu } from "./UserMenu";
import { AuthButtons } from "./AuthButtons";
import { MobileNav } from "./MobileNav";
import { NavbarSkeleton } from "./NavbarSkeleton";
import { useLogout } from "@/hooks/useLogout";

const Navbar = () => {
  const { user } = useUserStore();
  const { data: userData, isLoading } = useUser();
  const handleLogout = useLogout();
  const setUser = useUserStore((state) => state.setUser);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (userData !== undefined) {
      setUser(userData);
    }
  }, [userData, setUser]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getDashboardLink = () => {
    if (user?.role === "ADMIN") return "/dashboard/admin";
    switch (user?.accountType) {
      case AccountType.SELLER: return "/dashboard/seller";
      case AccountType.JOB_SEEKER: return "/dashboard/job_seeker";
      case AccountType.CLIENT: return "/dashboard/client";
      default: return "/dashboard";
    }
  };

  const renderAuthSection = () => {
    if (!mounted || isLoading) {
      return <NavbarSkeleton />;
    }
    if (user) {
      return (
        <>
          <p className="text-sm font-semibold text-muted-foreground mr-2 hidden lg:block" aria-label="Wallet Balance">
            $ 0.00
          </p>
          <UserMenu user={user} logout={handleLogout} getDashboardLink={getDashboardLink} />
        </>
      );
    }
    return <AuthButtons />;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="max-w-360 w-11/12 mx-auto flex h-16 items-center justify-between gap-4">

        {/* Left: Logo & Search */}
        <div className="flex items-center gap-6 flex-1 lg:flex-none">
          <Logo />
          <SearchBar />
        </div>

        {/* Right: Desktop Nav & User Menu */}
        <nav className="hidden md:flex items-center" aria-label="Main navigation">
          <DesktopNav user={user} mounted={mounted} />
          <div className="flex items-center gap-3 border-l pl-6">
            <ModeToggle />
            {renderAuthSection()}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ModeToggle />
          <MobileNav user={user} mounted={mounted} logout={handleLogout} getDashboardLink={getDashboardLink} />
        </div>

      </div>
    </header>
  );
};

export default Navbar;