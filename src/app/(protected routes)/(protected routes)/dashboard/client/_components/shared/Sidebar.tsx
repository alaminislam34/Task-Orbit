"use client";

import {
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
  { label: "Dashboard", href: "/dashboard/client", icon: Gauge },
  {
    label: "My Profile",
    href: "/dashboard/client/profile",
    icon: UserCheck2,
  },
  {
    label: "My Applications",
    href: "/dashboard/client/applications",
    icon: FileTextIcon,
  },
  { label: "Settings", href: "/dashboard/client/settings", icon: Settings2 },
];

export function ClientSidebarComponents() {
  return (
    <CommonSidebar
      items={SIDEBAR_ITEMS}
      brandTitle="Client"
      brandHref="/dashboard/client"
      brandIcon={<UserCheck2 className="size-4" />}
      footerText="Manage your Client activities from one place."
    />
  );
}
