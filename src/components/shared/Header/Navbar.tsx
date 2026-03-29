"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Menu,
  Globe,
  Briefcase,
  UserCircle,
  LogIn,
  Compass,
  ArrowRight,
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
import { Separator } from "@/components/ui/separator";
// import ServicesNavbarSection from "./ServicesNavbar";
import { useStateContext } from "@/providers/StateProvider";

const Navbar = () => {
  const { setSignUpModal, setSignInModal } = useStateContext();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="relative w-full">
        <div className="max-w-360 w-11/12 mx-auto flex h-16 items-center justify-between">
          {/* Left: Logo & Search */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Image
                src={"/logos/T_O.png"}
                alt="TaskOrbit Logo"
                width={150}
                height={55}
                className="object-contain w-16 h-auto"
              />
            </Link>

            <div className="hidden lg:flex relative w-80 lg:w-100 xl:w-120">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="What service are you looking for today?"
                className="pl-10 h-9 bg-muted/50 focus-visible:ring focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Right: Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-6 text-sm font-semibold text-muted-foreground">
              <Link
                href="/explore"
                className="hover:text-primary transition-colors"
              >
                Explore
              </Link>
              <Link
                href="/start_selling?source=top_nav"
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                <Globe className="h-4 w-4" />
                Become a Seller
              </Link>
            </div>
            <div className="flex items-center gap-3 border-l pl-6">
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSignInModal(true)}
                >
                  Sign In
                </Button>
              </div>
              <Link href="/start_selling?source=top_nav">
                <Button
                  size="sm"
                  className="px-5"
                  onClick={() => setSignUpModal(true)}
                >
                  Join
                </Button>
              </Link>
              <ModeToggle />
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />
            <Sheet>
              <SheetTrigger>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-75 p-0 flex flex-col">
                <SheetHeader className="p-6 text-left border-b">
                  <SheetTitle className="flex items-center gap-2 text-primary">
                    <UserCircle className="h-5 w-5" />
                    Welcome to TaskOrbit
                  </SheetTitle>
                </SheetHeader>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* Search in Mobile */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="What service are you looking for today?"
                      className="pl-10 py-5"
                    />
                  </div>

                  {/* Main Navigation */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      General
                    </h4>
                    <div className="grid gap-4">
                      <Link
                        href="/jobs"
                        className="flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3 font-medium">
                          <Compass className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                          Explore Jobs
                        </div>
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <Link
                        href="/start_selling?source=top_nav"
                        className="flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3 font-medium">
                          <Briefcase className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                          Become a Seller
                        </div>
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </div>
                  </div>

                  <Separator />

                  {/* Account Section */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Account
                    </h4>
                    <Link
                      href="/login"
                      className="flex items-center gap-3 font-medium"
                    >
                      <LogIn className="h-5 w-5 text-muted-foreground" />
                      Sign In
                    </Link>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="p-6 border-t mt-auto bg-muted/30">
                  <Button className="w-full font-bold h-12" size="lg">
                    Join TaskOrbit
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        {/* <ServicesNavbarSection /> */}
      </div>
    </header>
  );
};

export default Navbar;
