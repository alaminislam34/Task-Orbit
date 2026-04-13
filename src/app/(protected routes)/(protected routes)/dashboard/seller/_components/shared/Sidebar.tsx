"use client";

import {
  FileText,
  FileTextIcon,
  Gauge,
  Settings2,
  UserCheck2,
} from "lucide-react";

import {
  CommonSidebar,
  type SidebarItem,
} from "@/components/shared/Sidebar/Sidebar";

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard/seller", icon: Gauge },
  { label: "My Profile", href: "/dashboard/seller/profile", icon: UserCheck2 },
  {
    label: "My Applications",
    href: "/dashboard/seller/applications",
    icon: FileTextIcon,
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
