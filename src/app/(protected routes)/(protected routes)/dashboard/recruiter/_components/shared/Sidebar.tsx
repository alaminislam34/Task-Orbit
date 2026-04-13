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
  { label: "Dashboard", href: "/dashboard/recruiter", icon: Gauge },
  {
    label: "My Profile",
    href: "/dashboard/recruiter/profile",
    icon: UserCheck2,
  },
  {
    label: "My Applications",
    href: "/dashboard/recruiter/applications",
    icon: FileTextIcon,
  },
  { label: "Settings", href: "/dashboard/recruiter/settings", icon: Settings2 },
];

export function RecruiterSidebarComponents() {
  return (
    <CommonSidebar
      items={SIDEBAR_ITEMS}
      brandTitle="Recruiter"
      brandHref="/dashboard/recruiter"
      brandIcon={<UserCheck2 className="size-4" />}
      footerText="Manage your recruiter activities from one place."
    />
  );
}
