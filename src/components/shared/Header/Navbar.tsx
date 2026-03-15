"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Search, Menu, Globe } from "lucide-react";

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

const Navbar = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc =
    theme === "dark" ? "/logos/taskorbit(dark).png" : "/logos/taskorbit.png";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={mounted ? logoSrc : "/logos/taskorbit.png"}
              alt="TaskOrbit Logo"
              width={130}
              height={40}
              className="object-contain"
            />
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:flex relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="What service are you looking for today?"
              className="pl-10"
            />
          </div>
        </div>

        {/* Right: Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/jobs" className="hover:text-primary transition-colors">
              Explore
            </Link>
            <Link
              href="/seller"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <Globe className="h-4 w-4" />
              Become a Seller
            </Link>
          </div>

          <div className="flex items-center gap-3 border-l pl-6">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-semibold">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="px-5 font-semibold">
                Join
              </Button>
            </Link>
            <ModeToggle />
          </div>
        </nav>

        {/* Mobile Navigation (Hamburger) */}
        <div className="flex md:hidden items-center gap-4">
          <ModeToggle />
          <Sheet>
            <SheetTrigger>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-75">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                <Input placeholder="Search services..." className="mb-4" />
                <Link
                  href="/jobs"
                  className="text-lg font-medium border-b pb-2"
                >
                  Explore Jobs
                </Link>
                <Link
                  href="/seller"
                  className="text-lg font-medium border-b pb-2"
                >
                  Become a Seller
                </Link>
                <Link
                  href="/login"
                  className="text-lg font-medium border-b pb-2"
                >
                  Sign In
                </Link>
                <Button className="w-full mt-4">Join TaskOrbit</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
