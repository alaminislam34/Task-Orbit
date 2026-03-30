"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

export type AdminSidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

type AdminSidebarProps = {
  items: AdminSidebarItem[];
  brandTitle: string;
  brandHref: string;
  brandIcon: ReactNode;
  sectionTitle?: string;
  footerText?: string;
};

function AnimatedLabel({
  children,
  isVisible,
  className,
}: {
  children: ReactNode;
  isVisible: boolean;
  className?: string;
}) {
  return (
    <AnimatePresence initial={false}>
      {isVisible ? (
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className={className}
        >
          {children}
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}

export function AdminSidebar({
  items,
  brandTitle,
  brandHref,
  brandIcon,
  sectionTitle = "Navigation",
  footerText,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();

  const showLabels = state === "expanded" || isMobile;

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={brandTitle}
              render={<Link href={brandHref} />}
            >
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                {brandIcon}
              </div>

              <AnimatedLabel isVisible={showLabels} className="font-semibold">
                {brandTitle}
              </AnimatedLabel>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <AnimatedLabel isVisible={showLabels}>{sectionTitle}</AnimatedLabel>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== brandHref && pathname.startsWith(item.href));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      isActive={isActive}
                      render={
                        <Link
                          href={item.href}
                          className={clsx(
                            "flex items-center gap-2 w-full h-full px-2 py-1.5 rounded-md transition-colors duration-200",
                            isActive
                              ? "bg-primary/10 text-white dark:bg-primary/20"
                              : "hover:bg-accent",
                          )}
                        />
                      }
                      className={clsx("transition-colors duration-200")}
                    >
                      <item.icon className="size-4" />
                      <AnimatedLabel isVisible={showLabels}>
                        {item.label}
                      </AnimatedLabel>
                    </SidebarMenuButton>

                    {item.badge && showLabels ? (
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {footerText ? (
        <SidebarFooter>
          <AnimatedLabel
            isVisible={showLabels}
            className="px-2 text-xs text-sidebar-foreground/70"
          >
            {footerText}
          </AnimatedLabel>
        </SidebarFooter>
      ) : null}

      <SidebarRail />
    </Sidebar>
  );
}
