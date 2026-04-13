"use client";

import {
  FileTextIcon,
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
  { label: "Dashboard", href: "/dashboard/recruiter", icon: Gauge },
  {
    label: "My Profile",
    href: "/dashboard/recruiter/profile",
    icon: UserCheck2,
  },
  {
    label: "Job Applications",
    href: "/dashboard/recruiter/job-applications",
    icon: FileTextIcon,
  },
  {
    label: "Conversations",
    href: "/dashboard/recruiter/conversations",
    icon: MessageCircleMore,
  },
  { label: "Settings", href: "/dashboard/recruiter/settings", icon: Settings2 },
];

export function RecruiterSidebarComponents() {
  return (
    <CommonSidebar
      items={SIDEBAR_ITEMS}
      brandTitle="Job Recruiter"
      brandHref="/dashboard/recruiter"
      brandIcon={<UserCheck2 className="size-4" />}
      footerText="Manage your Recruiter activities from one place."
    />
  );
}
