"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Globe,
  Copyright,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

// Data structure keeps the component clean and makes it easy to update links
const footerLinks = [
  {
    title: "Categories",
    links: [
      { name: "Graphics & Design", href: "#" },
      { name: "Digital Marketing", href: "#" },
      { name: "Writing & Translation", href: "#" },
      { name: "Video & Animation", href: "#" },
      { name: "Music & Audio", href: "#" },
      { name: "Programming & Tech", href: "#" },
    ],
  },
  {
    title: "About",
    links: [
      { name: "Careers", href: "#" },
      { name: "Press & News", href: "#" },
      { name: "Partnerships", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Help & Support", href: "#" },
      { name: "Trust & Safety", href: "#" },
      { name: "Selling on TaskOrbit", href: "#" },
      { name: "Buying on TaskOrbit", href: "#" },
    ],
  },
  {
    title: "Community",
    links: [
      { name: "Customer Success Stories", href: "#" },
      { name: "Community Hub", href: "#" },
      { name: "Forum", href: "#" },
      { name: "Blog", href: "#" },
    ],
  },
];

const FooterSection = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc =
    theme === "dark" ? "/logos/taskorbit(dark).png" : "/logos/taskorbit.png";

  return (
    <footer className="w-full border-t bg-background pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-8">
        {/* Top Section: Links Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12 mb-12">
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h4 className="font-bold text-base text-foreground">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-6" />

        {/* Bottom Section: Copyright & Socials */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand & Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={mounted ? logoSrc : "/logos/taskorbit.png"}
                alt="TaskOrbit Logo"
                width={120}
                height={35}
                className="object-contain"
              />
            </Link>
            <span className="flex items-center text-sm text-muted-foreground font-medium">
              <Copyright className="h-4 w-4 mr-1" />
              {new Date().getFullYear()} TaskOrbit Ltd. All rights reserved.
            </span>
          </div>

          {/* Social Links & Settings */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-5 w-5 fill-current" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5 fill-current" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-primary"
              >
                <Linkedin className="h-5 w-5 fill-current" />
                <span className="sr-only">LinkedIn</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
            </div>

            {/* Optional: Language/Currency Selectors */}
            <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground font-medium flex items-center gap-2 hover:text-primary"
              >
                <Globe className="h-4 w-4" />
                English
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground font-medium hover:text-primary"
              >
                $ USD
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
