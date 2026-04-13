"use client";

import {
  BriefcaseBusiness,
  CreditCard,
  FileText,
  FolderKanban,
  Gauge,
  Settings,
  Shield,
  Star,
  UserCheck2,
  Users,
  UserSearch,
} from "lucide-react";

import {
  CommonSidebar,
  type SidebarItem,
} from "@/components/shared/Sidebar/Sidebar";

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard/admin", icon: Gauge },
  { label: "Guests", href: "/dashboard/admin/manage-users", icon: Users },
  {
    label: "Clients",
    href: "/dashboard/admin/manage-clients",
    icon: UserSearch,
  },
  {
    label: "Sellers",
    href: "/dashboard/admin/manage-sellers",
    icon: BriefcaseBusiness,
  },
  {
    label: "Recruiters",
    href: "/dashboard/admin/manage-recruiters",
    icon: UserCheck2,
  },

  {
    label: "Projects",
    href: "/dashboard/admin/manage-projects",
    icon: FolderKanban,
  },
  {
    label: "Jobs",
    href: "/dashboard/admin/manage-jobs",
    icon: BriefcaseBusiness,
  },
  {
    label: "Applications",
    href: "/dashboard/admin/manage-applications",
    icon: FileText,
  },
  {
    label: "Payments",
    href: "/dashboard/admin/manage-payments",
    icon: CreditCard,
  },
  { label: "Reviews", href: "/dashboard/admin/manage-reviews", icon: Star },
  { label: "Reports", href: "/dashboard/admin/manage-reports", icon: FileText },
  {
    label: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebarComponents() {
  return (
    <CommonSidebar
      items={SIDEBAR_ITEMS}
      brandTitle="TaskOrbit Admin"
      brandHref="/dashboard/admin"
      brandIcon={<Shield className="size-4" />}
      footerText="Manage platform operations from one place."
    />
  );
}
