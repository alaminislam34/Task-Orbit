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
} from "lucide-react";

import {
  AdminSidebar,
  type AdminSidebarItem,
} from "@/components/shared/admin/AdminSidebar";

const SIDEBAR_ITEMS: AdminSidebarItem[] = [
  { label: "Dashboard", href: "/dashboard/super-admin", icon: Gauge },
  { label: "Users", href: "/dashboard/super-admin/users", icon: Users },
  {
    label: "Projects",
    href: "/dashboard/super-admin/projects",
    icon: FolderKanban,
  },
  {
    label: "Jobs",
    href: "/dashboard/super-admin/jobs",
    icon: BriefcaseBusiness,
  },
  {
    label: "Applications",
    href: "/dashboard/super-admin/applications",
    icon: FileText,
  },
  {
    label: "Payments",
    href: "/dashboard/super-admin/payments",
    icon: CreditCard,
  },
  { label: "Reviews", href: "/dashboard/super-admin/reviews", icon: Star },
  { label: "Reports", href: "/dashboard/super-admin/reports", icon: FileText },
  { label: "Settings", href: "/dashboard/super-admin/settings", icon: Settings },
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
