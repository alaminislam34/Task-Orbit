"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/shared/theme/ThemeToggler";

const OnboardingNavbar = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc =
    theme === "dark" ? "/logos/taskorbit(dark).png" : "/logos/taskorbit.png";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 md:px-12">
        {/* Left: Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={mounted ? logoSrc : "/logos/taskorbit.png"}
              alt="TaskOrbit Logo"
              width={140}
              height={50}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <ModeToggle />

          <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

          {/* Exit Button */}
          <Link href="/">
            <Button
              variant="ghost"
              className="group gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full px-5 transition-all"
            >
              <span className="hidden sm:inline font-semibold">Exit Setup</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default OnboardingNavbar;
