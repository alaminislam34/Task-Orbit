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
  Users,
  BriefcaseBusinessIcon,
  UserSearch,
  UserCheck,
} from "lucide-react";

import {
  AdminSidebar,
  type AdminSidebarItem,
} from "@/components/shared/Sidebar/Sidebar";

const SIDEBAR_ITEMS: AdminSidebarItem[] = [
  { label: "Dashboard", href: "/dashboard/super-admin", icon: Gauge },
  {
    label: "Manage Clients",
    href: "/dashboard/super-admin/manage-clients",
    icon: UserCheck,
  },
  {
    label: "Manage Sellers",
    href: "/dashboard/super-admin/manage-sellers",
    icon: BriefcaseBusinessIcon,
  },
  {
    label: "Manage Recruiters",
    href: "/dashboard/super-admin/manage-recruiters",
    icon: UserSearch,
  },
  {
    label: "Users",
    href: "/dashboard/super-admin/manage-users",
    icon: Users,
  },
  {
    label: "Manage Orders",
    href: "/dashboard/super-admin/manage-orders",
    icon: CreditCard,
  },
  {
    label: "Manage Projects",
    href: "/dashboard/super-admin/manage-projects",
    icon: FolderKanban,
  },
  {
    label: "Manage Jobs",
    href: "/dashboard/super-admin/manage-jobs",
    icon: BriefcaseBusiness,
  },
  {
    label: "Manage Applications",
    href: "/dashboard/super-admin/manage-applications",
    icon: FileText,
  },
  {
    label: "Manage Payments",
    href: "/dashboard/super-admin/manage-payments",
    icon: CreditCard,
  },
  {
    label: "Manage Reviews",
    href: "/dashboard/super-admin/manage-reviews",
    icon: Star,
  },
  {
    label: "Manage Reports",
    href: "/dashboard/super-admin/manage-reports",
    icon: FileText,
  },
  {
    label: "Settings",
    href: "/dashboard/super-admin/settings",
    icon: Settings,
  },
];

export function SuperAdminSidebar() {
  return (
    <AdminSidebar
      items={SIDEBAR_ITEMS}
      brandTitle="TaskOrbit Admin"
      brandHref="/dashboard/super-admin"
      brandIcon={<Shield className="size-4" />}
      footerText="Manage platform operations from one place."
    />
  );
}
