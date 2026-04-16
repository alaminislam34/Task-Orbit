"use client";

import {
  Bell,
  Compass,
  FileTextIcon,
  Gauge,
  Heart,
  History,
  MessageCircleMore,
  Settings2,
  UserCheck2,
} from "lucide-react";

import {
  CommonSidebar,
  type SidebarItem,
} from "@/components/shared/Sidebar/Sidebar";

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard/seeker", icon: Gauge },
  {
    label: "My Profile",
    href: "/dashboard/seeker/profile",
    icon: UserCheck2,
  },
  {
    label: "My Applications",
    href: "/dashboard/seeker/applications",
    icon: FileTextIcon,
  },
  {
    label: "Saved Jobs",
    href: "/dashboard/seeker/saved-jobs",
    icon: Heart,
  },
  {
    label: "Recently Viewed",
    href: "/dashboard/seeker/recently-viewed",
    icon: History,
  },
  {
    label: "Recommendations",
    href: "/dashboard/seeker/recommendations",
    icon: Compass,
  },
  {
    label: "Conversations",
    href: "/dashboard/seeker/conversations",
    icon: MessageCircleMore,
  },
  {
    label: "Notifications",
    href: "/dashboard/seeker/notifications",
    icon: Bell,
  },
  { label: "Settings", href: "/dashboard/seeker/settings", icon: Settings2 },
];

export function SeekerSidebarComponents() {
  return (
    <CommonSidebar
      items={SIDEBAR_ITEMS}
      brandTitle="Job Seeker"
      brandHref="/dashboard/seeker"
      brandIcon={<UserCheck2 className="size-4" />}
      footerText="Manage your seeker activities from one place."
    />
  );
}
