"use client";

import {
  BriefcaseBusiness,
  Layers3,
  ListChecks,
  Gauge,
  MessageCircleMore,
  Settings2,
  UserCheck2,
} from "lucide-react";

import {
  CommonSidebar,
  type SidebarItem,
} from "@/components/shared/Sidebar/Sidebar";

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard/seller", icon: Gauge },
  {
    label: "Manage Services",
    href: "/dashboard/seller/manage-services",
    icon: BriefcaseBusiness,
  },
  {
    label: "Manage Orders",
    href: "/dashboard/seller/manage-orders",
    icon: Layers3,
  },
  {
    label: "Manage Phases",
    href: "/dashboard/seller/manage-phases",
    icon: ListChecks,
  },
  {
    label: "My Profile",
    href: "/dashboard/seller/profile",
    icon: UserCheck2,
  },
  {
    label: "Conversations",
    href: "/dashboard/seller/conversation",
    icon: MessageCircleMore,
  },
  { label: "Settings", href: "/dashboard/seller/settings", icon: Settings2 },
];

export function SellerSidebarComponents() {
  return (
    <CommonSidebar
      items={SIDEBAR_ITEMS}
      brandTitle="Job seller"
      brandHref="/dashboard/seller"
      brandIcon={<UserCheck2 className="size-4" />}
      footerText="Manage your seller activities from one place."
    />
  );
}
